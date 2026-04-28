# Privacy Shield - Quick Installation Guide

## What You'll Get

A complete, working browser extension with:
- Real-time tracker blocking
- Live statistics badge
- Customizable whitelist/blacklist
- Category-based blocking controls
- Professional UI with settings page

## Installation Steps

### For Chrome/Edge/Brave

1. **Extract the Files**
   - Unzip `tracker-blocker-extension.zip` to a folder on your computer
   - Or use the `tracker-blocker-extension` folder directly

2. **Open Extensions Page**
   - Open Chrome/Edge/Brave
   - Navigate to: `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Browse to and select the `tracker-blocker-extension` folder
   - Click "Select Folder"

5. **Done!**
   - Extension icon should appear in your toolbar
   - Click the icon to see tracker blocking in action
   - Visit any website and watch trackers get blocked!

### For Firefox

1. **Extract the Files**
   - Unzip `tracker-blocker-extension.zip` to a folder

2. **Open Debugging Page**
   - Open Firefox
   - Navigate to: `about:debugging#/runtime/this-firefox`

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..." button
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - Click "Open"

4. **Done!**
   - Extension will load (temporary installation)
   - Note: Temporary add-ons are removed when Firefox restarts

### Alternative: Load as ZIP (Chrome Web Store Developer)

If you have Chrome Web Store developer account:
- Upload `tracker-blocker-extension.zip` directly to Chrome Web Store
- Follow Chrome's extension submission process

## First Use

1. **Click the Extension Icon**
   - You'll see the popup with "0" trackers blocked initially

2. **Visit Any Website**
   - Navigate to any news site or commercial website
   - Watch the badge counter increment as trackers are blocked!

3. **Try These Sites** (for testing):
   - news.google.com
   - cnn.com
   - forbes.com
   - You should see 10-30+ trackers blocked on these sites

4. **Open Settings**
   - Click the extension icon
   - Click "Settings" button
   - Explore the configuration options

## Quick Settings Guide

### Enable/Disable Categories
- Toggle specific tracker types on/off
- Useful if a site breaks due to blocking

### Whitelist a Site
1. Go to Settings
2. Scroll to "Whitelist" section
3. Enter domain: `example.com`
4. Click "Add to Whitelist"

### Blacklist Additional Trackers
1. Go to Settings
2. Scroll to "Blacklist" section
3. Enter tracker domain
4. Click "Add to Blacklist"

## Troubleshooting

**No trackers blocked?**
- Make sure you're on a regular website (not chrome:// or about:// pages)
- Check that categories are enabled in Settings
- Try visiting a different website

**Website not working?**
- Click extension icon
- Go to Settings
- Add the domain to your whitelist

**Badge not showing?**
- Refresh the webpage
- Click the extension icon to trigger an update

## What Gets Blocked?

Out of the box, blocks 60+ tracking domains including:
- Google Analytics
- Facebook Pixel
- DoubleClick
- Mixpanel
- Hotjar
- Criteo
- And many more...

## Privacy Note

This extension:
- Does NOT collect any data
- Does NOT send data anywhere
- Stores everything locally on your device
- Is completely transparent and auditable

## Need Help?

Check the full README.md in the extension folder for:
- Detailed documentation
- File structure
- Technical details
- Customization options

---

Enjoy your privacy-protected browsing! 🛡️
