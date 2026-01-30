# 🏥 SYSTEM OVERVIEW - Medical Store Inventory & Billing

**Version**: 1.0  
**Status**: ✅ Production Ready  
**Created**: January 21, 2026

---

## What Is This System?

A complete **inventory management and billing application** for a single medical store operated by one person. Think of it as:

> **A digital notebook + calculator for your medicine shop**

Instead of:
- ❌ Writing products on paper
- ❌ Using pen-and-paper invoices
- ❌ Calculating totals manually
- ❌ Tracking inventory by memory

You can:
- ✅ Manage all products in a database
- ✅ Create invoices in seconds
- ✅ Automatic inventory deduction
- ✅ Complete sales history
- ✅ Payment tracking

---

## Key Concepts

### 1. Products

A **product** is anything you sell: medicines, tablets, syrups, powders, creams, diapers, etc.

Each product has:
- **Name**: "Aspirin 500mg"
- **Type**: "Tablet", "Syrup", etc. (or custom)
- **Details**: Generic name, manufacturer, composition, description
- **Batches**: One or more batches with different prices/expiry

### 2. Batches

A **batch** is a specific quantity from a specific manufacturer lot.

Example: You bought 100 Aspirin tablets from Pharma Ltd on Jan 2024:
- **Batch Number**: LOT-2024-001
- **Quantity**: 100 units
- **Expiry Date**: Dec 31, 2026
- **Three Prices**:
  - MRP (display): ₹30.00
  - Selling Rate (your price): ₹25.00
  - Cost Price (what you paid): ₹18.00

Later, you buy another 150 from same company:
- **Batch Number**: LOT-2024-002
- **Quantity**: 150 units
- **Expiry Date**: Jun 30, 2027
- **Prices**: Same or different

**Result**: One product (Aspirin), two batches, 250 total units.

### 3. Invoices (Bills)

An **invoice** is a bill you create when someone buys from you.

Each invoice contains:
- **Customer**: Who bought
- **Items**: What they bought (product, batch, quantity, price)
- **Total**: Sum of all items
- **Payment Status**: Unpaid / Partial / Paid
- **Date**: When created

Example:
```
Invoice #1
Customer: John Doe
Items:
  - Aspirin 500mg (5 units @ ₹25): ₹125
  - Cough Syrup (2 bottles @ ₹145): ₹290
Total: ₹415
Status: Paid
```

### 4. Inventory

**Inventory** = how much stock you have.

Each time you create an invoice:
- ✅ Items automatically deducted from stock
- ✅ Batch quantity reduced
- ✅ Cannot sell more than available

Example:
```
Before: Aspirin batch has 100 units
Invoice: Sell 5 units
After: Aspirin batch has 95 units
```

---

## System Architecture

The system has two parts:

### Frontend (What You See in Browser)

This is the interface you use:
- **Inventory Tab**: View/add/edit/delete products
- **Billing Tab**: Create invoices, see history
- **Dashboard**: Overview (if available)

Built with: React, Vite, Tailwind CSS

### Backend (Hidden Workhorse)

This stores your data and handles calculations:
- **Database**: Stores all products, batches, invoices (SQLite file)
- **API**: Receives requests from frontend, sends back data
- **Business Logic**: Validates data, deducts inventory, calculates totals

Built with: Django, Python

**How they communicate**:
```
Browser (Frontend)
    ↓ (HTTP Request)
    ↓ "Get all products"
Backend (API)
    ↓ (HTTP Response)
    ↓ "[{product1}, {product2}, ...]"
Browser (Frontend)
    ↓ (Displays in table)
```

---

## Data Flow

### Creating a Product

```
1. You fill form: "Aspirin 500mg, Tablet, batch LOT-001, 100 units, ₹25 selling, ₹18 cost, expiry 2026-12-31"
2. Click "Save Product"
3. Frontend → Backend: "POST /api/products/" + data
4. Backend: Validates, creates product in database
5. Backend → Frontend: "Created! Here's the product with ID=5"
6. Frontend: Adds to product list, shows in table
7. You see: New product in Inventory tab
```

### Creating an Invoice

```
1. You enter: "Customer: John Doe"
2. You add items: "Aspirin 5 units @ ₹25, Syrup 2 @ ₹145"
3. Click "Create Invoice"
4. Frontend: Validates form, calculates total (125 + 290 = 415)
5. Frontend → Backend: "POST /api/invoices/" + customer + items
6. Backend: IMPORTANT TRANSACTION:
   - Create invoice record
   - For each item:
     - Check: Batch has enough quantity
     - Deduct quantity from batch
     - Create invoice item record
   - Calculate total
   - IF any error: UNDO everything (rollback)
   - IF success: SAVE everything (commit)
7. Backend → Frontend: "Invoice created! ID=1, Total=₹415"
8. Frontend: Refetch products (to show new quantities), clear form
9. You see: New invoice in history, inventory updated
```

### Deleting a Product

```
1. You click Delete button on product
2. Confirmation: "Delete Aspirin? This is permanent"
3. You click OK
4. Frontend → Backend: "DELETE /api/products/5"
5. Backend: Delete product + all its batches
6. Backend → Frontend: "Success"
7. Frontend: Remove from product list
8. You see: Product no longer in table
```

---

## How to Use - Step by Step

### First Time

1. **Start the system** (see USER_GUIDE.md):
   ```
   Terminal 1: python manage.py runserver
   Terminal 2: npm run dev
   Open browser: localhost:5173
   ```

2. **You see sample data**:
   - 5 products already loaded
   - Try creating an invoice to test

3. **Replace with your data**:
   - Delete sample products
   - Add your actual products
   - Start using for real sales

### Daily Use

1. **Morning**: Open browser, go to localhost:5173
2. **Whenever customer buys**:
   - Go to Billing tab
   - Add customer name
   - Add items they want to buy
   - Click "Create Invoice"
3. **End of day**: Check Invoice History to see daily sales
4. **When receiving stock**:
   - Go to Inventory tab
   - Click "Add Product" or edit existing product
   - Add new batch with new batch number
   - Quantity added to total

---

## Three-Price Model Explained

Every product has **3 prices**. Here's why:

### Example: Aspirin 500mg

| Price | What | Example | Why? |
|-------|------|---------|------|
| **MRP** | What's printed on box | ₹30.00 | Reference for customers, shows "original" value |
| **Selling Rate** | What customer pays | ₹25.00 | **This is your business price**, what you earn |
| **Cost Price** | What you paid wholesaler | ₹18.00 | Internal tracking, helps calculate profit |

**In Billing**: Customer is charged **₹25** (selling rate), NOT ₹30 (MRP)

**Profit Calculation**: ₹25 (selling) - ₹18 (cost) = ₹7 profit per unit

**You can edit selling rate during billing**: 
- For discounts: charge ₹23 instead of ₹25
- For bulk: charge ₹23 for 10+ units
- For special customers: charge what you want

---

## Batch Management

Batches exist because:

### Problem
You buy same medicine multiple times from same company:
- First time: 100 tablets, expires Dec 2026, cost ₹18 each
- Second time: 150 tablets, expires Jun 2027, cost ₹17.50 each

If you don't track batches:
- You mix them up
- Can't track which one is expiring
- Can't track which cost price applies

### Solution: Batches!

```
Product: Aspirin 500mg (total 250 units)

Batch 1 (LOT-2024-001):
  100 units, expires Dec 2026, cost ₹18, selling ₹25

Batch 2 (LOT-2024-002):
  150 units, expires Jun 2027, cost ₹17.50, selling ₹25
```

**When billing**: You choose which batch to sell from (e.g., older one first = FIFO)

**When inventory shows**:
- "Aspirin: 250 units" (total of all batches)
- Click expand → see individual batches

---

## Safety & Important Rules

### What the System DOES

✅ **Protects your data**:
- Everything is saved immediately
- Cannot lose data by closing browser
- Data persists across sessions

✅ **Validates before accepting**:
- Won't let you sell more than available
- Won't let you create invoice without customer name
- Won't let you add product without batch

✅ **Atomic transactions**:
- Invoice creation: ALL succeeds or ALL fails
- Cannot have partial invoice in database
- If batch runs out during invoice: entire invoice rejected

### What the System DOES NOT

❌ **Won't recover deleted data**:
- Delete product → gone forever
- Cannot undo deletion
- Always confirm before deleting

❌ **Won't prevent errors**:
- Won't stop you from selling 100 units of ₹1 medicine
- Won't stop you from entering wrong customer name
- Frontend validates form, backend validates data

❌ **Won't work without servers**:
- Both backend and frontend must run
- If backend stops: frontend shows error
- If frontend stops: cannot use system

---

## Database & Backup

### Where is My Data?

**File**: `backend/db.sqlite3` (about 1MB)

**Contains**:
- All products and batches
- All invoices and items
- All customers
- All payment history

### Backup Your Data

**Before disaster**:
```
Copy: backend/db.sqlite3
To: External drive, USB, cloud storage (Google Drive, Dropbox, etc.)
```

**How often**: Weekly or daily (depending on criticality)

**If data lost**: Restore from backup file:
```
1. Stop both servers (Ctrl+C)
2. Copy backup file to: backend/db.sqlite3
3. Restart servers
4. All data restored
```

### Reset Database

If something goes wrong:
```
cd backend
rm db.sqlite3
python manage.py migrate
```

⚠️ This deletes ALL data! Only do if database corrupted.

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| System won't start | Check both terminals, follow startup instructions |
| Cannot see products | Refresh page (F5), check backend running |
| Invoice creation fails | Check quantity, all fields, error message |
| Forgot password | No user password needed (local system) |
| Lost data | Restore from backup file |
| Product list keeps disappearing | Browser bug, refresh page |
| Cannot edit product | Use Django admin panel |
| Cannot delete old invoice | Feature may not be enabled |

**For help**: See USER_GUIDE.md or DEVELOPER_GUIDE.md

---

## Limitations (Future Improvements)

Current version **does NOT have**:

- ❌ Multiple users/login
- ❌ Employee management
- ❌ Password protection
- ❌ Reports & analytics
- ❌ Profit calculation by product
- ❌ Expiry date warnings
- ❌ Low stock alerts
- ❌ PDF invoice export
- ❌ Credit/discount tracking
- ❌ Return processing
- ❌ Multi-branch support

These can be added in future versions if needed.

---

## Technology Stack

**You don't need to know this, but for reference**:

### Frontend
- **React 18**: UI framework
- **Vite 7**: Fast build tool
- **Tailwind CSS 4**: Styling
- **Axios**: API communication
- **React Context**: State management

### Backend
- **Django 6**: Web framework
- **Django REST Framework**: API framework
- **SQLite**: Database (can upgrade to PostgreSQL)
- **Python 3.12+**: Programming language

### This means:
- ✅ Lightweight, fast
- ✅ No complex setup
- ✅ Single database file
- ✅ Can scale if needed

---

## Files & Folders

### Important Folders

```
Inventory/
├── frontend/        ← What you see in browser
├── backend/         ← Data storage & calculations
│   └── db.sqlite3   ← YOUR DATA (backup this!)
├── USER_GUIDE.md    ← How to use the system
├── DEVELOPER_GUIDE.md ← How system works (technical)
└── This file        ← Overview
```

### Key Files (DO NOT DELETE)

- `backend/db.sqlite3` - Your data (BACKUP THIS!)
- `backend/manage.py` - Backend starter
- `frontend/package.json` - Frontend dependencies

### Safe to Delete

- `node_modules/` - Can reinstall with `npm install`
- `__pycache__/` - Python cache, auto-recreated
- Sample data if added

---

## Success Checklist

Before fully using the system, verify:

- [ ] Both servers start without errors
- [ ] Can see product list in Inventory tab
- [ ] Can add a test product
- [ ] Can create a test invoice
- [ ] Can see inventory decrease after invoice
- [ ] DevTools Console (F12) doesn't show red errors
- [ ] Network tab (F12) shows successful API calls
- [ ] Backed up database file

Once all checked: **You're ready to go!**

---

## Quick Command Reference

```bash
# Start backend
cd backend && python manage.py runserver

# Start frontend
cd frontend && npm run dev

# Open in browser
http://localhost:5173

# Access data via Django admin
http://localhost:8000/admin/
Login: admin / admin123

# Check database directly
cd backend && python manage.py dbshell

# Backup data
cp backend/db.sqlite3 ~/backup/db.sqlite3.backup
```

---

## Final Notes

### This System is Designed For

✅ Solo store operator (one person using it)  
✅ Small to medium medical store  
✅ Local network or single computer  
✅ Basic inventory + billing needs  
✅ Daily operations & record keeping  

### This System is NOT For

❌ Multiple users (no login system)  
❌ Complex discounts/taxes  
❌ Hospital supply chains  
❌ Large enterprise (would need scaling)  
❌ Kiosk/self-service (no UX for that)  

### Getting Help

1. **Quick issue**: Check USER_GUIDE.md FAQ section
2. **Technical issue**: Read DEVELOPER_GUIDE.md
3. **System not starting**: Follow Getting Started section
4. **Data backup**: See Database & Backup section

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 21, 2026 | Initial release, stable |

---

**Created**: January 21, 2026  
**Status**: ✅ Ready for Daily Use  
**Support**: See guide files for help

---

## One More Thing

**You are running a personal medical store management system** on your own computer. This is:

- ✅ Safe (no internet needed)
- ✅ Private (no one can see your data)
- ✅ Fast (everything happens instantly)
- ✅ Reliable (data survives computer restart)
- ✅ Simple (no complex setup)

Enjoy using it! If you find ways to improve it, the system is built to be modified and extended.

**Happy selling! 💊💉📊**
