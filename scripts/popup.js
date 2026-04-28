// Popup script for Privacy Shield
document.addEventListener('DOMContentLoaded', async () => {
  loadStats();
  
  // Set up event listeners
  document.getElementById('openOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('refreshStats').addEventListener('click', () => {
    loadStats();
  });
});

// Load and display statistics
async function loadStats() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.runtime.sendMessage(
      { action: 'getStats', tabId: tab.id },
      (response) => {
        if (response) {
          updateDisplay(response.tabStats, response.globalStats);
        }
      }
    );
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Update the display with stats
function updateDisplay(tabStats, globalStats) {
  // Update main counter
  document.getElementById('totalBlocked').textContent = tabStats.total || 0;
  
  // Update category counts
  const categories = ['advertising', 'analytics', 'social', 'fingerprinting', 'beacons'];
  categories.forEach(category => {
    const count = tabStats.byCategory[category] || 0;
    document.getElementById(category).textContent = count;
  });
  
  // Update global stats
  document.getElementById('globalTotal').textContent = globalStats.totalBlocked || 0;
  
  // Add visual feedback
  const totalBlocked = tabStats.total || 0;
  const mainStat = document.querySelector('.main-stat');
  mainStat.classList.remove('low', 'medium', 'high');
  
  if (totalBlocked > 0) {
    if (totalBlocked <= 5) {
      mainStat.classList.add('low');
    } else if (totalBlocked <= 15) {
      mainStat.classList.add('medium');
    } else {
      mainStat.classList.add('high');
    }
  }
}
