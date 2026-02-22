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
| Backend | Python, Django, Django REST Framework |
| Database | SQLite (development) |
| Packaging | Electron (desktop builds) |
| Testing | Playwright (acceptance test) |

---

## 📁 Project folder structure

```
project-root/
├── backend/                     # Django project, apps, migrations
# 🏥 Medical Store Inventory & Billing Management System

A desktop-focused, offline-first medical store billing and inventory system built with Django, React, and Electron. Designed for single-shop operators who need reliable local billing without internet dependency.

## 📌 Overview

This system provides:

- Local billing & invoice printing
- Batch-based inventory tracking
- Expiry management
- Purchase tracking
- Shop configuration management

Tech stack:

- Django (Backend API & business logic)
- React (Frontend UI)
- Electron (Desktop wrapper)
- SQLite (Local database)

The application is designed to run fully on a local machine without internet access.

## 🏗 Architecture (Current Implementation)

Electron → Django Server (127.0.0.1:8000) → SQLite (local file)

Django serves both API and the built frontend. No cloud dependency.

## 🖥 System Requirements

Before running, install:

1. Python 3.10+ — https://www.python.org/downloads/
	- Verify: `python --version`
2. Node.js 18+ — https://nodejs.org/
	- Verify: `node --version` and `npm --version`
3. Git (recommended) — https://git-scm.com/
	- Verify: `git --version`

## 📁 Project Structure

```
medical-store-inventory-system/
├── backend/            # Django backend
├── frontend/           # React source code
├── electron/           # Electron main process
├── DOCUMENTATION_AND_GUIDES/
└── README.md
```

## 🚀 How To Run (Development / Local Desktop Mode)

### 1) Clone repository

```bash
git clone https://github.com/Niharsh/medical-store-inventory-system.git
cd medical-store-inventory-system
```

### 2) Backend setup (one-time)

Windows example:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Set environment variables (example):
$env:DJANGO_SECRET_KEY = "your-secret-here"
$env:EMAIL_HOST_PASSWORD = "your-smtp-password"
python manage.py migrate
```

macOS / Linux example:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DJANGO_SECRET_KEY="your-secret-here"
export EMAIL_HOST_PASSWORD="your-smtp-password"
python manage.py migrate
```

### 3) Start backend server

```powershell
cd backend
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
# Server: http://127.0.0.1:8000/
```

### 4) Run Electron (desktop)

Make sure the Django server above is running. From project root:

```bash
npx electron .
```

> Note: The frontend dev server (`npm run dev`) is only required for frontend development. For desktop usage, Django serves the built frontend files.

## 🧾 Invoice & Print Behavior

- Half-page optimized layout
- Exactly 15 line items per page (automatic continuation)
- Customer DL and Address printed conditionally
- Shop details pulled from settings
- GST calculation (CGST + SGST split)

## 📦 Database

- SQLite local file
- Offline, migration-controlled schema

## ⚠ Common issues & quick fixes

- Port in use: `python manage.py runserver 8001`
- Electron blank screen: ensure Django server is running before launching Electron
- CORS/auth issues: check `config/settings.py` (CORS_ALLOWED_ORIGINS) when `DEBUG=True`

## 📌 Intended Usage

- Single-shop medical stores
- Local desktop deployment
- Offline-first billing

## 📄 License

MIT License

## 👨‍💻 Author

Niharsh

