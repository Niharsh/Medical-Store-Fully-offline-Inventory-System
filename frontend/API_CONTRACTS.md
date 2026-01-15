# API Contracts & Specifications

This document defines the expected API contracts for the Django REST Framework backend for a **Generic Medical Store Inventory System**. These are requirements the frontend expects the backend to fulfill. **No assumptions are made beyond what is explicitly documented here.**

Supports multiple product types: tablets, syrups, powders, creams, diapers, condoms, sachets, and more.

---

## ⚠️ Important Rules

1. **Frontend does NOT**:
   - Calculate totals, subtotals, or taxes
   - Validate business rules
   - Transform data structures
   - Enforce constraints (e.g., expiry dates)
   - Apply discounts or markup

2. **Backend MUST**:
   - Handle all calculations and validations
   - Return complete, ready-to-display data
   - Ensure data consistency
   - Apply all business rules

3. **Frontend WILL**:
   - Display exactly what the API returns
   - Validate only form input (required fields, data types)
   - Pass raw user input to the backend
   - Let the backend decide what's valid

---

## Base URL

```
http://localhost:8000/api
```

All endpoints are relative to this base URL.

---

## 1. Products Endpoint

### GET /products/

List all products with filtering support.

**Query Parameters**:
- `search` (optional): Search by name or generic_name
- `quantity__lt` (optional): Filter products where quantity is less than value (for low stock)
- `page` (optional): Pagination

**Expected Response**:
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Aspirin 500mg",
      "product_type": "tablet",
      "generic_name": "Acetylsalicylic Acid",
      "manufacturer": "Pharma Ltd",
      "salt_composition": "Paracetamol 500mg",
      "price": "25.50",
      "quantity": 150,
      "unit": "pc",
      "description": "Pain reliever and fever reducer",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Cough Syrup",
      "product_type": "syrup",
      "generic_name": "Dextromethorphan",
      "manufacturer": "Pharma Ltd",
      "salt_composition": null,
      "price": "150.00",
      "quantity": 50,
      "unit": "bottle",
      "description": "Cough suppressant syrup",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Notes**:
- `product_type` is one of: tablet, syrup, powder, cream, diaper, condom, sachet (extensible)
- `price` is the selling price (used for display, not calculations)
- `quantity` is current stock level
- `unit` indicates the unit of sale (pc, bottle, gm, ml, etc.) - flexible per product
- Pagination is handled by DRF defaults

---

### POST /products/

Create a new product.

**Request Body**:
```json
{
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "generic_name": "Acetylsalicylic Acid",
  "manufacturer": "Pharma Ltd",
  "salt_composition": "Paracetamol 500mg",
  "price": "25.50",
  "quantity": 100,
  "unit": "pc",
  "description": "Pain reliever"
}
```

**Expected Response**: 201 Created
```json
{
  "id": 1,
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "generic_name": "Acetylsalicylic Acid",
  "manufacturer": "Pharma Ltd",
  "salt_composition": "Paracetamol 500mg",
  "price": "25.50",
  "quantity": 100,
  "unit": "pc",
  "description": "Pain reliever",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Validation** (Backend):
- `name` is required, unique, max 255 chars
- `product_type` is required, must be one of: tablet, syrup, powder, cream, diaper, condom, sachet
- `price` must be >= 0
- `quantity` must be >= 0
- `unit` should be flexible per product (pc, bottle, gm, ml, etc.)
- `salt_composition` is optional, mainly for tablets/capsules (max 500 chars)

---

### GET /products/{id}/

Get a single product by ID.

**Expected Response**: 200 OK
```json
{
  "id": 1,
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "generic_name": "Acetylsalicylic Acid",
  "manufacturer": "Pharma Ltd",
  "salt_composition": "Paracetamol 500mg",
  "price": "25.50",
  "quantity": 150,
  "unit": "pc",
  "description": "Pain reliever",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### PATCH /products/{id}/

Update a product.

**Request Body** (all fields optional):
```json
{
  "name": "Aspirin 500mg",
  "price": "26.00",
  "quantity": 120
}
```

**Expected Response**: 200 OK
Same as GET response with updated fields.

---

### DELETE /products/{id}/

Delete a product.

**Expected Response**: 204 No Content

---

## 2. Product Types Endpoint

### GET /product-types/

List all available product types (default + custom).

**Expected Response**:
```json
[
  {
    "id": "tablet",
    "label": "Tablet",
    "is_default": true
  },
  {
    "id": "syrup",
    "label": "Syrup",
    "is_default": true
  },
  {
    "id": "powder",
    "label": "Powder",
    "is_default": true
  },
  {
    "id": "cream",
    "label": "Cream",
    "is_default": true
  },
  {
    "id": "diaper",
    "label": "Diaper",
    "is_default": true
  },
  {
    "id": "condom",
    "label": "Condom",
    "is_default": true
  },
  {
    "id": "sachet",
    "label": "Sachet",
    "is_default": true
  },
  {
    "id": "gel",
    "label": "Gel",
    "is_default": false
  }
]
```

**Notes**:
- Returns both default product types and custom types added by the owner
- Default types have `is_default: true`
- Custom types have `is_default: false`
- Owner cannot delete default types

---

### POST /product-types/

Create a new custom product type.

**Request Body**:
```json
{
  "name": "gel",
  "label": "Gel"
}
```

**Expected Response**: 201 Created
```json
{
  "id": "gel",
  "label": "Gel",
  "is_default": false
}
```

**Validation** (Backend):
- `name` is required, unique, lowercase, alphanumeric + underscores (max 50 chars)
- `label` is required, readable display name (max 100 chars)
- Cannot have same name as default type

**Error Handling**:
- 400 Bad Request if `name` already exists: `{"name": ["Product type with this name already exists"]}`
- 400 Bad Request if invalid characters in `name`

---

### DELETE /product-types/{id}/

Delete a custom product type.

**Expected Response**: 204 No Content

**Validation** (Backend):
- Cannot delete default types (tablet, syrup, powder, cream, diaper, condom, sachet)
- 403 Forbidden if attempting to delete default type
- 404 Not Found if product type doesn't exist

---

## 2. Batches Endpoint

### GET /batches/

List all batches with filtering.

**Query Parameters**:
- `product` (optional): Filter by product ID
- `expiry_date__lt` (optional): Filter batches expiring before date

**Expected Response**:
```json
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "product": 1,
      "batch_number": "LOT-2024-001",
      "quantity": 500,
      "expiry_date": "2026-12-31",
      "manufactured_date": "2024-01-15",
      "price": "20.00",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /batches/

Create a new batch.

**Request Body**:
```json
{
  "product": 1,
  "batch_number": "LOT-2024-001",
  "quantity": 500,
  "expiry_date": "2026-12-31",
  "manufactured_date": "2024-01-15",
  "price": "20.00"
}
```

**Backend Validation**:
- `batch_number` is required, unique
- `quantity` must be > 0
- `expiry_date` must be >= `manufactured_date`
- `price` must be >= 0

**Expected Response**: 201 Created (same as GET response)

---

### PATCH /batches/{id}/

Update batch (quantity, expiry_date, etc.).

**Request Body** (all optional):
```json
{
  "quantity": 450,
  "expiry_date": "2026-12-31"
}
```

---

### DELETE /batches/{id}/

Delete a batch.

**Expected Response**: 204 No Content

---

## 3. Invoices Endpoint

### GET /invoices/

List all invoices.

**Query Parameters**:
- `customer_name` (optional): Filter by customer
- `date_after` (optional): Filter by date range
- `ordering` (optional): `-created_at` for newest first

**Expected Response**:
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "customer_name": "John Doe",
      "customer_phone": "9876543210",
      "total_amount": "500.00",
      "notes": "Paid in cash",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Notes**:
- `total_amount` is calculated by backend from invoice items
- Frontend does NOT calculate this

---

### POST /invoices/

Create a new invoice.

**Request Body**:
```json
{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "notes": "Regular customer",
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "unit_price": "25.50"
    },
    {
      "product": 2,
      "quantity": 1,
      "unit_price": "100.00"
    }
  ]
}
```

**Backend Responsibilities**:
- Validate product IDs exist
- Validate quantities are > 0
- Check stock availability (if applicable)
- Calculate `total_amount` from items
- Create invoice and all associated items in one transaction
- Return full invoice with calculated total

**Expected Response**: 201 Created
```json
{
  "id": 1,
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "total_amount": "151.00",
  "notes": "Regular customer",
  "items": [
    {
      "id": 1,
      "product": 1,
      "quantity": 2,
      "unit_price": "25.50",
      "subtotal": "51.00"
    },
    {
      "id": 2,
      "product": 2,
      "quantity": 1,
      "unit_price": "100.00",
      "subtotal": "100.00"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### GET /invoices/{id}/

Get a single invoice with all items.

**Expected Response**:
```json
{
  "id": 1,
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "total_amount": "151.00",
  "notes": "Regular customer",
  "items": [
    {
      "id": 1,
      "product": 1,
      "product_name": "Aspirin 500mg",
      "quantity": 2,
      "unit_price": "25.50",
      "subtotal": "51.00"
    },
    {
      "id": 2,
      "product": 2,
      "product_name": "Paracetamol 500mg",
      "quantity": 1,
      "unit_price": "100.00",
      "subtotal": "100.00"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Notes**:
- Include `product_name` for display
- Include `product_type` for product categorization in invoice items
- Include calculated `subtotal` for each item
- Include calculated `total_amount`

---

### PATCH /invoices/{id}/

Update invoice metadata (not items).

**Request Body**:
```json
{
  "customer_name": "Jane Doe",
  "notes": "Updated notes"
}
```

**Expected Response**: 200 OK

---

### DELETE /invoices/{id}/

Delete an invoice.

**Expected Response**: 204 No Content

---

## 4. Invoice Items Endpoint

### GET /invoice-items/

List invoice items with filtering.

**Query Parameters**:
- `invoice` (optional): Filter by invoice ID

**Expected Response**:
```json
{
  "count": 200,
  "results": [
    {
      "id": 1,
      "invoice": 1,
      "product": 1,
      "product_name": "Aspirin 500mg",
      "product_type": "tablet",
      "quantity": 2,
      "unit_price": "25.50",
      "subtotal": "51.00"
    }
  ]
}
```

---

### PATCH /invoice-items/{id}/

Update an invoice item (quantity, unit_price).

**Request Body**:
```json
{
  "quantity": 3,
  "unit_price": "26.00"
}
```

**Backend Responsibility**:
- Recalculate invoice `total_amount`
- Return updated item with new `subtotal`

**Expected Response**: 200 OK
```json
{
  "id": 1,
  "invoice": 1,
  "product": 1,
  "product_name": "Aspirin 500mg",
  "product_type": "tablet",
  "quantity": 3,
  "unit_price": "26.00",
  "subtotal": "78.00"
}
```

---

### DELETE /invoice-items/{id}/

Delete an invoice item.

**Backend Responsibility**:
- Recalculate invoice `total_amount`

**Expected Response**: 204 No Content

---

## 5. Error Responses

All endpoints should return appropriate error codes:

### 400 Bad Request
```json
{
  "detail": "Field validation failed",
  "errors": {
    "name": ["This field is required."],
    "price": ["Ensure this value is greater than or equal to 0."]
  }
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "An internal server error occurred."
}
```

---

## Frontend Expectations Summary

| Responsibility | Frontend | Backend |
|---|---|---|
| Form input validation (required, type) | ✅ | ✅ |
| Business rule validation | ❌ | ✅ |
| Calculations (totals, subtotals) | ❌ | ✅ |
| Data transformation | ❌ | ✅ |
| Stock availability check | ❌ | ✅ |
| Expiry date validation | ❌ | ✅ |
| Data display/rendering | ✅ | ❌ |
| Form building | ✅ | ❌ |

---

## Notes for Backend Developers

1. **CORS**: Configure `django-cors-headers` to allow `http://localhost:5173`
2. **Pagination**: Use DRF's default pagination (results under "results" key)
3. **Timestamps**: Always include `created_at` and `updated_at`
4. **Calculations**: ALL calculations (totals, subtotals) must be done by the backend
5. **Validation**: ALL business logic validation must be on the backend
6. **Responses**: Always return complete data that the frontend can display immediately

---

## Frontend Assumptions (Explicit & Removable)

- API returns paginated results with `count`, `next`, `previous`, `results`
- All timestamps are ISO 8601 format
- Prices are returned as strings (Decimal fields)
- IDs are integers
- All responses include full object data (not just IDs)

These can be changed without frontend refactoring if the API response structure changes.
