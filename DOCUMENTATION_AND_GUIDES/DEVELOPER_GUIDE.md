# 🛠️ DEVELOPER GUIDE - Medical Store Inventory System

**For**: Solo Developer Maintaining This System  
**Last Updated**: January 21, 2026  
**Status**: ✅ Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Folder Structure](#folder-structure)
4. [Inventory Lifecycle](#inventory-lifecycle)
5. [Billing Lifecycle](#billing-lifecycle)
6. [Data Flow Diagrams](#data-flow-diagrams)
7. [Key Components & Concepts](#key-components--concepts)
8. [Common Issues & Solutions](#common-issues--solutions)
9. [Rules for Safe Changes](#rules-for-safe-changes)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Overview

### What is This System?

A **complete inventory management and billing solution for a solo medical store operator**. It's a full-stack web application that runs locally (or on a single server) and is used by ONE person (the store owner/operator).

### Core Features

| Feature | Purpose | Location |
|---------|---------|----------|
| **Product Management** | Add/Edit/Delete products | Inventory tab |
| **Batch Tracking** | Multiple batches per product with different prices & expiry | ProductList view |
| **Billing (Invoice Creation)** | Create sales invoices with multiple items | Billing tab |
| **Three-Price Model** | MRP (display), Selling Rate (billing), Cost Price (internal) | All product screens |
| **Inventory Deduction** | Automatic stock reduction after each invoice | Backend transaction |
| **Payment Tracking** | Track sales bill payment status | Billing history |
| **Purchase Tracking** | Record wholesaler purchases | Backend management |

### Technology Stack

**Frontend**:
- React 18 with Hooks
- Vite (build/dev server)
- Tailwind CSS (styling)
- React Context API (state management)
- Axios (API calls)

**Backend**:
- Django 4+ (Python web framework)
- Django REST Framework (REST API)
- SQLite (database, can switch to PostgreSQL)
- django-cors-headers (frontend-backend communication)

**Development Environment**:
- Python 3.12+
- Node.js + npm
- Virtual environment (.venv)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (User)                            │
└─────────────────────────────────────────────────────────────────┘
                                ▲
                                │ HTTP
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                 FRONTEND (React + Vite)                           │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Pages: Inventory, Billing, Dashboard                        ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Components:                                            │ ││
│  │  │  - ProductList (display products with batches)        │ ││
│  │  │  - AddProductForm (create new products)               │ ││
│  │  │  - BillingForm (create invoices)                      │ ││
│  │  │  - InvoiceHistory (view past invoices)                │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Context API (State Management):                        │ ││
│  │  │  - ProductContext (products, product types)           │ ││
│  │  │  - InvoiceContext (invoices, current invoice)         │ ││
│  │  │  - WholesalersContext (wholesalers, purchases)        │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  │  ┌────────────────────────────────────────────────────────┐ ││
│  │  │ Services (API Calls):                                  │ ││
│  │  │  - medicineService.js (products, batches, invoices)   │ ││
│  │  │  - productTypeService.js (product types)              │ ││
│  │  │  - axios instance (HTTP client with interceptors)     │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
                                ▲
                                │ REST API
                                │ (JSON)
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│              BACKEND (Django REST Framework)                      │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ API Endpoints (/api/):                                       ││
│  │  - /products/ (GET/POST) - list/create products             ││
│  │  - /products/{id}/ (GET/PUT/DELETE) - product details       ││
│  │  - /batches/ (GET/POST) - batch management                  ││
│  │  - /invoices/ (GET/POST) - billing                          ││
│  │  - /invoice-items/ (GET/POST) - invoice line items          ││
│  │  - /wholesalers/ (GET/POST) - wholesaler management         ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Models & Data Layer:                                         ││
│  │  - Product (name, type, generic_name, manufacturer, unit)   ││
│  │  - Batch (product, batch_number, mrp, selling_rate,         ││
│  │           cost_price, quantity, expiry_date)                ││
│  │  - Invoice (customer_name, items, total_amount, status)     ││
│  │  - InvoiceItem (invoice, product, batch, qty, rate)         ││
│  │  - Wholesaler (name, contact_person, phone, email)          ││
│  │  - ProductType (name, label, is_default)                    ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Business Logic:                                              ││
│  │  - Inventory deduction (atomic transaction)                  ││
│  │  - Stock validation (sufficient quantity check)              ││
│  │  - Payment status tracking                                   ││
│  │  - Batch-level FIFO ordering (for expiry)                    ││
│  └──────────────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Database (SQLite / PostgreSQL):                              ││
│  │  - Stores all products, batches, invoices, customers, etc.   ││
│  │  - Ensures data consistency with transactions                ││
│  │  - Indexes on frequently queried fields                      ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Frontend is display-only**: React components only show what the backend returns. No business logic on frontend.
2. **Backend is authoritative**: All validations, calculations, and business rules happen on backend.
3. **API contracts are explicit**: Defined in `frontend/API_CONTRACTS.md` - frontend expects exact response format.
4. **State management is local**: Each page/component uses React Context to manage its state.
5. **No cross-component dependencies**: Components are independent and communicate only through Context.

---

## Folder Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── components/              # Reusable & page-specific React components
│   │   ├── Common/              # Reusable components (all pages use these)
│   │   │   ├── Header.jsx       # App header with title
│   │   │   ├── Navigation.jsx   # Navigation tabs (Inventory, Billing, etc.)
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   └── ErrorAlert.jsx   # Error message display
│   │   │
│   │   ├── Product/             # Product/Inventory-specific components
│   │   │   ├── ProductList.jsx  # Display products in table with batch details
│   │   │   │                    # Features: expand/collapse batches, edit/delete actions
│   │   │   │                    # Shows: name, type, total qty, MRP range, actions
│   │   │   │
│   │   │   └── AddProductForm.jsx # Form to create new products
│   │   │                          # Takes: product_type (dropdown), name, details, batches
│   │   │                          # Returns: new product with auto-assigned ID
│   │   │
│   │   └── Billing/             # Invoice/Billing-specific components
│   │       ├── BillingForm.jsx  # Form to create new invoices (bills)
│   │       │                    # Features: select product, choose batch, enter qty, edit rate
│   │       │                    # Calls: creates invoice, triggers product refetch
│   │       │
│   │       └── InvoiceHistory.jsx # List of past invoices with filtering
│   │                             # Shows: invoice #, date, customer, total, payment status
│   │
│   ├── context/                 # React Context for state management
│   │   ├── ProductContext.jsx   # State: products, productTypes
│   │   │                        # Functions: fetchProducts, addProduct, updateProduct, deleteProduct
│   │   │
│   │   ├── InvoiceContext.jsx   # State: invoices, currentInvoice
│   │   │                        # Functions: fetchInvoices, createInvoice, updateInvoice, deleteInvoice
│   │   │
│   │   ├── WholesalersContext.jsx # State: wholesalers, purchases
│   │   │                          # Functions: fetch, add, update wholesalers
│   │   │
│   │   └── PurchaseBillsContext.jsx # State: purchase bills
│   │
│   ├── pages/                   # Full page components (routed)
│   │   ├── Dashboard.jsx        # Home/dashboard page
│   │   ├── Inventory.jsx        # Inventory management page
│   │   │                        # Contains: AddProductForm + ProductList
│   │   │                        # Handles: product editing/deletion
│   │   │
│   │   └── Billing.jsx          # Billing page
│   │                            # Contains: BillingForm + InvoiceHistory
│   │
│   ├── services/                # API calls and business logic
│   │   ├── api.js              # Axios instance with error interceptors
│   │   │                       # Base URL: http://localhost:8000/api
│   │   │
│   │   └── medicineService.js  # API service methods
│   │                           # Methods: getAll, getById, create, update, delete
│   │                           # For: products, batches, invoices, invoiceItems
│   │
│   ├── App.jsx                 # Main app component with routing
│   │                           # Routes: /dashboard, /inventory, /billing
│   │
│   ├── main.jsx                # React entry point (DO NOT MODIFY)
│   ├── index.css               # Tailwind CSS setup + custom styles
│   └── App.css                 # Additional app styles
│
├── public/                      # Static files (favicon, icons, etc.)
├── package.json                # Dependencies (React, Axios, React Router, Tailwind, etc.)
├── vite.config.js              # Vite configuration
├── tailwind.config.js           # Tailwind CSS theme configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                   # Frontend-specific documentation
```

### Backend Structure

```
backend/
├── config/                     # Django project settings
│   ├── settings.py            # Database, installed apps, middleware (CORS, etc.)
│   ├── urls.py                # URL routing (maps /api/* to views)
│   ├── wsgi.py & asgi.py      # Server configuration
│
├── inventory/                  # Main Django app (business logic lives here)
│   ├── models.py              # Data models (Product, Batch, Invoice, etc.)
│   ├── serializers.py         # API serializers (convert models to/from JSON)
│   ├── views.py               # ViewSets & API views (handle requests)
│   ├── urls.py                # App-level URL routing
│   ├── admin.py               # Django admin panel registration
│   │
│   └── migrations/            # Database schema changes (auto-created)
│       ├── 0001_initial.py    # Initial schema
│       └── ...
│
├── manage.py                  # Django command runner
├── db.sqlite3                 # SQLite database (auto-created on first run)
├── requirements.txt           # Python dependencies (Django, DRF, CORS, etc.)
└── .env (optional)            # Environment variables (database URL, secret key, etc.)
```

---

## Inventory Lifecycle

### 1. ADD PRODUCT

**User Action**: Click "Add Product" in Inventory tab  
**Frontend Flow**:
```
AddProductForm (Inventory.jsx)
  ↓
  [User fills form: name, product_type, manufacturer, salt_composition, details]
  ↓
  [User enters batches: batch_number, mrp, selling_rate, cost_price, qty, expiry_date]
  ↓
  Call ProductContext.addProduct(productData)
  ↓
  productService.create(productData) → HTTP POST to /api/products/
  ↓
  Backend creates product + batches (atomic transaction)
  ↓
  Return: {id, name, product_type, batches: [...]}
  ↓
  ProductContext: setProducts(prevProducts => [...prevProducts, newProduct])
  ↓
  ProductList re-renders with new product
```

**Backend Processing**:
```
POST /api/products/
  ↓
  ProductSerializer validates:
    - name: must be unique, required
    - product_type: must exist in ProductType or be custom
    - batches: each must have batch_number (unique per product), mrp, selling_rate, cost_price, quantity, expiry_date
  ↓
  Create Product record
  ↓
  For each batch:
    - Create Batch record with product foreign key
    - Set quantity from request
  ↓
  Return: full product with nested batches array
```

**State After Add**:
- ✅ Product in database
- ✅ Product in ProductContext.products
- ✅ Product appears in ProductList table
- ✅ Each batch has independent stock level

**Key Points**:
- `product_type` can be any string (backend doesn't validate type list anymore - frontend provides dropdown)
- Multiple batches per product are supported (common scenario)
- All three prices (MRP, Selling Rate, Cost Price) are stored per batch
- Batch `batch_number` must be unique per product (e.g., LOT-2024-001)

---

### 2. VIEW PRODUCTS

**User Action**: Go to Inventory tab  
**Frontend Flow**:
```
Inventory.jsx page loads
  ↓
  ProductList component mounts
  ↓
  useEffect hook: fetchProducts() [dependency: fetchProducts]
  ↓
  productService.getAll() → HTTP GET to /api/products/
  ↓
  ProductContext: setProducts(productList)
  ↓
  ProductList renders table with:
    - Product name, type (formatted), total qty (sum of batches)
    - MRP range (min-max from all batches)
    - Expand/Collapse button for batch details
    - Edit & Delete buttons
```

**Backend Processing**:
```
GET /api/products/
  ↓
  ViewSet returns all products (can support pagination)
  ↓
  Serializer includes nested batches: [
    {batch_number, mrp, selling_rate, cost_price, quantity, expiry_date},
    ...
  ]
  ↓
  Return: array of products with batches
```

**Batch Expansion View**:
```
When user clicks "View Batches" on a product:
  ↓
  Component state: expandedBatches[productId] = true
  ↓
  Shows each batch as a sub-row with:
    - Batch number
    - Expiry date
    - Current quantity
    - Prices (MRP, Selling Rate, Cost Price)
    - Purchase price info (if linked to wholesaler)
```

**Key Points**:
- Products are fetched on page load (useEffect dependency ensures this)
- Each product includes full batch details in response
- ProductList automatically calculates totals on frontend (sum quantities, min/max MRP)
- Batch expansion is pure UI state (no API call needed)

---

### 3. EDIT PRODUCT

**User Action**: Click Edit button on a product row  
**Frontend Flow**:
```
ProductList.jsx
  ↓
  User clicks Edit on product row
  ↓
  Calls onEdit() handler from Inventory.jsx
  ↓
  Inventory.jsx:
    - Could open modal form (currently not fully implemented)
    - Or navigate to edit page
  ↓
  EditProductForm (if implemented):
    - Pre-fill with current product data
    - Allow editing: name, product_type, batches
  ↓
  User clicks Save
  ↓
  Call ProductContext.updateProduct(id, updatedData)
  ↓
  productService.update(id, updatedData) → HTTP PUT to /api/products/{id}/
  ↓
  Backend updates product record
  ↓
  Return: updated product with new batch info
  ↓
  ProductContext: setProducts(prev => prev.map(p => p.id === id ? updated : p))
  ↓
  ProductList re-renders with updated product
```

**Backend Processing**:
```
PUT /api/products/{id}/
  ↓
  Validate update (partial update allowed):
    - name: if changed, must be unique
    - product_type: if changed, must be valid
    - description, manufacturer, etc.: update as provided
  ↓
  If batches provided:
    - This could create new batches or update existing ones
    - Delete old batches if not in request
    - Create new batches from request
  ↓
  Update Product record
  ↓
  Return: updated product with all current batches
```

**Current Limitation**:
- Edit button in ProductList exists but may not have full modal UI
- You can edit via Django admin panel: http://localhost:8000/admin/

**Key Points**:
- Editing product name should update everywhere (because ProductContext updates)
- Editing batch prices doesn't affect past invoices (historical data preserved)
- Batch quantity can be edited (for corrections or adjustments)

---

### 4. DELETE PRODUCT

**User Action**: Click Delete button on a product row  
**Frontend Flow**:
```
ProductList.jsx (product row)
  ↓
  User clicks Delete button
  ↓
  Calls onDelete() handler from Inventory.jsx
  ↓
  Inventory.jsx handleDelete function:
    - Shows window.confirm("Delete product X?")
    - If user cancels: return (nothing happens)
    - If user confirms: continue
  ↓
  Call ProductContext.deleteProduct(productId)
  ↓
  productService.delete(productId) → HTTP DELETE to /api/products/{id}/
  ↓
  Backend deletes product + all its batches
  ↓
  Return: success message
  ↓
  ProductContext: setProducts(prevProducts => prevProducts.filter(p => p.id !== id))
  ↓
  ProductList re-renders without deleted product
  ↓
  Console logs: ✅ ProductContext.deleteProduct: Product X deleted successfully
```

**Backend Processing**:
```
DELETE /api/products/{id}/
  ↓
  Find Product with given ID
  ↓
  Check: Product can only be deleted if no invoices reference it
         (or cascading delete allowed, depending on foreign key config)
  ↓
  Delete Product + all related Batch records (cascading)
  ↓
  Return: 204 No Content (success)
```

**State After Delete**:
- ✅ Product removed from database
- ✅ Product removed from ProductContext.products
- ✅ Product no longer visible in ProductList
- ✅ All batches of that product are also deleted
- ❓ Existing invoices with that product: depends on backend FK config
  - If CASCADE: invoices may be deleted or cascade update
  - If PROTECT: delete fails if invoices exist
  - If SET_NULL: invoice item's product becomes null

**Key Points**:
- Delete requires explicit user confirmation
- Delete is permanent and cannot be undone
- Deleting a product removes all its batches
- Console logs show deletion confirmation for debugging

---

## Billing Lifecycle

### 1. CREATE INVOICE

**User Action**: Go to Billing tab, click "Add Item", enter details, click "Create Invoice"

**Frontend Flow**:
```
BillingForm.jsx
  ↓
  User fills in:
    - customer_name (required)
    - customer_phone (optional)
    - notes (optional)
  ↓
  User clicks "Add Item" button:
    - New item row added with fields: product_id, batch_number, quantity, selling_rate, mrp
  ↓
  For each item:
    - User selects product from dropdown
      - Auto-fills: first available batch, selling_rate, mrp
    - User selects specific batch from dropdown (if multiple)
      - Auto-fills: selling_rate, mrp for that batch
    - User enters quantity
    - User can optionally edit selling_rate (override batch default)
  ↓
  User clicks "Create Invoice"
  ↓
  Frontend validation:
    - Customer name: required
    - At least one item: required
    - Each item: product_id, batch_number, quantity, selling_rate required
    - selling_rate: must be > 0
  ↓
  If validation passes:
    - Build invoiceData object with all items
    - Log payload: console.log('📤 BillingForm: Sending invoice payload:', invoiceData)
    - Call InvoiceContext.createInvoice(invoiceData)
    - HTTP POST to /api/invoices/ with items
  ↓
  Backend processes invoice (atomic transaction):
    - Create Invoice record
    - For each item:
      - Validate batch has sufficient quantity
      - Create InvoiceItem record
      - Deduct quantity from batch
    - Calculate total from all items
    - If any step fails: rollback entire transaction
  ↓
  Return: created invoice with all details
  ↓
  Frontend receives success response:
    - Console.log: ✅ BillingForm: Invoice created successfully
    - Reset form: clear customer_name, items array
    - Call fetchProducts() to get updated quantities
    - Console.log: 🔄 BillingForm: Refetching products
    - Call onBillingComplete() callback (if provided)
  ↓
  ProductList automatically updates with new quantities
```

**Backend Processing**:
```
POST /api/invoices/
  ↓
  InvoiceSerializer validates:
    - customer_name: required, string
    - customer_phone: optional
    - notes: optional
    - items: array with at least 1 item
  ↓
  For each item in items:
    - product_id: must exist in database
    - batch_number: must exist for that product
    - quantity: must be positive integer
    - selling_rate: must be positive decimal
  ↓
  Start atomic transaction:
    - Create Invoice record with:
      - customer_name, customer_phone, notes
      - invoice_date: current date
      - total_amount: calculated (sum of all items)
      - payment_status: default "unpaid"
    - For each item:
      - Find Batch by product_id + batch_number
      - Validate: batch.quantity >= item.quantity
      - Create InvoiceItem record with:
        - invoice (FK to created invoice)
        - product_id, batch_number
        - quantity (from user)
        - selling_rate (from user)
      - Update batch: batch.quantity -= item.quantity
      - Save batch (stock reduced)
    - Calculate total: sum(item.quantity * item.selling_rate) for all items
    - Save invoice with total_amount
  ↓
  If any validation fails:
    - Rollback: undo all batch updates, don't create invoice
    - Return error with details (e.g., "Batch LOT-001 has only 10 units, you requested 20")
  ↓
  If successful:
    - Commit transaction
    - Return: Invoice with all InvoiceItems and calculated total
```

**Payload Example**:
```json
{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "notes": "Regular customer",
  "items": [
    {
      "product_id": 1,
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "original_selling_rate": 25.00,
      "selling_rate": 25.00,
      "mrp": 30.00
    },
    {
      "product_id": 3,
      "batch_number": "SAC-2024-005",
      "quantity": 100,
      "original_selling_rate": 5.00,
      "selling_rate": 4.50,
      "mrp": 6.00
    }
  ]
}
```

**State After Creation**:
- ✅ Invoice created in database
- ✅ Invoice appears in InvoiceHistory
- ✅ All batch quantities reduced
- ✅ Total amount calculated
- ✅ Payment status: "unpaid" (default)
- ✅ Form reset for next invoice
- ✅ Products list updated with new quantities

**Critical State Management Fix**:
- After invoice creation, `fetchProducts()` is called to refresh the product list
- This ensures next invoice selection shows accurate, current quantities
- Without this, form would show stale inventory from before the invoice

**Key Points**:
- Invoice creation is atomic: either all succeeds or all fails
- Stock is deducted at invoice creation time (not at payment)
- Selling_rate can be different from batch default (editable during billing)
- Historical prices are preserved (original_selling_rate stored)
- MRP and Cost Price are for reference/history only (not used in invoice calculation)

---

### 2. VIEW INVOICES

**User Action**: Go to Billing tab, scroll down to see "Invoice History"  
**Frontend Flow**:
```
Billing.jsx page loads
  ↓
  InvoiceHistory component loads
  ↓
  useEffect: fetchInvoices() [on mount]
  ↓
  invoiceService.getAll() → HTTP GET to /api/invoices/
  ↓
  InvoiceContext: setInvoices(invoiceList)
  ↓
  InvoiceHistory renders table with:
    - Invoice #
    - Date created
    - Customer name
    - Total amount
    - Payment status (Unpaid / Partial / Paid)
    - View details button (expands to show items)
```

**Backend Processing**:
```
GET /api/invoices/
  ↓
  Return all invoices with:
    - id, invoice_number, date, customer_name, total_amount, payment_status
    - items: [
      { product_id, product_name, batch_number, quantity, selling_rate, subtotal },
      ...
    ]
  ↓
  Optional filters:
    - ?customer_name=John (search)
    - ?payment_status=unpaid (filter by status)
    - ?date_from=2024-01-01 (date range)
```

**Key Points**:
- Each invoice is immutable (cannot edit quantity after creation)
- Can view which batches were used
- Can see which items were in the invoice
- Payment status can be updated separately (payment tracking)

---

### 3. UPDATE INVOICE (PAYMENT TRACKING)

**User Action**: Mark invoice as partially paid or fully paid  
**Frontend Flow**:
```
InvoiceHistory.jsx
  ↓
  User clicks "Mark as Paid" or "Mark as Partial" on an invoice
  ↓
  Call InvoiceContext.updateInvoice(invoiceId, {payment_status: 'paid'})
  ↓
  invoiceService.update(invoiceId, {payment_status: 'paid'})
  ↓
  HTTP PUT to /api/invoices/{id}/
  ↓
  Backend updates payment_status field
  ↓
  Return: updated invoice
  ↓
  Frontend updates InvoiceContext.invoices
  ↓
  InvoiceHistory re-renders with new status
```

**Valid Payment Statuses**:
- `unpaid`: Invoice created, no payment received
- `partial`: Part of invoice amount received
- `paid`: Full invoice amount received

**Key Points**:
- Payment status is tracked but does NOT affect inventory
- Inventory is deducted immediately at invoice creation (not at payment)
- Payment tracking is for record keeping and financial reporting

---

### 4. DELETE INVOICE

**User Action**: Click Delete on an invoice (if implementation allows)  
**Frontend Flow**:
```
InvoiceHistory.jsx
  ↓
  User clicks Delete button
  ↓
  Confirmation dialog: "This will reverse the inventory deduction"
  ↓
  Call InvoiceContext.deleteInvoice(invoiceId)
  ↓
  invoiceService.delete(invoiceId) → HTTP DELETE to /api/invoices/{id}/
  ↓
  Backend:
    - Find invoice
    - For each item in invoice:
      - Add quantity back to batch: batch.quantity += item.quantity
    - Delete invoice + all invoice items
    - Commit transaction
  ↓
  Return: success
  ↓
  Frontend: updateInvoices (remove from list)
  ↓
  Call fetchProducts() to get updated quantities with restored stock
```

**Important**: Invoice deletion is not recommended in a real scenario because:
- It breaks financial records
- It reverses inventory tracking
- Better approach: mark as "cancelled" instead of deleting

**Current Status**: Delete functionality may not be fully exposed in UI

**Key Points**:
- Deleting an invoice reverses its inventory impact
- Should only be done for test data or errors
- Consider making it "admin only" or hiding it from normal UI

---

## Data Flow Diagrams

### Product Addition Flow

```
┌─────────────────────┐
│ Inventory.jsx page  │
│                     │
│ AddProductForm  <─  │ User fills: name, type,
│       ↓             │ batches (qty, prices)
│  [Form Submit]      │
│       ↓             │
│ ProductContext      │
│   .addProduct()     │
│       ↓             │
│ productService      │
│   .create()         │ HTTP POST /api/products/
│       ↓             │
│ Backend API         │
│ /api/products/      │ Validates + Creates Product + Batches
│       ↓             │ Returns: {id, name, batches[...]}
│       ↓             │
│ ProductContext      │
│   setProducts(...) ← │ Add to products array
│       ↓             │
│ ProductList         │
│   Re-renders    <─  │ New product appears in table
│                     │
└─────────────────────┘
```

### Invoice Creation Flow

```
┌──────────────────────┐
│ Billing.jsx page     │
│                      │
│ BillingForm      <── │ User:
│   ├─ customer_name   │  - Enters customer name
│   ├─ items[]:        │  - Adds items (product, batch, qty, rate)
│   │   ├─ product_id  │  - Clicks "Create Invoice"
│   │   ├─ batch_num   │
│   │   ├─ qty         │
│   │   └─ rate        │
│   ↓                  │
│ [Validate Form]      │ Check: all fields, qty > 0, rate > 0
│   ↓                  │
│ InvoiceContext       │
│  .createInvoice()    │
│   ↓                  │
│ invoiceService       │ HTTP POST /api/invoices/
│  .create()           │ with items array
│   ↓                  │
│ Backend API          │ START TRANSACTION:
│ /api/invoices/       │  1. Create Invoice
│                      │  2. For each item:
│                      │     - Validate batch qty
│                      │     - Create InvoiceItem
│                      │     - Deduct from batch
│                      │  3. Calculate total
│                      │  4. COMMIT or ROLLBACK
│   ↓                  │
│ ProductContext       │
│  .fetchProducts()    │ GET /api/products/ (refresh quantities)
│   ↓                  │
│ ProductList          │
│  Re-renders      <── │ Shows updated quantities
│                      │
│ InvoiceHistory       │
│  Re-renders      <── │ New invoice appears
│                      │
└──────────────────────┘
```

### State Dependencies

```
                    ┌──────────────────┐
                    │  ProductContext  │
                    │  ├─ products[]   │
                    │  ├─ productTypes │
                    │  ├─ loading      │
                    │  └─ error        │
                    └──────────────────┘
                           △
                           │ useProducts()
           ┌───────────────┼───────────────┐
           │               │               │
      ProductList    BillingForm      Inventory
      (displays)     (selects)        (manage)
           │               │               │
           │          [auto-fills]         │
           └───────────────┴───────────────┘


                    ┌──────────────────┐
                    │ InvoiceContext   │
                    │ ├─ invoices[]    │
                    │ ├─ currentInvoice│
                    │ ├─ loading       │
                    │ └─ error         │
                    └──────────────────┘
                           △
                           │ useInvoices()
           ┌───────────────┴───────────────┐
           │                               │
      BillingForm                   InvoiceHistory
      (creates)                      (displays)
           │                               │
           └───────────────┬───────────────┘
                  [after create, triggers]
                  fetchProducts() to sync
```

---

## Key Components & Concepts

### 1. React Context API (State Management)

All state is managed using React Context, NOT Redux or other libraries. This keeps the system simple.

**ProductContext**:
```jsx
// Structure
{
  products: [],           // Array of all products with batches
  productTypes: [],       // Array of product types (dropdown options)
  loading: false,         // True while fetching
  error: null,            // Error message if API call fails
}

// Available functions
- fetchProducts(params) → GET /api/products/
- addProduct(data) → POST /api/products/
- updateProduct(id, data) → PUT /api/products/{id}/
- deleteProduct(id) → DELETE /api/products/{id}/
- fetchProductTypes() → GET /api/product-types/
- addProductType(data) → POST /api/product-types/
- deleteProductType(name) → DELETE /api/product-types/{name}/
```

**InvoiceContext**:
```jsx
// Structure
{
  invoices: [],           // Array of all invoices
  currentInvoice: null,   // Currently viewed invoice
  loading: false,         // True while fetching
  error: null,            // Error message if API call fails
}

// Available functions
- fetchInvoices(params) → GET /api/invoices/
- fetchInvoice(id) → GET /api/invoices/{id}/
- createInvoice(data) → POST /api/invoices/
- updateInvoice(id, data) → PUT /api/invoices/{id}/
- deleteInvoice(id) → DELETE /api/invoices/{id}/
```

**Usage in Components**:
```jsx
// In any component:
const { products, fetchProducts, addProduct } = useProducts();
const { invoices, createInvoice } = useInvoices();

// In useEffect:
useEffect(() => {
  fetchProducts();
}, [fetchProducts]); // Proper dependency!
```

### 2. API Service Layer

All API calls go through `frontend/src/services/medicineService.js` and `api.js`

**How it works**:
1. Component calls `productService.create(data)`
2. Service calls `axios.post('/products/', data)`
3. Axios interceptor adds authentication (if needed), handles errors
4. Request goes to `http://localhost:8000/api/products/`
5. Backend responds with JSON
6. Service returns data or throws error
7. Component catches error in try-catch

**Base API URL**:
- Configured in `frontend/.env.local` or hardcoded in `api.js`
- Default: `http://localhost:8000/api`

### 3. Component Props & Event Handlers

**ProductList Component**:
```jsx
// Props from Inventory.jsx
<ProductList onEdit={handleEdit} onDelete={handleDelete} />

// onEdit called when user clicks Edit button
// onDelete called when user clicks Delete button
// Both must be async (API calls)
```

**BillingForm Component**:
```jsx
// Prop from Billing.jsx
<BillingForm onBillingComplete={handleBillingComplete} />

// onBillingComplete called after successful invoice creation
// Can be used to show confirmation, update summary, etc.
```

### 4. Error Handling

All errors follow this pattern:

```jsx
try {
  const data = await apiCall();
  setError(null);        // Clear previous error
  // Process data...
} catch (err) {
  const errorMsg = err.response?.data?.detail || err.message || 'Unknown error';
  setError(errorMsg);    // Store error in state
  console.error('❌ Context: Error details:', err);
}
```

**Error Types**:
- **Validation error (HTTP 400)**: User input invalid, backend returns details
  - Example: `{detail: "Insufficient quantity in batch LOT-001"}`
  - Frontend: Extract and show to user
- **Not found (HTTP 404)**: Resource doesn't exist
  - Example: Product ID doesn't exist
  - Frontend: Refresh data
- **Server error (HTTP 500)**: Unexpected backend error
  - Frontend: Show generic "Something went wrong" message
- **Network error**: No internet or backend offline
  - Frontend: Show "Cannot reach server" message

### 5. Loading States

All async operations use loading state:

```jsx
const [loading, setLoading] = useState(false);

// Start async operation
setLoading(true);
try {
  await someAsyncCall();
} finally {
  setLoading(false);  // Clear always, even on error
}

// In JSX:
{loading ? <LoadingSpinner /> : <Content />}
```

---

## Common Issues & Solutions

### Issue 1: Product List Disappears

**Symptoms**:
- Go to Inventory tab → products visible
- Switch to another tab
- Switch back to Inventory tab → products gone
- Refresh page (F5) → products reappear

**Root Cause**:
- `useEffect(() => { fetchProducts(); }, [])` with missing dependency
- When component re-mounts, old `fetchProducts` reference is stale
- This was fixed: dependency array now includes `[fetchProducts]`

**Solution**:
- Already implemented in ProductList.jsx
- Verify: `useEffect(() => { fetchProducts(); }, [fetchProducts])`

**To Test**:
1. Go to Inventory tab
2. Product list visible
3. Click Billing tab
4. Click Inventory tab
5. ✅ Product list should still be visible

---

### Issue 2: Delete Button Not Working

**Symptoms**:
- Click Delete on first product → works fine
- Click Delete on second product → does nothing
- No error in console

**Root Cause**:
- `deleteProduct` callback had array dependency: `useCallback(..., [products])`
- After first delete, `products` state changes
- Function reference changes, but old reference still in ProductList button handler
- Next click uses stale function with old product list

**Solution**:
- Already implemented in ProductContext.jsx
- Changed to: `useCallback(async (id) => { setProducts(prevProducts => ...) }, [])`
- Function reference never changes, always uses current state

**To Test**:
1. Delete product A → confirm → removed ✅
2. Delete product B → confirm → removed ✅
3. Delete product C → confirm → removed ✅
4. Console should show: "✅ ProductContext.deleteProduct: Product X deleted successfully"

---

### Issue 3: Invoice HTTP 400 Error

**Symptoms**:
- Create invoice with valid data
- Get HTTP 400: "Invalid request"
- Error message doesn't tell which field is wrong

**Root Causes**:
1. **Stale product data**: quantities shown are from before last invoice
   - Solution: `fetchProducts()` is called after invoice creation
2. **Missing fields in payload**: form validation missed something
   - Solution: Check console for "📤 BillingForm: Sending invoice payload:"
3. **Selling rate ≤ 0**: user entered invalid price
   - Solution: Form validates `selling_rate > 0`
4. **Product doesn't exist**: product was deleted between selecting and submitting
   - Solution: Rare, but refresh products list if unsure

**Solution**:
- Already implemented
- Check console logs for payload
- Verify backend validation errors
- Form prevents submission of invalid data

**To Debug**:
1. Open DevTools (F12)
2. Go to Console tab
3. Create invoice and watch logs
4. You should see: "📤 BillingForm: Sending invoice payload: {...}"
5. If error: "❌ BillingForm: Error creating invoice: {...}"

---

### Issue 4: Form Shows Stale Product Quantities

**Symptoms**:
- Create invoice with 10 units of Product X
- Form still shows 100 units available (should be 90)
- Create another invoice with 100 units → HTTP 400 "only 90 available"

**Root Cause**:
- After invoice creation, product quantities weren't refreshed
- Frontend still had old inventory data

**Solution**:
- Already implemented in BillingForm.jsx
- After successful invoice creation: `await fetchProducts()`
- This refreshes product list with updated quantities

**To Test**:
1. Check product quantity before invoice (say: 100)
2. Create invoice with 20 units
3. Invoice succeeds
4. Check console: "🔄 BillingForm: Refetching products"
5. Next invoice: form shows 80 units (100 - 20) ✅

---

### Issue 5: Batch Not Auto-Filling After Product Selection

**Symptoms**:
- Select product from dropdown
- Batch field stays empty
- Have to manually select batch

**Root Cause**:
- Product doesn't have batches in response
- Or batches array is empty

**Solution**:
- Check: Does product have `batches` array?
- If multiple batches: first is auto-selected
- If no batches: user must add batch first via product edit

**To Debug**:
1. Open DevTools (F12)
2. Go to Console tab
3. Select a product
4. Look for: "📥 ProductContext.fetchProducts:" message
5. Check if returned products have `batches: [...]`

---

## Rules for Safe Changes

### ✅ DO

1. **Always include dependencies in useCallback and useEffect**:
   ```jsx
   // GOOD
   const deleteProduct = useCallback(async (id) => {
     setProducts(prevProducts => prevProducts.filter(...))
   }, []); // No dependencies, uses current state safely
   
   // GOOD
   useEffect(() => {
     fetchProducts();
   }, [fetchProducts]); // Includes all values from scope
   ```

2. **Use functional setState for current state access**:
   ```jsx
   // GOOD - always has current state
   setProducts(prevProducts => [...prevProducts, newProduct]);
   
   // GOOD - for filtered updates
   setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
   ```

3. **Handle errors consistently**:
   ```jsx
   try {
     // API call
   } catch (err) {
     setError(err.response?.data?.detail || err.message);
     console.error('Context error:', err);
   }
   ```

4. **Always reset loading/error states**:
   ```jsx
   setLoading(true);
   setError(null);
   try {
     // ...
   } finally {
     setLoading(false); // Runs even if error occurs
   }
   ```

5. **Add console logs for debugging**:
   ```jsx
   console.log('📥 ProductContext.fetchProducts: Fetched', products.length, 'products');
   console.log('🔄 BillingForm: Refetching products');
   console.log('❌ Error creating invoice:', err);
   ```

6. **Test with DevTools Console open (F12)**:
   - Watch logs appear as you use the app
   - Check Network tab for API calls
   - Look for red error messages

### ❌ DON'T

1. **Don't capture state in useCallback without dependency**:
   ```jsx
   // BAD - products is stale after state change
   const deleteProduct = useCallback(async (id) => {
     setProducts(products.filter(...)) // Captured products from creation time
   }, [products]); // Re-creates on every change!
   ```

2. **Don't forget useEffect dependencies**:
   ```jsx
   // BAD - only runs once, fetchProducts may be stale
   useEffect(() => {
     fetchProducts();
   }, []); // Missing fetchProducts dependency
   ```

3. **Don't directly mutate state**:
   ```jsx
   // BAD
   products.push(newProduct);
   setProducts(products); // Direct mutation!
   
   // GOOD
   setProducts([...products, newProduct]); // New array
   ```

4. **Don't create new functions in JSX attributes**:
   ```jsx
   // BAD - creates new function on every render
   <button onClick={() => deleteProduct(id)} />
   
   // GOOD - use memoized callback from context
   <button onClick={() => onDelete(id)} /> // onDelete is stable
   ```

5. **Don't make API calls without error handling**:
   ```jsx
   // BAD
   const result = await productService.create(data);
   
   // GOOD
   try {
     const result = await productService.create(data);
     setError(null);
   } catch (err) {
     setError(err.response?.data?.detail || err.message);
   }
   ```

6. **Don't modify backend models without migration**:
   ```
   If you change a model field:
   1. Make the change in models.py
   2. Run: python manage.py makemigrations
   3. Run: python manage.py migrate
   4. Test thoroughly
   ```

7. **Don't change API response formats without updating frontend**:
   ```
   If backend changes JSON response:
   1. Update serializer to return new format
   2. Update frontend service to handle new format
   3. Update Context to match new structure
   4. Update components to use new fields
   5. Test API responses with DevTools Network tab
   ```

---

## Troubleshooting Guide

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'django'`

**Solution**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Won't Start

**Error**: `npm: command not found` or similar

**Solution**:
```bash
cd frontend
npm install  # Install dependencies if not already done
npm run dev
```

**Port Already in Use**: If port 5173 is busy, Vite will auto-use 5174

### Cannot Connect to Backend

**Error**: `CORS error` or `Failed to connect to http://localhost:8000`

**Solutions**:
1. **Backend not running**:
   ```bash
   cd backend && python manage.py runserver
   ```

2. **Wrong URL in frontend**: Check `frontend/src/services/api.js`
   ```jsx
   // Should be:
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

3. **CORS not enabled**: Check `backend/config/settings.py`
   ```python
   INSTALLED_APPS = [
       'corsheaders',  # Must be here
       ...
   ]
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',  # Must be first
       ...
   ]
   CORS_ALLOWED_ORIGINS = [
       'http://localhost:5173',
       'http://localhost:5174',  # Vite alternate port
   ]
   ```

### Products Not Showing

**Debugging Steps**:

1. Check browser console (F12 → Console tab)
   - Look for error messages in red
   - Look for "📥 ProductContext.fetchProducts:" log

2. Check Network tab (F12 → Network tab)
   - Look for GET `/api/products/` request
   - Check Status: should be 200 (success)
   - Check Response: should be JSON array of products

3. Check if database has data
   ```bash
   cd backend
   python manage.py shell
   >>> from inventory.models import Product
   >>> Product.objects.count()
   ```
   - If 0: Add products via admin or load sample data

4. Verify ProductList useEffect
   ```jsx
   // Should be:
   useEffect(() => {
     fetchProducts();
   }, [fetchProducts]); // Important: include fetchProducts!
   ```

### Invoice Creation Fails

**Debugging Steps**:

1. Check DevTools Console (F12)
   - Look for "📤 BillingForm: Sending invoice payload:" log
   - Look for "❌ BillingForm: Error creating invoice:" log

2. Check Network tab (F12 → Network)
   - Find POST `/api/invoices/` request
   - Check Status: if 400, see Response for error details
   - Common errors:
     - "Insufficient quantity in batch"
     - "Required field missing"
     - "Product not found"

3. Verify form validation
   - Customer name: required
   - At least 1 item: required
   - Each item: product, batch, quantity, selling_rate

4. Check product selection
   - Batch should auto-fill when product selected
   - If not: product may not have batches

### Delete Not Working

**Debugging Steps**:

1. Check browser console (F12)
   - Look for "🗑️ Delete product:" log
   - Look for "❌ Delete failed:" error log

2. Check Network tab
   - Look for DELETE `/api/products/{id}/` request
   - Check Status: should be 204 (No Content)

3. Verify Inventory.jsx has handler
   ```jsx
   const handleDelete = async (id) => {
     const confirmed = window.confirm(...);
     if (!confirmed) return;
     try {
       await deleteProduct(id);
       // Success
     } catch (err) {
       // Error handling
     }
   };
   ```

4. Verify ProductList passes handler
   ```jsx
   <button onClick={() => onDelete(id)}>Delete</button>
   // onDelete comes from Inventory.jsx
   ```

### Database Issues

**Reset Database** (warning: will delete all data):
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
# Or load sample data:
# python manage.py load_sample_data
```

**Check Database Contents**:
```bash
cd backend
python manage.py dbshell
sqlite> SELECT COUNT(*) FROM inventory_product;
sqlite> SELECT * FROM inventory_product LIMIT 1;
sqlite> .quit
```

**Or use Django Admin**:
- Go to http://localhost:8000/admin/
- Login: admin / admin123
- Browse and edit data directly

---

## Next Steps for Development

### To Add a New Feature

1. **Define what you're adding**: New product field? New invoice type?

2. **Update Backend** (if needed):
   - Modify `backend/inventory/models.py`
   - Create and run migration: `python manage.py makemigrations && migrate`
   - Update serializer: `backend/inventory/serializers.py`
   - Update view: `backend/inventory/views.py`
   - Test via Django admin or API client (Postman)

3. **Update Frontend** (if needed):
   - Update service: `frontend/src/services/medicineService.js`
   - Update context: `frontend/src/context/ProductContext.jsx` or similar
   - Update component: add new fields to form
   - Add console logs for debugging
   - Test in browser DevTools

4. **Test Thoroughly**:
   - Open DevTools Console (F12)
   - Verify logs appear as expected
   - Check Network tab for API calls
   - Try error cases (invalid input, missing fields)

### To Fix a Bug

1. **Reproduce the bug**: Document exact steps
2. **Check console logs** (F12 → Console): Look for errors
3. **Check network requests** (F12 → Network): See what API calls happen
4. **Check context state**: Use React DevTools to inspect state
5. **Add more console logs**: Trace execution flow
6. **Check git diff**: What changed recently?
7. **Verify dependencies**: In useCallback and useEffect
8. **Test isolated**: Does bug happen with specific product/invoice?

### Database Migrations

When you modify `models.py`:

```bash
cd backend
python manage.py makemigrations  # Creates migration file
python manage.py migrate          # Applies migrations to database
```

**Example**: Add new field to Product model
```python
# models.py
class Product(models.Model):
    name = models.CharField(...)
    new_field = models.CharField(max_length=100, blank=True)  # NEW
```

```bash
python manage.py makemigrations
# Creates: migrations/0005_product_new_field.py
python manage.py migrate
# Applies to database
```

---

## Useful Commands

### Backend

```bash
# Start development server
cd backend && python manage.py runserver

# Create superuser (admin account)
python manage.py createsuperuser

# Django shell (interactive Python with models)
python manage.py shell

# Load sample data
python manage.py load_sample_data  # If available

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check database
python manage.py dbshell
```

### Frontend

```bash
# Start development server
cd frontend && npm run dev

# Build for production
npm run build

# Clear cache and reinstall
rm -rf node_modules && npm install

# Update dependencies
npm update
```

---

## System Requirements

- **Python**: 3.12+
- **Node.js**: 18+ (LTS)
- **npm**: 9+
- **Browser**: Modern browser with DevTools support
- **Disk**: ~500MB (with node_modules and venv)

---

## Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Start backend | `python manage.py runserver` | `/backend` |
| Start frontend | `npm run dev` | `/frontend` |
| Open admin | http://localhost:8000/admin/ | - |
| Access API | http://localhost:8000/api/ | - |
| View frontend | http://localhost:5173 or 5174 | - |
| View logs | DevTools Console (F12) | Browser |
| Check network | DevTools Network tab (F12) | Browser |
| Edit database | http://localhost:8000/admin/ | Web UI |
| View database | `python manage.py dbshell` | Terminal |
| Code editor | VS Code | Local |

---

**Status**: ✅ System complete and fully operational  
**Last Tested**: January 21, 2026  
**Ready for**: Production use, modifications, enhancements
