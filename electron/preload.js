const { contextBridge, ipcRenderer } = require("electron");

// Expose limited, safe API to renderer process
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  arch: process.arch,
  // Trigger printing from renderer (calls main process)
  print: (options = {}) => ipcRenderer.invoke("print", options),
});

// Override window.print in renderer safely so existing code calling window.print() works in production
try {
  Object.defineProperty(window, "print", {
    configurable: true,
    value: () => ipcRenderer.invoke("print"),
  });
} catch (err) {
  // Non-fatal: fallback to default print behavior
  // console.warn('Could not override window.print in preload:', err);
}

// Note: No Node APIs exposed to renderer. Renderer can make HTTP requests normally.
