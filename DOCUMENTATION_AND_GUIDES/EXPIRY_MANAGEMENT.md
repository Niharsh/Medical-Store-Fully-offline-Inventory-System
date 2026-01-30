# Product Expiry Management System

## Overview

The Medical Store Inventory System now includes comprehensive product expiry date tracking and dashboard-based filtering. This helps the owner quickly identify products expiring soon and manage inventory efficiently.

## Features

### 1. Mandatory Expiry Date Field

**In Add/Edit Product Form:**
- `Expiry Date` field is now **required** for all products
- Date picker with today as minimum date (no past dates allowed)
- Format: YYYY-MM-DD (e.g., 2026-12-31)
- Stored in persistent local storage until backend integration

### 2. Expiry Date Display in Inventory

**Product List Table:**
- New "Expiry" column shows formatted expiry date
- Color-coded status badges:
  - 🔴 **Red** - Already expired (past date)
  - 🟠 **Orange** - Expiring within 30 days
  - 🟡 **Yellow** - Expiring within 90 days
  - 🟢 **Green** - More than 90 days left

### 3. Dashboard Expiry Overview

**New Section: "Expiry Overview"**
- Three selectable filter buttons:
  - **📆 Expiring in 6 Months** - Products with expiry date within 6 months
  - **⏰ Expiring in 3 Months** - Products with expiry date within 3 months
  - **🔴 Expiring in 1 Month** - Products with expiry date within 1 month

**Behavior:**
- Click a button to see all products expiring in that period
- Products are displayed in a table with:
  - Product Name
  - Product Type
  - Quantity
  - Expiry Date (formatted)
  - Days until expiry (e.g., "Expires in 15d")
- Click same button again to close/collapse the view
- Shows count of expiring products
- Empty state message if no products in selected range

## User Workflow

### Adding a Product with Expiry Date

1. Go to **Inventory** page
2. Click **Add New Product** form
3. Fill all required fields:
   - Product Name
   - Product Type
   - Price
   - Quantity
   - **Expiry Date** ← NEW (mandatory)
   - Optional: Generic Name, Manufacturer, Salt/Composition, Unit, Description
4. Click **Add Product**
5. Product is saved with expiry date

### Viewing Products by Expiry

1. Go to **Dashboard** page
2. Scroll to **Expiry Overview** section
3. Click one of the three buttons:
   - "Expiring in 6 Months"
   - "Expiring in 3 Months"
   - "Expiring in 1 Month"
4. View all matching products in the table below
5. Products show countdown (e.g., "Expires in 15d", "Expired")
6. Click same button again to collapse

### Monitoring Expiry in Product List

1. Go to **Inventory** page
2. Look at the **Expiry** column in the product table
3. Color-coded dates indicate urgency:
   - Green = Plenty of time
   - Yellow = Getting close (< 3 months)
   - Orange = Soon (< 1 month)
   - Red = Already expired

## Data Model

### Product with Expiry Date

```json
{
  "id": 1,
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "generic_name": "Acetylsalicylic Acid",
  "manufacturer": "Pharma Ltd",
  "price": "25.50",
  "quantity": 150,
  "unit": "pc",
  "expiry_date": "2026-12-31",
  "salt_composition": "Paracetamol 500mg",
  "description": "Pain reliever",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Backend Implementation Requirements

### Model Field

```python
class Product(models.Model):
    # ... other fields ...
    expiry_date = models.DateField(
        help_text="Expiry date of the product. Format: YYYY-MM-DD. Required for all products."
    )
    
    class Meta:
        indexes = [
            models.Index(fields=['expiry_date']),  # For efficient filtering
        ]
```

### API Validation

- `expiry_date` is required in POST/PATCH requests
- Format: `YYYY-MM-DD`
- Must be today or in the future (no past dates)
- Reject with 400 Bad Request if invalid or in the past

### API Response

All product endpoints should include `expiry_date` in the response:

```json
{
  "id": 1,
  "name": "Product Name",
  "product_type": "tablet",
  "price": "25.50",
  "quantity": 150,
  "unit": "pc",
  "expiry_date": "2026-12-31",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Frontend Components

### Modified Files

1. **AddProductForm.jsx**
   - Added `expiry_date` to form state
   - Added date input field (required, no past dates)
   - Validation includes expiry_date check

2. **ProductList.jsx**
   - Added `Expiry` column to product table
   - Color-coded status badges based on days to expiry
   - Helper functions: `formatDate()`, `daysUntilExpiry()`, `getExpiryStatusColor()`

3. **Dashboard.jsx**
   - New "Expiry Overview" section
   - Three filter buttons (6/3/1 month ranges)
   - Dynamic product listing by expiry range
   - Color-coded expiry status display

### New Utilities

**ProductList.jsx helper functions:**
- `formatDate(dateString)` - Formats date as "DD MMM YYYY" (e.g., "31 Dec 2026")
- `daysUntilExpiry(expiryDate)` - Calculates days remaining
- `getExpiryStatusColor(expiryDate)` - Returns color class for badge

**Dashboard.jsx helper functions:**
- `getExpiringProducts(monthsRange)` - Filters products by expiry range
- `handleExpiryFilter(months)` - Toggles filter selection
- `formatDate(dateString)` - Date formatting
- `getExpiryStatus(expiryDate)` - Returns expiry countdown text and color

## Data Persistence

- Frontend stores products with `expiry_date` in localStorage
- Local storage maintained until backend integration
- Upon backend connection, all products sync with server

## Offline Support

- Products cached in localStorage include expiry_date
- Expiry filtering works offline (calculations are client-side)
- Dashboard overview works without backend connection

## Error Handling

### Frontend Validation

- Prevents submission without expiry_date (required field)
- Prevents selecting past dates (date picker minimum = today)
- Shows error message if validation fails

### Backend Validation (When Implemented)

- Return 400 Bad Request if `expiry_date` missing
- Return 400 Bad Request if `expiry_date` in past
- Return 400 Bad Request if invalid date format

## Testing Checklist

- [ ] Add product with future expiry date ✓
- [ ] Product appears in inventory list with correct date
- [ ] Product row shows color-coded expiry status
- [ ] Click "Expiring in 6 months" shows matching products
- [ ] Click "Expiring in 3 months" shows matching products
- [ ] Click "Expiring in 1 month" shows matching products
- [ ] Toggle button expands/collapses product list
- [ ] Expired products show red badge
- [ ] Products within 1 month show orange badge
- [ ] Products within 3 months show yellow badge
- [ ] Products > 3 months show green badge
- [ ] Empty state message when no products in range
- [ ] Data persists after page refresh (localStorage)

## Future Enhancements

- [ ] Expiry alert notifications
- [ ] Email/SMS alerts for expiring products
- [ ] Bulk expiry date update
- [ ] Expiry date history/audit log
- [ ] Auto-remove expired products from stock
- [ ] Expiry date reports/analytics
- [ ] Batch-based expiry tracking
- [ ] Expiry date import from barcode/QR code

## API Endpoints Summary

### GET /api/products/

Returns all products with `expiry_date`:
```
GET /api/products/?expiry_date__lte=2026-06-30  # Products expiring by date
```

### POST /api/products/

Create product with expiry_date:
```json
{
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "price": "25.50",
  "quantity": 100,
  "unit": "pc",
  "expiry_date": "2026-12-31"
}
```

### PATCH /api/products/{id}/

Update product including expiry_date:
```json
{
  "expiry_date": "2027-01-31"
}
```

## Notes

- Expiry date is **mandatory** for all products (no null values)
- Date format in API: ISO 8601 (YYYY-MM-DD)
- Timezone-agnostic (dates only, no times)
- No past dates allowed
- Filtering is inclusive on both boundaries (e.g., "6 months" includes products expiring exactly 6 months from now)
