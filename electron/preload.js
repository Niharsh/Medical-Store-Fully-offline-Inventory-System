const { contextBridge, ipcRenderer } = require("electron");

// Signal that preload has been evaluated
console.log("Preload loaded successfully");

// Expose limited, safe API to renderer process
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  arch: process.arch,
  // Trigger printing from renderer (calls main process)
  print: (options = {}) => ipcRenderer.invoke("print", options),
});

// Expose a minimal `api` bridge for renderer to call IPC methods.
contextBridge.exposeInMainWorld("api", {
  // License Management
  activateLicense: (licenseKey) => ipcRenderer.invoke("activate-license", licenseKey),
  
  // Authentication
  checkOwnerExists: () => ipcRenderer.invoke("check-owner-exists"),
  verifyOwnerExists: (username) => ipcRenderer.invoke("verify-owner-exists", username),
  registerOwner: (username, email, password, firstName, lastName) => ipcRenderer.invoke("register-owner", username, email, password, firstName, lastName),
  loginOwner: (username, password) => ipcRenderer.invoke("login-owner", username, password),
  getOwner: () => ipcRenderer.invoke("get-owner"),
  resetPasswordRecovery: (username, recoveryCode, newPassword) => ipcRenderer.invoke("reset-password-recovery", username, recoveryCode, newPassword),
  
  // Database Management
  backupDatabase: () => ipcRenderer.invoke("backup-database"),
  restoreDatabase: () => ipcRenderer.invoke("restore-database"),
  print: (options = {}) => ipcRenderer.invoke("print", options),
  
  // Products
  addProduct: (productData) => ipcRenderer.invoke("add-product", productData),
  getProducts: () => ipcRenderer.invoke("get-products"),
  searchProducts: (query) => ipcRenderer.invoke("search-products", query),
  updateProduct: (productId, productData) => ipcRenderer.invoke("update-product", productId, productData),
  deleteProduct: (productId) => ipcRenderer.invoke("delete-product", productId),
  
  // Wholesalers
  addWholesaler: (wholesalerData) => ipcRenderer.invoke("add-wholesaler", wholesalerData),
  getWholesalers: () => ipcRenderer.invoke("get-wholesalers"),
  updateWholesaler: (id, wholesalerData) => ipcRenderer.invoke("update-wholesaler", id, wholesalerData),
  deleteWholesaler: (id) => ipcRenderer.invoke("delete-wholesaler", id),
  
  // Settings
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settingsData) => ipcRenderer.invoke("save-settings", settingsData),
  
  // Product Types
  addProductType: (typeData) => ipcRenderer.invoke("add-product-type", typeData),
  getProductTypes: () => ipcRenderer.invoke("get-product-types"),
  deleteProductType: (typeId) => ipcRenderer.invoke("delete-product-type", typeId),
  
  // HSN Codes
  addHSNCode: (hsnData) => ipcRenderer.invoke("add-hsn-code", hsnData),
  getHSNCodes: () => ipcRenderer.invoke("get-hsn-codes"),
  updateHSNCode: (hsnCode, hsnData) => ipcRenderer.invoke("update-hsn-code", hsnCode, hsnData),
  deleteHSNCode: (hsnCode) => ipcRenderer.invoke("delete-hsn-code", hsnCode),
  
  // Invoices
  createInvoice: (invoiceData) => ipcRenderer.invoke("create-invoice", invoiceData),
  getInvoices: () => ipcRenderer.invoke("get-invoices"),
  getInvoiceById: (invoiceId) => ipcRenderer.invoke("get-invoice-by-id", invoiceId),
  deleteInvoice: (invoiceId) => ipcRenderer.invoke("delete-invoice", invoiceId),
  updateInvoice: (invoiceId, invoiceData) => ipcRenderer.invoke("update-invoice", invoiceId, invoiceData),
  
  // Dashboard
  getDashboardSummary: () => ipcRenderer.invoke("get-dashboard-summary"),
  getLowStockItems: () => ipcRenderer.invoke("get-low-stock-items"),
  getExpiryOverview: (months) => ipcRenderer.invoke("get-expiry-overview", months),
  getSalesOverview: (period) => ipcRenderer.invoke("get-sales-overview", period),
  getPurchaseOverview: (period) => ipcRenderer.invoke("get-purchase-overview", period),
  getRecentInvoices: (limit) => ipcRenderer.invoke("get-recent-invoices", limit),
  
  // Purchase Bills
  createPurchaseBill: (billData) => ipcRenderer.invoke("create-purchase-bill", billData),
  getPurchaseBills: () => ipcRenderer.invoke("get-purchase-bills"),
  updatePurchaseBill: (billId, billData) => ipcRenderer.invoke("update-purchase-bill", billId, billData),
  deletePurchaseBill: (billId) => ipcRenderer.invoke("delete-purchase-bill", billId),
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

// Forward renderer errors/unhandled rejections to main for centralized logging
window.addEventListener('error', (e) => {
  try {
    ipcRenderer.send('renderer-error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error && e.error.stack
    });
  } catch (err) {
    // best-effort
    console.error('preload: failed to forward renderer error', err);
  }
});

window.addEventListener('unhandledrejection', (e) => {
  try {
    const reason = e.reason;
    ipcRenderer.send('renderer-error', {
      message: reason && reason.message ? reason.message : String(reason),
      stack: reason && reason.stack ? reason.stack : undefined
    });
  } catch (err) {
    console.error('preload: failed to forward unhandledrejection', err);
  }
});
