# Privacy Shield - Tracker Blocker Extension

A privacy-focused browser extension that blocks tracking scripts and protects your online privacy.

## Features

- **Real-time Tracker Blocking**: Automatically blocks known tracking domains using declarativeNetRequest API
- **Categorized Blocking**: Block trackers by category (Advertising, Analytics, Social Media, Fingerprinting, Beacons)
- **Live Statistics**: Badge counter showing blocked trackers on current page
- **Customizable Controls**: User-managed whitelist and blacklist for granular control
- **Comprehensive Analytics**: Detailed statistics showing what's being blocked
- **Performance Optimized**: Low memory and CPU footprint using Manifest V3
- **Cross-Browser Compatible**: Works on Chrome and Firefox

## Installation

### Chrome/Edge

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `tracker-blocker-extension` folder
6. The extension icon should appear in your toolbar

### Firefox

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension folder and select `manifest.json`
5. The extension will be loaded temporarily

## Usage

### Viewing Statistics

Click the extension icon in your toolbar to see:
- Total trackers blocked on the current page
- Breakdown by category (Advertising, Analytics, Social Media, etc.)
- Global statistics across all browsing sessions

### Configuring Settings

1. Click the extension icon
2. Click the "Settings" button
3. In the Settings page you can:
   - View comprehensive blocking statistics
   - Enable/disable blocking by category
   - Add domains to whitelist (allow tracking)
   - Add domains to blacklist (block additional trackers)
   - Reset statistics

### Whitelist/Blacklist

**Whitelist**: Add trusted domains where you want to allow trackers
- Example: `example.com` - allows all trackers on example.com

**Blacklist**: Add additional tracker domains not in the default list
- Example: `tracker.suspicious-site.com` - blocks this specific domain

## How It Works

1. **Request Interception**: Uses declarativeNetRequest API to intercept web requests
2. **Domain Matching**: Compares requested URLs against known tracker domains
3. **Blocking/Allowing**: Blocks matches unless domain is whitelisted
4. **Statistics Tracking**: Records blocked requests and updates badge counter
5. **User Control**: Respects user preferences for categories and custom lists

## Tracker Categories

- **Advertising**: Ad networks and marketing trackers (e.g., DoubleClick, Google Ads)
- **Analytics**: Website analytics and measurement (e.g., Google Analytics, Mixpanel)
- **Social Media**: Social network tracking pixels (e.g., Facebook Pixel, Twitter Analytics)
- **Fingerprinting**: Device fingerprinting scripts (e.g., FingerprintJS)
- **Beacons**: Tracking beacons and pixels

## Default Blocked Domains

The extension blocks over 60 known tracking domains by default, including:
- doubleclick.net
- google-analytics.com
- googletagmanager.com
- facebook.net / connect.facebook.net
- mixpanel.com
- hotjar.com
- And many more...

## Privacy

- **No Data Collection**: This extension does not collect or transmit any user data
- **Local Storage Only**: All statistics and settings are stored locally on your device
- **Open Source**: Code is transparent and auditable
- **No External Connections**: Extension only blocks requests, never initiates them

## Technical Details

- **Manifest Version**: 3
- **API Used**: declarativeNetRequest, storage, tabs, scripting
- **Performance**: Declarative rules processed by browser engine for efficiency
- **Memory Usage**: Minimal footprint due to rule-based blocking
- **Permissions**: Only requests necessary permissions for functionality

## File Structure

```
tracker-blocker-extension/
├── manifest.json              # Extension configuration
├── popup.html                 # Popup interface
├── options.html              # Settings page
├── scripts/
│   ├── background.js         # Background service worker
│   ├── popup.js             # Popup logic
│   └── options.js           # Settings page logic
├── styles/
│   ├── popup.css            # Popup styles
│   └── options.css          # Settings page styles
├── data/
│   ├── trackers.json        # Tracker domain database
│   └── rules.json           # Declarative blocking rules
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Troubleshooting

**Extension not blocking trackers?**
- Check that blocking categories are enabled in Settings
- Verify the domain isn't in your whitelist
- Try disabling and re-enabling the extension

**Website not working properly?**
- Some sites may break if essential scripts are blocked
- Add the domain to your whitelist
- Disable specific blocking categories if needed

**Badge not updating?**
- Refresh the page
- Check that you're on a website (not chrome:// or about:// pages)

## Future Enhancements

- Machine learning-based tracker detection
- Import/export settings
- Sync across devices
- More granular control per website
- Custom blocking rules
- Performance metrics (bandwidth saved)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is provided as-is for educational and personal use.

## Version

Current Version: 1.0.0

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Note**: This extension is designed for privacy protection. While it blocks many trackers, no solution is 100% effective. Combine with other privacy tools for maximum protection.
