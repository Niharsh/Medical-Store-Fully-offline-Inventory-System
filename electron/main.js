const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

// Ensure single instance (prevents multiple running instances)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// Windows: set AppUserModelId for proper shortcuts & notifications
if (process.platform === "win32" && app.setAppUserModelId) {
  app.setAppUserModelId("com.choudharymedical.billing");
}

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../frontend/public/icon.png"),
  });

  // ✅ DEV vs PROD (NO electron-is-dev)
  if (!app.isPackaged) {
    // Development: Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // Production: built React files
    mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }

  // React Router support (production): prevent external navigation
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (app.isPackaged && !url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  // Prevent new windows / external popups by default
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// IPC: handle print requests from renderer (safe channel)
ipcMain.handle("print", async (event, options = {}) => {
  try {
    const wc = event.sender;

    // Allow a short delay for DOM to render fully before printing
    await new Promise((r) => setTimeout(r, options.delay || 200));

    return new Promise((resolve) => {
      wc.print(
        { silent: false, printBackground: true },
        (success, failureReason) => {
          if (!success) console.error("Print failed:", failureReason);
          resolve({ success, failureReason });
        },
      );
    });
  } catch (err) {
    console.error("Print handler error:", err);
    return { success: false, failureReason: err.message };
  }
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createMenu();
});

app.on("window-all-closed", () => {
  // On Windows & Linux quit fully when all windows closed
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// App menu
function createMenu() {
  // In production keep menu minimal so app feels native. Devs still get tools in dev mode
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
  ];

  // In dev allow View menu for reload/devtools
  if (!app.isPackaged) {
    template.push({
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
      ],
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Safety
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
