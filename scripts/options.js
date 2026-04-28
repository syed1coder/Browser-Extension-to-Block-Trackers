// Options page script for Privacy Shield
let whitelist = [];
let blacklist = [];
let enabledCategories = {};

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadStats();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Reset stats
  document.getElementById('resetStats').addEventListener('click', resetStats);
  
  // Category toggles
  const categories = ['advertising', 'analytics', 'social', 'fingerprinting', 'beacons'];
  categories.forEach(category => {
    const toggle = document.getElementById(`toggle${capitalize(category)}`);
    toggle.addEventListener('change', () => {
      enabledCategories[category] = toggle.checked;
      saveSettings();
    });
  });
  
  // Whitelist
  document.getElementById('addWhitelist').addEventListener('click', addToWhitelist);
  document.getElementById('whitelistInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToWhitelist();
  });
  
  // Blacklist
  document.getElementById('addBlacklist').addEventListener('click', addToBlacklist);
  document.getElementById('blacklistInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToBlacklist();
  });
}

// Load settings from storage
async function loadSettings() {
  const result = await chrome.storage.local.get(['whitelist', 'blacklist', 'enabledCategories']);
  
  whitelist = result.whitelist || [];
  blacklist = result.blacklist || [];
  enabledCategories = result.enabledCategories || {
    advertising: true,
    analytics: true,
    social: true,
    fingerprinting: true,
    beacons: true
  };
  
  // Update UI
  updateWhitelistDisplay();
  updateBlacklistDisplay();
  
  // Update toggles
  for (const [category, enabled] of Object.entries(enabledCategories)) {
    const toggle = document.getElementById(`toggle${capitalize(category)}`);
    if (toggle) toggle.checked = enabled;
  }
}

// Load statistics
async function loadStats() {
  const result = await chrome.storage.local.get(['globalStats']);
  const stats = result.globalStats || {
    totalBlocked: 0,
    byCategory: {
      advertising: 0,
      analytics: 0,
      social: 0,
      fingerprinting: 0,
      beacons: 0
    }
  };
  
  document.getElementById('totalBlockedStat').textContent = stats.totalBlocked.toLocaleString();
  document.getElementById('adsStat').textContent = stats.byCategory.advertising.toLocaleString();
  document.getElementById('analyticsStat').textContent = stats.byCategory.analytics.toLocaleString();
  document.getElementById('socialStat').textContent = stats.byCategory.social.toLocaleString();
}

// Save settings to storage
async function saveSettings() {
  await chrome.storage.local.set({
    whitelist,
    blacklist,
    enabledCategories
  });
  
  // Update blocking rules
  chrome.runtime.sendMessage({ action: 'updateRules' });
}

// Add domain to whitelist
function addToWhitelist() {
  const input = document.getElementById('whitelistInput');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) {
    alert('Please enter a domain');
    return;
  }
  
  if (whitelist.includes(domain)) {
    alert('Domain already in whitelist');
    return;
  }
  
  whitelist.push(domain);
  input.value = '';
  updateWhitelistDisplay();
  saveSettings();
}

// Add domain to blacklist
function addToBlacklist() {
  const input = document.getElementById('blacklistInput');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) {
    alert('Please enter a domain');
    return;
  }
  
  if (blacklist.includes(domain)) {
    alert('Domain already in blacklist');
    return;
  }
  
  blacklist.push(domain);
  input.value = '';
  updateBlacklistDisplay();
  saveSettings();
}

// Remove from whitelist
function removeFromWhitelist(domain) {
  whitelist = whitelist.filter(d => d !== domain);
  updateWhitelistDisplay();
  saveSettings();
}

// Remove from blacklist
function removeFromBlacklist(domain) {
  blacklist = blacklist.filter(d => d !== domain);
  updateBlacklistDisplay();
  saveSettings();
}

// Update whitelist display
function updateWhitelistDisplay() {
  const container = document.getElementById('whitelistDomains');
  
  if (whitelist.length === 0) {
    container.innerHTML = '<p class="empty-message">No whitelisted domains</p>';
    return;
  }
  
  container.innerHTML = whitelist.map(domain => `
    <div class="domain-item">
      <span class="domain-name">${domain}</span>
      <button class="btn-remove" onclick="removeFromWhitelist('${domain}')">Remove</button>
    </div>
  `).join('');
}

// Update blacklist display
function updateBlacklistDisplay() {
  const container = document.getElementById('blacklistDomains');
  
  if (blacklist.length === 0) {
    container.innerHTML = '<p class="empty-message">No blacklisted domains</p>';
    return;
  }
  
  container.innerHTML = blacklist.map(domain => `
    <div class="domain-item">
      <span class="domain-name">${domain}</span>
      <button class="btn-remove" onclick="removeFromBlacklist('${domain}')">Remove</button>
    </div>
  `).join('');
}

// Reset statistics
function resetStats() {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    chrome.runtime.sendMessage({ action: 'resetStats' }, () => {
      loadStats();
      alert('Statistics have been reset');
    });
  }
}

// Utility function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make functions available globally for inline onclick handlers
window.removeFromWhitelist = removeFromWhitelist;
window.removeFromBlacklist = removeFromBlacklist;
