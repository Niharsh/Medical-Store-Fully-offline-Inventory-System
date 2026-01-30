# 📋 QUICK REFERENCE CARD

**Medical Store Inventory & Billing System**  
**One-Page Cheat Sheet**

---

## ⚡ Quick Start (2 minutes)

```bash
# Terminal 1: Start Backend
cd ~/Desktop/Inventory/backend
python manage.py runserver

# Terminal 2: Start Frontend
cd ~/Desktop/Inventory/frontend
npm run dev

# Browser: Open
http://localhost:5173
```

**Ready!** Go to Inventory tab and start managing products.

---

## 🎯 Main Features

| Feature | Location | How |
|---------|----------|-----|
| **Add Product** | Inventory tab | Click "Add Product" button |
| **View Products** | Inventory tab | Table shows all products |
| **Edit Product** | Inventory tab | Click Edit button (or use admin) |
| **Delete Product** | Inventory tab | Click Delete button |
| **Create Invoice** | Billing tab | Fill form, click "Create Invoice" |
| **View Invoices** | Billing tab | See "Invoice History" section |
| **Manage Payment** | Billing tab | Mark invoice as paid/partial |

---

## 📊 Key Concepts (2-Minute Summary)

### Product
**What**: Item you sell (medicine, tablet, syrup, etc.)  
**Has**: Name, Type, Details (generic name, manufacturer, etc.)

### Batch
**What**: Specific lot of a product  
**Why**: Different expiry dates, prices per lot  
**Example**: Aspirin LOT-2024-001 vs LOT-2024-002

### Invoice
**What**: Bill created when customer buys  
**Contains**: Customer name, items list, total, payment status  
**Effect**: Automatically deducts inventory

### Three Prices
- **MRP**: Display price (what's on box)
- **Selling Rate**: Your price (customer pays this) ← USED FOR BILLING
- **Cost Price**: What you paid (internal tracking)

---

## 📁 File Organization

```
Inventory/
├── frontend/              ← What you see (React)
├── backend/              ← Data storage (Django)
│   └── db.sqlite3       ← YOUR DATA (backup this!)
└── docs/                 ← Documentation (you are here)
```

---

## 🚀 Commands Cheat Sheet

### Start Services
```bash
# Backend (Terminal 1)
cd backend && python manage.py runserver

# Frontend (Terminal 2)
cd frontend && npm run dev
```

### Access
```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000/api/
Admin:     http://localhost:8000/admin/ (user: admin, pass: admin123)
```

### Database
```bash
# Backup
cp backend/db.sqlite3 ~/backup/db.sqlite3.backup

# View
cd backend && python manage.py dbshell
>>> SELECT COUNT(*) FROM inventory_product;
>>> .quit

# Reset (DELETES ALL DATA)
rm backend/db.sqlite3
python manage.py migrate
```

---

## 🔍 Debugging Quick Reference

| Problem | Check | Fix |
|---------|-------|-----|
| System won't start | Terminal messages | See QUICK_TROUBLESHOOTING.md |
| Products not showing | Browser Console (F12) | Refresh page (F5) |
| Delete not working | Console for logs | Already fixed in code |
| Invoice fails (HTTP 400) | Check quantity, fields | See QUICK_TROUBLESHOOTING.md |
| Cannot connect backend | Is backend running? | Start backend in Terminal 1 |

**DevTools**: F12 in browser → Console tab (watch logs) → Network tab (watch API calls)

---

## 📖 Documentation Map

| I want to... | Read this |
|-------------|-----------|
| **Learn to use it** | USER_GUIDE.md |
| **Understand how it works** | SYSTEM_OVERVIEW.md + DEVELOPER_GUIDE.md |
| **Fix a problem** | GETTING_HELP.md or QUICK_TROUBLESHOOTING.md |
| **Set it up** | SETUP_GUIDE.md |
| **Find something** | DOCUMENTATION_GUIDE.md |
| **Understand architecture** | DEVELOPER_GUIDE.md |
| **See API specs** | frontend/API_CONTRACTS.md |

---

## 🎯 Inventory Workflow

```
1. Click "Add Product"
   ↓
2. Enter: name, type, manufacturer, etc.
   ↓
3. Add batches: batch_number, MRP, selling_rate, cost_price, qty, expiry
   ↓
4. Click "Save Product"
   ↓
5. Product appears in table
   ↓
6. Ready to sell!
```

---

## 💰 Billing Workflow

```
1. Go to Billing tab
   ↓
2. Enter customer name (required)
   ↓
3. Click "Add Item"
   ↓
4. For each item:
   - Select product (auto-fills batch, prices)
   - Select batch (if multiple)
   - Enter quantity
   - Edit selling rate if needed
   ↓
5. Review items
   ↓
6. Click "Create Invoice"
   ↓
7. ✅ Inventory reduced automatically
   ↓
8. Invoice appears in history
```

---

## ✅ Daily Checklist

- [ ] Servers running (Terminal 1 & 2)
- [ ] Browser shows http://localhost:5173
- [ ] Can see products in Inventory tab
- [ ] Can create invoice without errors
- [ ] Quantities decrease after invoice
- [ ] Data is backed up (weekly minimum)

---

## 🆘 Quick Help

### "I'm stuck"
→ Press F12 (DevTools) → Console tab → Look for red errors

### "Delete/Edit not working"
→ Refresh page (Ctrl+R)

### "Invoice creation fails"
→ Check: Quantity available? All fields filled? See QUICK_TROUBLESHOOTING.md

### "Products disappeared"
→ Refresh page (F5)

### "Cannot start system"
→ Check both terminals. See SETUP_GUIDE.md

### "More help needed"
→ See GETTING_HELP.md → Decision tree

---

## 📱 Three-Price Example

```
Aspirin 500mg

MRP: ₹30.00         ← What's printed on box (display)
Selling: ₹25.00     ← What CUSTOMER PAYS (used in billing)
Cost: ₹18.00        ← What you PAID (internal tracking)

Profit per unit: ₹25 - ₹18 = ₹7
```

**Important**: Billing uses **Selling Rate**, NOT MRP

---

## 🔒 Data Safety

### Backup (Do This Weekly!)
```bash
cp backend/db.sqlite3 ~/backup/db.sqlite3.backup
```

### Restore (If data lost)
```bash
cp ~/backup/db.sqlite3.backup backend/db.sqlite3
```

### Data Location
```
File: backend/db.sqlite3
Size: ~1MB
Contains: All products, batches, invoices, customer data
```

---

## 🛠️ Common Edits

### Add new product type
- Current system supports: Tablet, Syrup, Powder, Cream, Diaper, Condom, Sachet
- Or type custom type name

### Change URL
- Backend: backend/config/settings.py
- Frontend: frontend/src/services/api.js

### Change port
- Backend: `python manage.py runserver 9000`
- Frontend: Edit vite.config.js

### Reset database
```bash
cd backend
rm db.sqlite3
python manage.py migrate
```

---

## 📊 Data Model (Simplified)

```
Product
├─ name (e.g., "Aspirin 500mg")
├─ product_type (e.g., "Tablet")
├─ manufacturer (e.g., "Pharma Ltd")
└─ batches[]
   ├─ batch_number (e.g., "LOT-2024-001")
   ├─ mrp (e.g., 30.00)
   ├─ selling_rate (e.g., 25.00)
   ├─ cost_price (e.g., 18.00)
   ├─ quantity (e.g., 100)
   └─ expiry_date (e.g., "2026-12-31")

Invoice
├─ customer_name (e.g., "John Doe")
├─ customer_phone (e.g., "9876543210")
├─ items[]
│  ├─ product_id
│  ├─ batch_number
│  ├─ quantity
│  └─ selling_rate
├─ total_amount (calculated)
├─ payment_status ("unpaid", "partial", "paid")
└─ created_date
```

---

## 🎓 Key Rules

✅ **DO**:
- Backup data regularly
- Use correct batch numbers
- Enter realistic prices
- Review invoices before creating
- Test with sample data first

❌ **DON'T**:
- Delete without confirming
- Mix up product types
- Forget to save changes
- Force-quit terminals
- Modify backend without restarting

---

## 🔗 Quick Links

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Database**: backend/db.sqlite3

---

## 📞 Getting Help

| Situation | Action |
|-----------|--------|
| Forgot how to use | Read USER_GUIDE.md |
| Need to understand system | Read SYSTEM_OVERVIEW.md |
| Something broke | See GETTING_HELP.md |
| Want to develop | Read DEVELOPER_GUIDE.md |
| Can't find docs | See DOCUMENTATION_GUIDE.md |

---

## ⚙️ System Requirements

- Python 3.12+
- Node.js 18+
- Modern browser
- ~500MB disk space

---

## 🎉 Ready to Use!

Everything you need to know is:
1. **In this quick reference** (for common tasks)
2. **In the documentation** (for deep understanding)
3. **In DevTools Console** (F12) (for debugging)
4. **In error messages** (when something's wrong)

**You've got this! Happy selling! 💊📊**

---

**Last Updated**: January 21, 2026  
**Version**: 1.0  
**Status**: ✅ Ready to Reference

---

## 🔖 Bookmarks (Save These!)

- Quick Troubleshooting: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)
- Getting Help: [GETTING_HELP.md](GETTING_HELP.md)
- User Guide: [USER_GUIDE.md](USER_GUIDE.md)
- Developer Guide: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- Find Docs: [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)
