# Chrome Website Blocker Extension Design

## Extension Structure
The extension will consist of the following components:

1. **Manifest File**: `manifest.json` - Defines extension metadata, permissions, and component references
2. **Background Script**: `background.js` - Handles website blocking logic and tab management
3. **Options Page**: `options.html` and `options.js` - UI for managing blocked websites and timing
4. **Blocking Page**: `blocked.html` - Displays image when blocked site is accessed
5. **Assets**: Icons and blocking image

## Manifest Configuration
The manifest will use Manifest V3 and include:
- Basic metadata (name, version, description)
- Permissions for tabs, storage, and webNavigation
- Background service worker
- Options page reference
- Web accessible resources for the blocking page and image

## Background Script Functionality
- Monitor web navigation events
- Check if navigated URL matches blocked list
- If blocked, redirect to blocking page
- Implement timer logic for temporary blocking
- Close tab after showing blocking page

## Options Page Design
- Form to add new websites to block list
- List of currently blocked websites with ability to remove
- Duration selector for temporary blocking (hours/minutes)
- Save/load functionality using Chrome storage API

## Blocking Page Design
- Display custom image
- Show message about site being blocked
- Auto-close tab after brief delay

## Data Storage
- Use Chrome's storage.sync API to store:
  - List of blocked websites
  - Blocking duration settings
  - Blocking end time
