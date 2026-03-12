# 🏥 Medical Store Inventory & Billing Management System

> A desktop-first, offline-capable medical store billing and inventory system designed for single-shop operators. Reliable in low- or no-network environments and packaged for desktop via Electron.

---

## ❓ Why this project exists

Small medical shops need a simple, dependable system that works even when internet connectivity is unreliable. This project provides a compact, offline-first billing and inventory workflow tailored to shop owners who need:

- Fast billing and invoice generation
- Batch-based inventory and expiry management
- Offline password recovery for local access when email is unavailable

---

## ✨ Key features

### Inventory Management

- **Add / edit / remove products** with flexible product types
- **Batch tracking** with quantities and per-batch expiry dates
- **Search & filter** by name, type, or batch
- **Low stock indicators** to highlight replenishment needs

### Expiry Management

- **3-month and 1-month pre-expiry alerts** per batch
- **Expiry dashboard** to review soon-to-expire stock
- **Actions** to view or remove expired batches

### Billing System

- **Create invoices** with multiple line items
- **Quantity shown before product name** (prints clearly on thermal/A4 receipts)
- **Paid / pending amount handling** with clear invoice state
- **₹NaN handling** guarded so invoices display correctly even when amounts are zero
- **Print-friendly layouts** for thermal and A4 printing modes

### Purchase Management

- **Record supplier purchases** (supplier name, bill number, date, contact)
- **Automatic stock updates** when purchase entries are created
- **Purchase history** with search and filtering

### Shop Profile Management

- **Shop details** (name, address, contact) used across invoices and reports
- **Local Admin Recovery Code** (optional) stored in browser for offline password recovery

---

## 🛠 Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Electron Main Process (Node.js) |
| Database | SQLite (local file) |
| Packaging | Electron (desktop builds) |
| Testing | Playwright (acceptance test) |

---

## 📁 Project structure

```
medical-store-inventory-system/
├── frontend/           # React source code (Vite + Tailwind)
├── electron/           # Electron main process & IPC handlers
├── database/           # SQLite helpers & initialization
├── public/             # Static assets
└── README.md           # This file
```

---

## 🚀 Getting started

### Prerequisites

- Node.js 18 or newer (<https://nodejs.org/>)
- Git (recommended) - <https://git-scm.com/>


### Development workflow

1. **Clone the repository**

   ```bash
   git clone https://github.com/Niharsh/Medical-Store-Fully-offline-Inventory-System.git
   cd medical-store-inventory-system
   ```

2. **Install dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Run in development mode**

   ```bash
   npm run dev
   ```

   This command starts the Vite dev server (default `http://localhost:5173`) and launches
   the Electron desktop application. Changes to frontend or backend code reload automatically.

4. **Build for distribution**

   ```bash
   npm run build
   ```

   Outputs packaged desktop binaries under `dist-electron/` (Windows, macOS, Linux builds
   depending on configuration).

---

## 🛠 Features overview

- **Offline-first billing & inventory** tailored for single medical shops
- Batch-based quantity tracking with expiry alerts
- Invoice creation, printing (thermal/A4) with tax calculations
- Purchase entry form with automatic stock updates
- Shop settings and local admin recovery codes

The application runs entirely locally using SQLite; no network or cloud services are
required once installed.

---

## 🧩 Technical stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, Vite, Tailwind CSS |
| Backend   | Electron main process (Node.js) |
| Database  | SQLite (local file)     |
| Packaging | Electron                |

---

## 💡 Troubleshooting

- **Port 5173 occupied** – dev script automatically switches to the next available port.
- **Electron shows blank window** – ensure the Vite server is running (`npm run dev`).
- **SQLite locked** – close all instances of the app before restarting.

---

## 📄 License

This project is released under the MIT License.

---

## 🙋‍♂️ Author

Niharsh

