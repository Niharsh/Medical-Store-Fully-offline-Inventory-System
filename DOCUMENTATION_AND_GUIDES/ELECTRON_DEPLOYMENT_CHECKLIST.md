# Electron Deployment Checklist

## Pre-Deployment Verification

### Development Environment Tests

- [ ] **Setup Verification**
  ```bash
  bash setup-electron.sh
  ```
  Expected: ✅ All checks pass

- [ ] **Backend Running**
  ```bash
  cd backend
  python manage.py runserver 0.0.0.0:8000
  ```
  Expected: Server running on port 8000, no errors

- [ ] **Development Start**
  ```bash
  cd /home/niharsh/Desktop/Inventory
  npm run dev
  ```
  Expected: Electron window opens within 15 seconds

- [ ] **DevTools Access**
  - [ ] DevTools open automatically
  - [ ] F12 toggles DevTools
  - [ ] Console shows no errors

### Feature Testing (In Electron Window)

#### Authentication
- [ ] **Login Page Loads**
  - Page displays correctly
  - No console errors
  - Form fields accessible

- [ ] **Auto-Login Works**
  - Create login, create bill, close app
  - Restart app: should load Dashboard (not Login)
  - Token saved in localStorage

- [ ] **Signup Works**
  - First-time user can complete signup
  - Owner details saved
  - Redirects to Dashboard

#### Inventory
- [ ] **Product Search**
  - [ ] Autocomplete loads products
  - [ ] Search filters work
  - [ ] Product details display

- [ ] **HSN Integration**
  - [ ] HSN dropdown shows codes
  - [ ] GST rate displays
  - [ ] Selecting HSN updates GST

- [ ] **Offline Mode**
  - Stop backend server
  - Refresh app (Ctrl+R)
  - App loads cached data
  - Can view existing bills

#### Billing
- [ ] **Create Invoice**
  - [ ] Add items to bill
  - [ ] Prices calculate correctly
  - [ ] GST applies (auto-filled from HSN)
  - [ ] Total displays correctly

- [ ] **Customer Details**
  - [ ] DL number field visible (if exists)
  - [ ] Customer name displays
  - [ ] Optional fields work

- [ ] **Printing**
  - [ ] Click Print button
  - [ ] Print dialog appears
  - [ ] Can select printer
  - [ ] Can print to PDF
  - [ ] Half A4 format correct
  - [ ] 10-12 items per page

- [ ] **Invoice List**
  - [ ] View all invoices
  - [ ] Search works
  - [ ] Filter works
  - [ ] Edit button works

#### Settings
- [ ] **Shop Details**
  - [ ] Display name
  - [ ] Address
  - [ ] GST number
  - [ ] Save works

- [ ] **HSN Management**
  - [ ] Add new HSN code
  - [ ] Edit HSN rate
  - [ ] Delete HSN

- [ ] **Backup/Restore**
  - [ ] Backup functionality
  - [ ] Restore functionality

### Performance Tests

- [ ] **App Startup**
  - Time to load: < 5 seconds
  - Auto-login: < 3 seconds
  - No blank screen

- [ ] **Search Performance**
  - Product search: < 1 second
  - HSN search: < 1 second
  - Invoice search: < 2 seconds

- [ ] **Hot Reload** (Dev only)
  - Edit React component
  - Save file
  - App updates without full reload
  - State preserved

### Offline Testing

- [ ] **Start App With Backend**
  - [ ] Login to create token
  - [ ] Create a bill (with backend)
  - [ ] Close backend

- [ ] **Restart App**
  - [ ] App loads (offline)
  - [ ] Previous bills visible
  - [ ] Can view bills
  - [ ] Can search bills
  - [ ] Can print bills

- [ ] **Backend Comes Back**
  - [ ] Restart backend
  - [ ] Refresh app (Ctrl+R)
  - [ ] App syncs new bills
  - [ ] Data consistent

### Windows Integration

- [ ] **Desktop Shortcut**
  - [ ] Shortcut works (double-click)
  - [ ] App launches
  - [ ] Icon displays

- [ ] **Start Menu**
  - [ ] Entry appears in Start menu
  - [ ] Can launch from Start menu
  - [ ] Shortcut works

---

## Build & Packaging

### Build for Distribution

```bash
cd /home/niharsh/Desktop/Inventory

# Clean build (optional)
rm -rf frontend/dist
rm -rf dist-electron

# Build React
npm run build
```

Expected output:
```
frontend/dist/
├── index.html
├── assets/
│   ├── app-*.js
│   ├── react-vendor-*.js
│   └── ...
└── ...
```

- [ ] Build completes without errors
- [ ] frontend/dist/ contains HTML + JS files
- [ ] No console errors

### Create Installer

```bash
npm run dist
```

Expected output:
```
dist-electron/
├── Choudhary Medical Store-1.0.0.exe
├── Choudhary Medical Store-1.0.0-portable.exe
└── builder-effective-config.yaml
```

- [ ] Installer created
- [ ] Portable .exe created
- [ ] File sizes reasonable (> 50MB)
- [ ] No errors in console

### File Verification

```bash
# Check file sizes
ls -lh dist-electron/*.exe

# Installer should be ~80-150MB
# Portable should be ~80-150MB
```

- [ ] Both .exe files created
- [ ] File sizes > 50MB (contains app + dependencies)
- [ ] Timestamps recent

---

## Installation Testing

### On Test Machine

1. **Copy Installer**
   - [ ] Copy `Choudhary Medical Store-1.0.0.exe` to test machine
   - [ ] Verify file integrity (check file size matches)

2. **Run Installer**
   ```bash
   # On Windows (or in VM)
   "Choudhary Medical Store-1.0.0.exe"
   ```
   Expected:
   - [ ] NSIS installer window appears
   - [ ] Can choose installation directory
   - [ ] Installation progress shows
   - [ ] "Finish" button appears

3. **Post-Installation**
   - [ ] Desktop shortcut created
   - [ ] Start menu entry created
   - [ ] Uninstaller available in Control Panel

4. **Launch from Shortcut**
   - [ ] Desktop icon created
   - [ ] Double-click → App launches
   - [ ] Loads login page (or auto-login if token exists)
   - [ ] Backend connection attempt
   - [ ] Offline fallback if backend unavailable

5. **Feature Testing (Post-Install)**
   - [ ] All billing features work
   - [ ] Printing works
   - [ ] Offline mode works (if backend stopped)
   - [ ] Auto-login works (on restart)

6. **Uninstallation**
   - [ ] Control Panel → Programs → Remove
   - [ ] App uninstalls completely
   - [ ] Desktop shortcut removed
   - [ ] Start menu entry removed

---

## End-User Delivery

### Distribution Package

```
📦 Deliverables/
├── Choudhary Medical Store-1.0.0.exe
├── Choudhary Medical Store-1.0.0-portable.exe
├── INSTALLATION_GUIDE.txt
├── QUICK_START.txt
└── SUPPORT_CONTACT.txt
```

### Installation Guide (for End Users)

**INSTALLATION_GUIDE.txt:**
```
CHOUDHARY MEDICAL STORE - INSTALLATION GUIDE

1. SYSTEM REQUIREMENTS
   - Windows 10 or later
   - 500 MB disk space
   - Internet connection (for backend)

2. INSTALLATION
   a) Double-click: Choudhary Medical Store-1.0.0.exe
   b) Click "Install"
   c) Choose installation folder (default OK)
   d) Wait for completion
   e) Click "Finish"

3. FIRST RUN
   - Desktop icon created
   - Click icon to launch app
   - Create admin account (first time only)
   - Start using!

4. FEATURES
   - Create and print invoices
   - Manage inventory
   - Track billing
   - Works offline (with cached data)

5. TROUBLESHOOTING
   - If blank screen: Restart app
   - If can't print: Check printer is installed
   - For support: Contact [support email/phone]

ENJOY USING CHOUDHARY MEDICAL STORE! ✅
```

### Quick Start (for End Users)

**QUICK_START.txt:**
```
QUICK START - CHOUDHARY MEDICAL STORE

DAILY USE:
1. Launch app (double-click desktop icon)
2. Login with your credentials
3. Create/manage bills
4. Print invoices when needed

BILLING:
- Click "Billing" in navigation
- Search for product
- Add quantity
- Click "Print" to print

OFFLINE MODE:
- App works without internet
- Previous bills accessible
- When backend returns: auto-syncs

SUPPORT:
- Contact: [email/phone]
- Hours: [business hours]
```

---

## Post-Deployment Monitoring

### First Week Checklist

- [ ] **User Feedback**
  - [ ] No crash reports
  - [ ] Printing works for all users
  - [ ] Offline mode working
  - [ ] Auto-login working

- [ ] **Monitoring**
  - [ ] Check backend error logs
  - [ ] Verify database integrity
  - [ ] Monitor backend uptime

- [ ] **Issues Tracked**
  - [ ] Document any issues
  - [ ] Prioritize by severity
  - [ ] Plan patches

### Monthly Checklist

- [ ] **Performance**
  - [ ] App startup time
  - [ ] Search performance
  - [ ] Print latency

- [ ] **Data Integrity**
  - [ ] Backup verification
  - [ ] Invoice accuracy
  - [ ] Stock calculations

- [ ] **Updates Needed?**
  - [ ] Version bump?
  - [ ] New features?
  - [ ] Bug fixes?

---

## Emergency Procedures

### If Users Can't Launch

```bash
# Completely reinstall
1. Uninstall via Control Panel
2. Delete C:\Users\[User]\AppData\Local\Choudhary Medical Store
3. Download fresh .exe
4. Run installer again
```

### If Printing Fails

```bash
1. Check printer is installed on Windows
2. Try "Print to PDF" first
3. Restart app
4. Try printing again
```

### If Backend Unavailable

```bash
App should:
1. Load cached data automatically ✅
2. Show offline indicator
3. Re-sync when backend returns ✅

No action needed - app handles this!
```

### If Invoice Data Lost

```bash
1. Check backend database backup
2. Restore from backup (DevOps)
3. Users refresh app
4. Data restored
```

---

## Rollback Plan (If Needed)

```bash
# If new version has critical issues:
1. Previous .exe available in dist-electron/ folder
2. Distribute old .exe to users
3. Users uninstall new version
4. Users install old version
5. Works immediately (old data intact)
```

---

## Version Updates (Future)

```bash
1. Make code changes
2. Test in dev (npm run dev)
3. Update version in package.json
4. Run: npm run dist
5. New .exe created in dist-electron/
6. Distribute to users
7. Users uninstall old, install new
8. Data preserved (localStorage)
```

---

## Sign-Off

### Pre-Deployment Review

- [ ] All tests passed
- [ ] No breaking changes
- [ ] Documentation complete
- [ ] Rollback plan ready
- [ ] Support team trained

### Deployment Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| DevOps | | | |
| Manager | | | |

### Go-Live Date

**Scheduled**: [Date]  
**Approved**: [Date]  
**Deployed**: [Date]  

---

## Appendix: Helpful Commands

```bash
# Development
cd /home/niharsh/Desktop/Inventory
npm run dev                          # Full dev with electron
npm run dev:frontend                # Just React
npm run dev:electron                # Just Electron

# Building
npm run build                       # Build React
npm run dist                        # Build installer
npm run dist:portable               # Build portable exe

# Cleanup (if needed)
rm -rf frontend/dist                # Delete built files
rm -rf dist-electron                # Delete installers
rm -rf node_modules                 # Delete dependencies (heavy!)

# Check versions
node --version
npm --version
python --version
electron --version                  # After npm install
```

---

**Deployment Document Version**: 1.0  
**Last Updated**: January 29, 2026  
**Status**: Ready for Deployment ✅
