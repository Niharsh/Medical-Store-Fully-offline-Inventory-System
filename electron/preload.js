const { contextBridge } = require("electron");

// Expose limited API to renderer process
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  arch: process.arch,
});

// Note: No IPC required for this app as it uses standard HTTP calls
// The renderer can make fetch requests to the backend as normal
