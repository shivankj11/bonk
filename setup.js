// Setup page JavaScript for Website Blocker extension
// Handles initial configuration and redirects to options page after setup

document.addEventListener('DOMContentLoaded', function() {
  // Add event listener for the complete setup button
  document.getElementById('completeSetup').addEventListener('click', saveInitialSettings);
});

// Save initial settings and mark setup as complete
function saveInitialSettings() {
  const initialSitesInput = document.getElementById('initialSites').value.trim();
  const initialDuration = parseInt(document.getElementById('initialDuration').value, 10) || 60;
  
  // Process the comma-separated list of sites
  let blockedSites = [];
  if (initialSitesInput) {
    blockedSites = initialSitesInput.split(',')
      .map(site => site.trim().toLowerCase())
      .filter(site => site); // Remove empty entries
  }
  
  // Validate duration
  const duration = (initialDuration < 1 || initialDuration > 1440) ? 60 : initialDuration;
  
  // Save settings to Chrome storage
  chrome.storage.sync.set({
    blockedSites: blockedSites,
    blockDuration: duration,
    blockEndTime: 0, // No active blocking initially
    setupComplete: true // Mark setup as complete
  }, function() {
    // Redirect to options page after saving
    chrome.runtime.openOptionsPage();
  });
}
