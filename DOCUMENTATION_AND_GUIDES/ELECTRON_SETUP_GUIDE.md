# Electron Setup for Choudhary Medical Store

## Project Structure

```
Inventory/
├── electron/                    # ← NEW: Electron main process
│   ├── main.js                  # ← Electron entry point
│   └── preload.js               # ← Security preload script
├── frontend/
│   ├── src/
│   ├── dist/                    # Built React app (production)
│   ├── package.json             # React dependencies
│   └── vite.config.js           # Updated for Electron
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
├── package.json                 # ← NEW: Root package.json (Electron + scripts)
└── .gitignore
```

---

## Installation & Setup

### Step 1: Install Root Dependencies
```bash
cd /home/niharsh/Desktop/Inventory
npm install
```

This installs:
- `electron` - Desktop framework
- `electron-builder` - For creating .exe installer
- `electron-is-dev` - Detect dev vs prod mode
- `concurrently` - Run multiple commands
- `wait-on` - Wait for dev server startup

### Step 2: Install Frontend Dependencies (if not already installed)
```bash
cd frontend
npm install
```

### Step 3: Ensure Backend is Running
```bash
cd backend
python manage.py runserver 0.0.0.0:8000
```

---

## Development Mode

### Option A: Full Development (All 3 processes)
```bash
npm run dev
```

This runs:
1. **Backend**: Django at `http://localhost:8000`
2. **Frontend (Vite)**: React dev server at `http://localhost:5173`
3. **Electron**: Loads from Vite dev server

### Option B: Frontend Only (for quick testing)
```bash
cd frontend
npm run dev
```
Then manually launch Electron:
```bash
npm run dev:electron
```

### Option C: Manual Control
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Electron
npm run dev:electron
```

---

## Production Build & Packaging

### Build React App
```bash
npm run build
```
Creates optimized build in `frontend/dist/`

### Create Windows Installer (.exe)
```bash
npm run dist
```

This:
1. Builds React app
2. Creates Windows installer via electron-builder
3. Outputs to `dist-electron/` folder
4. Generates:
   - `Choudhary Medical Store-1.0.0.exe` - NSIS installer
   - `Choudhary Medical Store-1.0.0-portable.exe` - Portable version

### Portable Executable (no install required)
```bash
npm run dist:portable
```

---

## How It Works

### Development Flow
1. **npm run dev** starts Vite dev server on port 5173
2. **wait-on** waits for server startup
3. **Electron** loads http://localhost:5173 in Electron window
4. **React** hot-reloads normally with HMR
5. **DevTools** open automatically for debugging

### Production Flow
1. **npm run build** compiles React to static files in `dist/`
2. **Electron-builder** packages app with:
   - Electron runtime
   - React build files
   - Node modules
3. **Windows installer** (NSIS) created
4. **Shortcuts** created on Desktop & Start Menu
5. **App** loads static files from `electron/dist/index.html`

---

## Printing Support

✅ **Printing works without any changes!**

- Existing `@media print` CSS respected
- `window.print()` calls work in Electron
- Half A4 page format maintained
- 10-12 items per page preserved
- No blank pages (same as browser)

**How to test printing:**
1. Create/view an invoice
2. Click "Print" button
3. Dialog appears (same as browser)
4. Select printer or "Print to PDF"
5. Works perfectly!

---

## Auto-Login on Startup

✅ **Already works!**

The app checks for auth token in localStorage on startup:
- If token exists → loads Dashboard automatically
- If token missing → shows Login page
- Works offline with cached data

No changes needed!

---

## Key Electron Configuration

### Security Settings (preload.js & main.js)
```javascript
webPreferences: {
  nodeIntegration: false,        // Disabled for security
  contextIsolation: true,         // Isolate renderer & main
  preload: path.join(__dirname, 'preload.js'), // Limited API
}
```

### Dev vs Production
- **Development**: Loads from `http://localhost:5173` (Vite dev server)
- **Production**: Loads from `frontend/dist/index.html` (static files)

### Window Configuration
```javascript
width: 1400,      // Good for billing forms
height: 900,      // Standard desktop height
minWidth: 1000,   // Prevent too-small windows
minHeight: 700,   // Maintain usability
```

---

## Installer Features

### NSIS Installer (.exe)
- **One-click installation** option (disabled for user control)
- **Installation directory** selection
- **Desktop shortcut** created automatically
- **Start Menu entry** created automatically
- **Uninstaller** included

### After Installation
- Users can:
  - Double-click desktop icon to launch
  - Find in Windows Start Menu
  - Uninstall via Control Panel > Programs
  - Multiple instances can run (useful for multi-counter shops)

---

## Troubleshooting

### Issue: Electron window stays blank
**Solution**: 
- Ensure backend is running: `npm run dev:backend`
- Check Vite server is running: `npm run dev:frontend`
- Wait 5-10 seconds for Vite startup

### Issue: "Cannot find module electron-is-dev"
**Solution**: 
```bash
npm install
```

### Issue: Backend API returns 404
**Solution**:
- Verify backend running on `0.0.0.0:8000`
- Check `.env.local` has correct backend URL
- Restart backend server

### Issue: Print dialog doesn't appear
**Solution**:
- Click Print button again
- Check browser console (DevTools) for errors
- Ensure printer is installed on system

### Issue: Installer creation fails
**Solution**:
- Use `npm run dist:portable` for portable .exe (no NSIS required)
- Or install NSIS separately: https://nsis.sourceforge.io/

---

## Common Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Full development (backend + frontend + electron) |
| `npm run dev:frontend` | React dev server only |
| `npm run dev:backend` | Django server only |
| `npm run dev:electron` | Electron only (requires frontend running) |
| `npm run build` | Build React production files |
| `npm run dist` | Build Windows installer (.exe) |
| `npm run dist:portable` | Build portable .exe (no installer) |

---

## File Locations After Install

After `npm run dist`, files appear in:
```
Inventory/dist-electron/
├── Choudhary Medical Store-1.0.0.exe
└── Choudhary Medical Store-1.0.0-portable.exe
```

Share the `.exe` files with end users!

---

## Production Checklist

Before creating installers:
- [ ] Backend API working correctly
- [ ] All features tested in dev mode
- [ ] Printing tested with actual printer
- [ ] Offline functionality verified
- [ ] Token/authentication verified
- [ ] No console errors (DevTools)

Then run:
```bash
npm run dist
```

Done! 🚀

---

## Advanced: Custom App Icon

To add app icon:

1. Create icon file: `frontend/public/icon.png` (512x512)
2. Convert to Windows ICO: Use online tool or ImageMagick
3. Update `electron/main.js`:
   ```javascript
   icon: path.join(__dirname, '../frontend/public/icon.ico'),
   ```
4. Rebuild installer

---

## Support

- **Electron docs**: https://www.electronjs.org/docs
- **Electron-builder**: https://www.electron.build/
- **Vite docs**: https://vitejs.dev/

All existing React, routing, and API logic remains unchanged! ✅
