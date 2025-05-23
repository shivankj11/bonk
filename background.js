// Background script for Website Blocker extension
// Handles website blocking logic and tab management

// Initialize storage with default values if not set
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedSites', 'blockDuration', 'blockEndTime'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
    if (!result.blockDuration) {
      chrome.storage.sync.set({ blockDuration: 60 }); // Default 60 minutes
    }
    if (!result.blockEndTime) {
      chrome.storage.sync.set({ blockEndTime: 0 }); // Default no active blocking
    }
  });

  // Open the setup page on install
  chrome.tabs.create({ url: chrome.runtime.getURL('setup.html') });
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Only process main frame navigation (not iframes)
  if (details.frameId !== 0) return;
  
  const url = new URL(details.url);
  const hostname = url.hostname;
  
  // Check if the site should be blocked
  checkIfBlocked(hostname, details.tabId);
});

// Function to check if a site is blocked
function checkIfBlocked(hostname, tabId) {
  chrome.storage.sync.get(['blockedSites', 'blockEndTime'], (result) => {
    const currentTime = Date.now();
    const blockEndTime = result.blockEndTime || 0;
    
    // Check if blocking is still active
    if (blockEndTime > currentTime) {
      // Check if the hostname is in the blocked list
      const isBlocked = result.blockedSites.some(site => {
        // Convert to regex pattern if needed
        if (site.includes('*')) {
          const pattern = site.replace(/\./g, '\\.').replace(/\*/g, '.*');
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(hostname);
        }
        return hostname === site || hostname.endsWith('.' + site);
      });
      
      if (isBlocked) {
        // Redirect to blocked page
        const blockedUrl = chrome.runtime.getURL('blocked.html');
        chrome.tabs.update(tabId, { url: blockedUrl });
        
        // Set a timeout to close the tab after showing the blocked page
        setTimeout(() => {
          chrome.tabs.remove(tabId);
        }, 3000); // Show blocked page for 3 seconds before closing
      }
    }
  });
}

// Listen for messages from options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBlockSettings') {
    // Update block duration and calculate new end time
    const blockDuration = message.duration;
    const blockEndTime = Date.now() + (blockDuration * 60 * 1000); // Convert minutes to milliseconds
    
    chrome.storage.sync.set({ 
      blockDuration: blockDuration,
      blockEndTime: blockEndTime
    });
    
    sendResponse({ success: true });
  }
  
  // Return true to indicate async response
  return true;
});
