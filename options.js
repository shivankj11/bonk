// Options page JavaScript for Website Blocker extension
// Handles UI interactions and storage operations

document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  loadBlockedSites();
  loadBlockingStatus();
  
  // Add event listeners
  document.getElementById('addSite').addEventListener('click', addBlockedSite);
  document.getElementById('activateBlocking').addEventListener('click', activateBlocking);
});

// Load blocked sites from storage and display them
function loadBlockedSites() {
  chrome.storage.sync.get(['blockedSites'], function(result) {
    const blockedSites = result.blockedSites || [];
    const sitesList = document.getElementById('sitesList');
    sitesList.innerHTML = '';
    
    if (blockedSites.length === 0) {
      sitesList.innerHTML = '<p>No websites are currently blocked.</p>';
      return;
    }
    
    blockedSites.forEach(function(site, index) {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      
      const siteName = document.createElement('span');
      siteName.textContent = site;
      
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-btn';
      removeButton.textContent = 'Remove';
      removeButton.dataset.index = index;
      removeButton.addEventListener('click', function() {
        removeBlockedSite(index);
      });
      
      siteItem.appendChild(siteName);
      siteItem.appendChild(removeButton);
      sitesList.appendChild(siteItem);
    });
  });
}

// Add a new site to the blocked list
function addBlockedSite() {
  const newSiteInput = document.getElementById('newSite');
  const site = newSiteInput.value.trim().toLowerCase();
  
  if (!site) {
    alert('Please enter a website to block.');
    return;
  }
  
  // Simple validation for domain format
  const domainRegex = /^(\*\.)?([\w-]+\.)+[\w-]+$/;
  if (!domainRegex.test(site)) {
    alert('Please enter a valid domain (e.g., facebook.com or *.facebook.com)');
    return;
  }
  
  chrome.storage.sync.get(['blockedSites'], function(result) {
    const blockedSites = result.blockedSites || [];
    
    // Check if site is already in the list
    if (blockedSites.includes(site)) {
      alert('This website is already blocked.');
      return;
    }
    
    // Add the new site
    blockedSites.push(site);
    chrome.storage.sync.set({ blockedSites: blockedSites }, function() {
      newSiteInput.value = '';
      loadBlockedSites();
    });
  });
}

// Remove a site from the blocked list
function removeBlockedSite(index) {
  chrome.storage.sync.get(['blockedSites'], function(result) {
    const blockedSites = result.blockedSites || [];
    
    if (index >= 0 && index < blockedSites.length) {
      blockedSites.splice(index, 1);
      chrome.storage.sync.set({ blockedSites: blockedSites }, function() {
        loadBlockedSites();
      });
    }
  });
}

// Activate blocking with the specified duration
function activateBlocking() {
  const durationInput = document.getElementById('blockDuration');
  const duration = parseInt(durationInput.value, 10);
  
  if (isNaN(duration) || duration < 1 || duration > 1440) {
    alert('Please enter a valid duration between 1 and 1440 minutes.');
    return;
  }
  
  chrome.storage.sync.get(['blockedSites'], function(result) {
    const blockedSites = result.blockedSites || [];
    
    if (blockedSites.length === 0) {
      alert('Please add at least one website to block before activating.');
      return;
    }
    
    // Send message to background script to update blocking settings
    chrome.runtime.sendMessage({
      action: 'updateBlockSettings',
      duration: duration
    }, function(response) {
      if (response && response.success) {
        loadBlockingStatus();
      }
    });
  });
}

// Load and display current blocking status
function loadBlockingStatus() {
  chrome.storage.sync.get(['blockEndTime', 'blockDuration'], function(result) {
    const blockEndTime = result.blockEndTime || 0;
    const blockDuration = result.blockDuration || 60;
    const currentTime = Date.now();
    
    // Update duration input
    document.getElementById('blockDuration').value = blockDuration;
    
    // Update status display
    const statusElement = document.getElementById('blockingStatus');
    const timeRemainingElement = document.getElementById('timeRemaining');
    
    if (blockEndTime > currentTime) {
      const remainingMs = blockEndTime - currentTime;
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      
      statusElement.textContent = 'Blocking is active';
      timeRemainingElement.textContent = `Time remaining: ${remainingMinutes} minute(s)`;
      
      // Update the remaining time every minute
      setTimeout(loadBlockingStatus, 60000);
    } else {
      statusElement.textContent = 'Blocking is not active';
      timeRemainingElement.textContent = '';
    }
  });
}
