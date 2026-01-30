# Electron Desktop App - Quick Start Guide

## 🚀 Quick Start (30 seconds)

### One-time Setup
```bash
cd /home/niharsh/Desktop/Inventory
npm install
```

### Development (Every Time)

**Terminal 1 - Backend:**
```bash
cd /home/niharsh/Desktop/Inventory/backend
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Electron + Frontend (auto-starts both):**
```bash
cd /home/niharsh/Desktop/Inventory
npm run dev
```

Wait 10-15 seconds... Electron window opens automatically! 🎉

---

## ✨ What You Get

| Feature | Works? |
|---------|--------|
| Billing forms | ✅ Yes |
| Printing (Print button) | ✅ Yes (same as browser) |
| Auto-login with token | ✅ Yes |
| Offline mode | ✅ Yes (localStorage) |
| Dark theme | ✅ Yes |
| Search/autocomplete | ✅ Yes |
| HSN codes | ✅ Yes |
| React hot-reload | ✅ Yes (DevTools auto-open) |
| All existing features | ✅ Yes (nothing changed!) |

---

## 🛠 Development Tips

### DevTools (Debugging)
DevTools automatically open during `npm run dev`. Use F12 or Ctrl+Shift+I to toggle.

### Hot Reload
React files automatically reload when you save. Just edit and save!

### File Structure
```
electron/
├── main.js          ← Electron main process (don't change)
└── preload.js       ← Security (don't change)

frontend/
├── src/
│   ├── pages/       ← Your React pages
│   ├── components/  ← Your React components
│   └── App.jsx      ← No changes needed
└── vite.config.js   ← Already configured

backend/
└── (unchanged)
```

---

## 📦 Building for Distribution

### 1. Build React (creates optimized files)
```bash
npm run build
```

### 2. Create Windows Installer
```bash
npm run dist
```

Output:
```
dist-electron/
├── Choudhary Medical Store-1.0.0.exe      ← Installer
└── Choudhary Medical Store-1.0.0-portable.exe ← Portable version
```

### 3. Share the .exe file with users
They double-click it → software installs → desktop shortcut created!

---

## ⚡ Individual Commands

```bash
# Full development (backend + frontend + electron)
npm run dev

# Just React dev server
npm run dev:frontend

# Just Django backend
npm run dev:backend

# Just Electron (requires frontend running)
npm run dev:electron

# Build React only (no installer)
npm run build

# Build installer (.exe)
npm run dist

# Build portable .exe (no installer needed)
npm run dist:portable
```

---

## 🖨 Printing Setup

### From Invoice Detail Page
1. Click **"Print"** button
2. Print dialog appears (same as browser print)
3. Select printer or "Print to PDF"
4. Click Print → Done!

**Note:** Printing works exactly like browser. No special setup needed.

---

## 🔌 Backend Connection

App automatically connects to `http://localhost:8000` (your Django backend).

If backend is offline:
- App uses cached data from localStorage
- Offline mode works (shows last saved data)
- When backend comes back online, syncs automatically

---

## ❓ Troubleshooting

### Electron window blank?
```bash
# Kill any existing processes
pkill -f "node"
pkill -f "electron"

# Restart
npm run dev
```

### Backend connection error?
```bash
# Verify backend running
curl http://localhost:8000/api/

# If error, start backend
cd backend && python manage.py runserver 0.0.0.0:8000
```

### Printing doesn't work?
1. Check printer is installed on Windows
2. In Electron, ensure you click Print (not Ctrl+P)
3. Try "Print to PDF" option first

### "Cannot find module" error?
```bash
npm install
```

---

## 📋 Checklist Before Distribution

- [ ] Backend working: `curl http://localhost:8000/api/`
- [ ] Frontend hot-reload working (edit a file, save, refresh)
- [ ] Printing tested (create invoice, print it)
- [ ] Offline mode tested (disconnect backend, app still works with cache)
- [ ] Auto-login tested (restart app, should load dashboard if token exists)
- [ ] All pages load without console errors (DevTools)

Then build:
```bash
npm run dist
```

---

## 🎯 Remember

✅ **NO React code changes needed**
✅ **NO authentication changes needed**
✅ **NO routing changes needed**
✅ **NO printing code changes needed**
✅ **Just wrap existing app with Electron!**

All your existing React components, pages, and logic work exactly as-is! The app simply runs in Electron instead of browser.

---

## 📞 Quick Reference

| Situation | Command |
|-----------|---------|
| First time setup | `npm install` |
| Daily development | `npm run dev` |
| Build for sharing | `npm run build && npm run dist` |
| Check backend | `curl http://localhost:8000/api/` |
| Open DevTools | F12 during `npm run dev` |

---

Happy developing! 🚀
