// Background service worker for Privacy Shield
let blockStats = {};
let globalStats = {
  totalBlocked: 0,
  byCategory: {
    advertising: 0,
    analytics: 0,
    social: 0,
    fingerprinting: 0,
    beacons: 0
  },
  blockHistory: []
};

// Load tracker domains
let trackerDomains = {};
fetch(chrome.runtime.getURL('data/trackers.json'))
  .then(response => response.json())
  .then(data => {
    trackerDomains = data.trackerDomains;
    initializeExtension();
  });

// Initialize extension
async function initializeExtension() {
  // Load saved stats
  const result = await chrome.storage.local.get(['globalStats', 'whitelist', 'blacklist', 'enabledCategories']);
  
  if (result.globalStats) {
    globalStats = result.globalStats;
  }
  
  if (!result.enabledCategories) {
    // Enable all categories by default
    await chrome.storage.local.set({
      enabledCategories: {
        advertising: true,
        analytics: true,
        social: true,
        fingerprinting: true,
        beacons: true
      }
    });
  }
  
  if (!result.whitelist) {
    await chrome.storage.local.set({ whitelist: [] });
  }
  
  if (!result.blacklist) {
    await chrome.storage.local.set({ blacklist: [] });
  }
}

// Listen for requests being blocked
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((details) => {
  handleBlockedRequest(details);
});

// Handle blocked requests
function handleBlockedRequest(details) {
  const tabId = details.request.tabId;
  const url = details.request.url;
  
  if (tabId < 0) return; // Skip background requests
  
  // Initialize stats for this tab
  if (!blockStats[tabId]) {
    blockStats[tabId] = {
      total: 0,
      byCategory: {
        advertising: 0,
        analytics: 0,
        social: 0,
        fingerprinting: 0,
        beacons: 0
      }
    };
  }
  
  // Categorize the blocked request
  const category = categorizeTracker(url);
  
  // Update stats
  blockStats[tabId].total++;
  if (category) {
    blockStats[tabId].byCategory[category]++;
    globalStats.byCategory[category]++;
  }
  
  globalStats.totalBlocked++;
  
  // Update badge
  updateBadge(tabId);
  
  // Save global stats periodically
  saveGlobalStats();
}

// Categorize tracker by domain
function categorizeTracker(url) {
  for (const [category, domains] of Object.entries(trackerDomains)) {
    for (const domain of domains) {
      if (url.includes(domain)) {
        return category;
      }
    }
  }
  return null;
}

// Update badge counter
function updateBadge(tabId) {
  const count = blockStats[tabId]?.total || 0;
  
  chrome.action.setBadgeText({
    text: count > 0 ? count.toString() : '',
    tabId: tabId
  });
  
  // Color code based on number of trackers
  let color = '#4CAF50'; // Green
  if (count > 10) color = '#FF9800'; // Orange
  if (count > 25) color = '#F44336'; // Red
  
  chrome.action.setBadgeBackgroundColor({
    color: color,
    tabId: tabId
  });
}

// Save global stats
let saveTimeout;
function saveGlobalStats() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    chrome.storage.local.set({ globalStats });
  }, 1000);
}

// Reset stats when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    blockStats[tabId] = {
      total: 0,
      byCategory: {
        advertising: 0,
        analytics: 0,
        social: 0,
        fingerprinting: 0,
        beacons: 0
      }
    };
    updateBadge(tabId);
  }
});

// Clean up stats when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete blockStats[tabId];
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    const tabId = request.tabId;
    sendResponse({
      tabStats: blockStats[tabId] || { total: 0, byCategory: {} },
      globalStats: globalStats
    });
  } else if (request.action === 'resetStats') {
    globalStats = {
      totalBlocked: 0,
      byCategory: {
        advertising: 0,
        analytics: 0,
        social: 0,
        fingerprinting: 0,
        beacons: 0
      },
      blockHistory: []
    };
    chrome.storage.local.set({ globalStats });
    sendResponse({ success: true });
  } else if (request.action === 'updateRules') {
    updateBlockingRules();
    sendResponse({ success: true });
  }
  return true;
});

// Update blocking rules based on whitelist/blacklist
async function updateBlockingRules() {
  const result = await chrome.storage.local.get(['whitelist', 'blacklist', 'enabledCategories']);
  const whitelist = result.whitelist || [];
  const blacklist = result.blacklist || [];
  const enabledCategories = result.enabledCategories || {};
  
  // Build dynamic rules
  const rules = [];
  let ruleId = 100; // Start after static rules
  
  // Add whitelist rules (higher priority)
  for (const domain of whitelist) {
    rules.push({
      id: ruleId++,
      priority: 2,
      action: { type: "allow" },
      condition: {
        urlFilter: `*${domain}*`,
        resourceTypes: ["script", "xmlhttprequest", "image", "sub_frame"]
      }
    });
  }
  
  // Add blacklist rules
  for (const domain of blacklist) {
    rules.push({
      id: ruleId++,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `*${domain}*`,
        resourceTypes: ["script", "xmlhttprequest", "image", "sub_frame"]
      }
    });
  }
  
  // Update rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRuleIds,
    addRules: rules
  });
}

// Initialize rules on install
chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
});
