# 🏥 Medical Store Inventory & Billing Management System

> **A desktop-first, offline-capable medical store billing and inventory system** designed for single-shop operators.  
> Reliable in low- or no-network environments and packaged for desktop via **Electron**.

---

## ❓ Why This Project Exists

Small medical shops need a **simple, dependable system** that works even when internet connectivity is unreliable.

This project provides a **compact, offline-first billing and inventory workflow** tailored for shop owners who need:

- ⚡ Fast billing and invoice generation  
- 📦 Batch-based inventory & expiry management  
- 🔐 Offline password recovery when email is unavailable  

---

## ✨ Key Features

### 📦 Inventory Management
- **Add / edit / remove products** with flexible product types
- **Batch tracking** with quantities and per-batch expiry dates
- **Search & filter** by name, type, or batch
- **Low-stock indicators** to highlight replenishment needs

---

### ⏰ Expiry Management
- **3-month and 1-month pre-expiry alerts** per batch
- **Dedicated expiry dashboard** for review
- **Actions** to view or remove expired batches

---

### 🧾 Billing System
- **Create invoices** with multiple line items
- **Quantity shown before product name** (thermal & A4 print friendly)
- **Paid / pending amount handling** with clear invoice state
- **₹NaN safeguards** so invoices render correctly when values are zero
- **Print-optimized layouts** for thermal and A4 formats

---

### 🛒 Purchase Management
- **Record supplier purchases**:
  - Supplier name
  - Bill number
  - Purchase date
  - Contact details
- **Automatic stock updates** on purchase entry
- **Purchase history** with search and filtering

---

### 🏪 Shop Profile Management
- **Shop details** (name, address, contact) reused across invoices & reports
- **Local Admin Recovery Code** (optional) stored in browser for offline access recovery

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Python, Django, Django REST Framework |
| Database | SQLite (development) |
| Packaging | Electron (desktop builds) |
| Testing | Playwright (acceptance tests) |

---

## 📁 Project Folder Structure

```text
project-root/
├── backend/                     # Django project, apps, migrations
├── frontend/                    # React + Vite app (UI, pages, components)
├── electron/                    # Electron packaging & preload scripts
├── DOCUMENTATION_AND_GUIDES/    # Architecture, testing, QA docs
└── README.md                    # This file

##
---

## ✅ Step-by-Step Setup (Development)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Niharsh/medical-store-inventory-system.git
cd medical-store-inventory-system

###2️⃣ Backend Setup (Django)
```bash
cd backend

Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# Windows: .venv\Scripts\activate

Install dependencies and run server:
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

  
