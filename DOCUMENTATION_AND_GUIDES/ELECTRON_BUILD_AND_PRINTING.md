Electron Build & Printing Guide

Overview
--------
This guide explains how to build the Windows installer (.exe) and troubleshoot printing from the packaged Electron app.

Quick build command
-------------------
From project root (on a Windows machine or a properly configured Linux build host with wine):

```bash
# Build and create a Windows NSIS installer (x64)
npm run dist
# Output artifacts are placed in: dist-electron/
```

Notes & prerequisites
---------------------
- electron-builder is configured in `package.json` and targets `nsis` and `portable` for Windows.
- Building Windows installers on non-Windows hosts requires `wine` and other dependencies; building on a Windows machine is recommended for easiest results.
- The produced installer will create Desktop and Start Menu shortcuts (NSIS config), with `Choudhary Medical Store` as the shortcut name.

Printing in Electron
--------------------
- The renderer uses `window.print()` in the app UI. To avoid blank-print issues in packaged Electron, the preload script now overrides `window.print()` and forwards a safe IPC request to the main process.
- The main process receives `ipcMain.handle('print', ...)` and calls `webContents.print()` with `printBackground: true`.
- To ensure consistent layout, the app uses print CSS (`@page`) to define Half A4 size and correct margins. Verify invoice print CSS if layout differs across printers.

Troubleshooting printing
------------------------
- If prints are blank or missing content, try the following:
  - Open the app and navigate to the invoice screen. Confirm the invoice renders fully on-screen before pressing Print.
  - Use the Print Preview dialog (provided by the OS printer UI if available) to confirm content appears.
  - Increase the small delay before printing by passing an option from the renderer (e.g., `window.electron.print({ delay: 500 })`).

Testing the installer
---------------------
1. Build the installer: `npm run dist` on a Windows machine.
2. Copy the generated `.exe` to a clean Windows 10/11 VM or test machine.
3. Run the installer and ensure:
   - Desktop icon created
   - Start Menu entry created
   - App launches as a native single-window application
4. Verify offline behavior:
   - Start the app with no network and confirm login using local credentials and app navigation works.
5. Verify printing works (Invoice → Print). Send to a physical or virtual printer.

Security notes
--------------
- `nodeIntegration` is disabled and `contextIsolation` is enabled; a minimal, safe API is exposed from `preload.js` (platform, arch, print).
- Do not expose additional Node APIs to the renderer.

If you want CI builds (GitHub Actions) that produce Windows installers automatically, I can add a workflow that runs on push to `main` and stores artifacts for download (requires Windows runners or cross-compilation on Linux with wine configured).