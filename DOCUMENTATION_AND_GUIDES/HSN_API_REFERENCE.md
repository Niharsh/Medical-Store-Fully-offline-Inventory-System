# HSN Code Implementation - API Reference

## Base URL
```
http://localhost:8000/api
```

## Authentication
All endpoints require authentication. Include your auth token in headers:
```
Authorization: Token YOUR_AUTH_TOKEN
```

---

## HSN Endpoints

### 1. List All HSN Codes
**GET** `/api/hsn/`

**Description:** Get all active HSN codes

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "hsn_code": "3003",
      "description": "Medicaments - Other",
      "gst_rate": "5.00",
      "is_active": true,
      "created_at": "2026-01-29T07:24:38.123456Z",
      "updated_at": "2026-01-29T07:24:38.123456Z"
    },
    {
      "hsn_code": "3004",
      "description": "Medicaments - Antibiotics",
      "gst_rate": "12.00",
      "is_active": true,
      "created_at": "2026-01-29T07:24:39.123456Z",
      "updated_at": "2026-01-29T07:24:39.123456Z"
    }
  ]
}
```

---

### 2. Create New HSN Code
**POST** `/api/hsn/`

**Description:** Create a new HSN code with its GST rate

**Request Body:**
```json
{
  "hsn_code": "3004",
  "description": "Medicaments - Antibiotics",
  "gst_rate": 12,
  "is_active": true
}
```

**Response (201 Created):**
```json
{
  "hsn_code": "3004",
  "description": "Medicaments - Antibiotics",
  "gst_rate": "12.00",
  "is_active": true,
  "created_at": "2026-01-29T07:24:39.123456Z",
  "updated_at": "2026-01-29T07:24:39.123456Z"
}
```

**Possible Errors:**
- `400 Bad Request`: HSN code already exists or invalid gst_rate
- `400 Bad Request`: Missing required fields (hsn_code, gst_rate)

---

### 3. Get Specific HSN Code
**GET** `/api/hsn/{hsn_code}/`

**Description:** Get details of a specific HSN code

**Example:** `GET /api/hsn/3004/`

**Response:**
```json
{
  "hsn_code": "3004",
  "description": "Medicaments - Antibiotics",
  "gst_rate": "12.00",
  "is_active": true,
  "created_at": "2026-01-29T07:24:39.123456Z",
  "updated_at": "2026-01-29T07:24:39.123456Z"
}
```

**Possible Errors:**
- `404 Not Found`: HSN code doesn't exist

---

### 4. Update HSN Code
**PUT** `/api/hsn/{hsn_code}/` (full update)
**PATCH** `/api/hsn/{hsn_code}/` (partial update)

**Description:** Update an existing HSN code

**Example:** `PATCH /api/hsn/3004/`

**Request Body (any fields to update):**
```json
{
  "description": "Medicaments - Antibiotics Updated",
  "gst_rate": 12,
  "is_active": true
}
```

**Response:**
```json
{
  "hsn_code": "3004",
  "description": "Medicaments - Antibiotics Updated",
  "gst_rate": "12.00",
  "is_active": true,
  "created_at": "2026-01-29T07:24:39.123456Z",
  "updated_at": "2026-01-29T08:30:45.654321Z"
}
```

**Note:** `hsn_code` cannot be changed (it's the primary key)

---

### 5. Delete HSN Code
**DELETE** `/api/hsn/{hsn_code}/`

**Description:** Delete an HSN code

**Example:** `DELETE /api/hsn/3004/`

**Response:** `204 No Content` (empty response)

**Possible Errors:**
- `404 Not Found`: HSN code doesn't exist

---

## Product Endpoints (Enhanced)

### Get Product (with HSN Details)
**GET** `/api/products/{product_id}/`

**Response:**
```json
{
  "id": 1,
  "name": "Amoxicillin 500mg",
  "product_type": "tablet",
  "hsn": "3004",                    // Foreign key to HSN
  "hsn_code": "3004",               // Read-only, derived from hsn.hsn_code
  "gst_rate": "12.00",              // Read-only, derived from hsn.gst_rate
  "generic_name": "Amoxicillin",
  "manufacturer": "Pharma Ltd",
  "unit": "pc",
  "salt_composition": "",
  "description": "Antibiotic medication",
  "min_stock_level": 10,
  "created_at": "2026-01-29T07:24:40.123456Z",
  "updated_at": "2026-01-29T07:24:40.123456Z",
  "batches": [
    {
      "id": 1,
      "batch_number": "LOT-2024-001",
      "mrp": "150.00",
      "selling_rate": "120.00",
      "cost_price": "90.00",
      "quantity": 100,
      "expiry_date": "2025-12-31"
    }
  ],
  "total_stock": 100,
  "cost_price": 90.0,
  "selling_price": 120.0,
  "nearest_expiry": "2025-12-31"
}
```

### Create Product (with HSN)
**POST** `/api/products/`

**Request Body:**
```json
{
  "name": "Amoxicillin 500mg",
  "product_type": "tablet",
  "hsn": "3004",                    // Optional: link to HSN
  "generic_name": "Amoxicillin",
  "manufacturer": "Pharma Ltd",
  "unit": "pc",
  "description": "Antibiotic medication",
  "min_stock_level": 10,
  "batches": [
    {
      "batch_number": "LOT-2024-001",
      "mrp": 150.00,
      "selling_rate": 120.00,
      "cost_price": 90.00,
      "quantity": 100,
      "expiry_date": "2025-12-31"
    }
  ]
}
```

**Response:** `201 Created` with product data including `hsn_code` and `gst_rate`

### Update Product (with HSN)
**PATCH** `/api/products/{product_id}/`

**Request Body:**
```json
{
  "hsn": "3003"                     // Change HSN to 3003
}
```

---

## Invoice Endpoints (Enhanced)

### Create Invoice (with HSN Auto-Fill)
**POST** `/api/invoices/`

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "customer_dl_number": "DL-001",
  "discount_percent": 0,
  "gst_percent": 0,
  "notes": "Test invoice",
  "items": [
    {
      "product_id": 1,
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "selling_rate": 120.00,
      "discount_percent": 0,
      "gst_percent": 12              // Will be auto-filled from HSN if not provided
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "customer_dl_number": "DL-001",
  "gst_percent": "0.00",
  "discount_percent": "0.00",
  "total_amount": "672.00",
  "notes": "Test invoice",
  "created_at": "2026-01-29T08:30:45.654321Z",
  "updated_at": "2026-01-29T08:30:45.654321Z",
  "items": [
    {
      "id": 2,
      "product_name": "Amoxicillin 500mg",
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "expiry_date": "2025-12-31",
      "hsn_code": "3004",            // Auto-filled from product.hsn
      "selling_rate": "120.00",
      "mrp": "150.00",
      "discount_percent": "0.00",
      "gst_percent": "12.00",        // Auto-filled from product.hsn.gst_rate
      "is_return": false,
      "return_reason": "",
      "subtotal": "600.00",
      "discount_amount": "0.00",
      "taxable_amount": "600.00",
      "cgst": "36.00",
      "sgst": "36.00",
      "total_amount": "672.00",
      "created_at": "2026-01-29T08:30:45.654321Z"
    }
  ]
}
```

### Get Invoice (with HSN Details)
**GET** `/api/invoices/{invoice_id}/`

**Response:** Same as Create response (includes HSN in items)

---

## Data Type Reference

### HSN Fields
| Field | Type | Constraints |
|-------|------|------------|
| hsn_code | String | max_length=20, unique, primary_key |
| description | String | max_length=255, optional |
| gst_rate | Decimal | max_digits=5, decimal_places=2 (0-100) |
| is_active | Boolean | default=True |
| created_at | DateTime | auto_now_add=True, read-only |
| updated_at | DateTime | auto_now=True, read-only |

### Product HSN Fields
| Field | Type | Relationship |
|-------|------|------------|
| hsn | Foreign Key | References HSN.hsn_code, null=True, blank=True |
| hsn_code | String | Read-only, derived from hsn.hsn_code |
| gst_rate | Decimal | Read-only, derived from hsn.gst_rate |

### InvoiceItem HSN Fields
| Field | Type | Source |
|-------|------|--------|
| hsn_code | String | Auto-filled from product.hsn.hsn_code during billing |
| gst_percent | Decimal | Auto-filled from product.hsn.gst_rate during billing |

---

## Query Parameters

### List HSN Codes
```
GET /api/hsn/?search=antibiotics
GET /api/hsn/?ordering=hsn_code
GET /api/hsn/?page=2
```

### Available Filters
- `search`: Search in hsn_code, description
- `ordering`: Sort by hsn_code, gst_rate, created_at
- `page`: Pagination (default page_size=50)

---

## Error Responses

### 400 Bad Request
```json
{
  "hsn_code": ["This field must be unique."],
  "gst_rate": ["Ensure this value is less than or equal to 100."]
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

---

## Example Workflows

### Workflow 1: Create and Use HSN

**Step 1: Create HSN**
```bash
curl -X POST http://localhost:8000/api/hsn/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hsn_code": "3004",
    "description": "Medicaments - Antibiotics",
    "gst_rate": 12
  }'
```

**Step 2: Create Product with HSN**
```bash
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amoxicillin 500mg",
    "product_type": "tablet",
    "hsn": "3004",
    "manufacturer": "Pharma Ltd",
    "unit": "pc",
    "batches": [{"batch_number": "LOT-001", "mrp": 150, "selling_rate": 120, "cost_price": 90, "quantity": 100, "expiry_date": "2025-12-31"}]
  }'
```

**Step 3: Create Invoice (HSN auto-filled)**
```bash
curl -X POST http://localhost:8000/api/invoices/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_phone": "9876543210",
    "items": [
      {"product_id": 1, "batch_number": "LOT-001", "quantity": 5, "selling_rate": 120}
    ]
  }'
```

Response will include:
- `items[0].hsn_code` = "3004" (auto-filled)
- `items[0].gst_percent` = "12.00" (auto-filled)

---

## Backward Compatibility Notes

### Products Without HSN
- `hsn` field can be null/empty
- `hsn_code` will be null in response
- `gst_rate` will be null in response
- Invoices will have empty HSN code

### Existing Invoices
- HSN code is snapshot in InvoiceItem
- Changes to product HSN don't affect existing invoices
- Empty HSN codes display as "-" in UI

---

## Testing with cURL

### List HSNs
```bash
curl http://localhost:8000/api/hsn/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Create HSN
```bash
curl -X POST http://localhost:8000/api/hsn/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hsn_code":"3004","description":"Antibiotics","gst_rate":12,"is_active":true}'
```

### Get HSN
```bash
curl http://localhost:8000/api/hsn/3004/ \
  -H "Authorization: Token YOUR_TOKEN"
```

### Update HSN
```bash
curl -X PATCH http://localhost:8000/api/hsn/3004/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gst_rate":15}'
```

### Delete HSN
```bash
curl -X DELETE http://localhost:8000/api/hsn/3004/ \
  -H "Authorization: Token YOUR_TOKEN"
```

---

**Last Updated**: January 29, 2026  
**Version**: 1.0
