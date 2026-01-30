# HSN Code Implementation - Complete Summary

## 🎯 Objective
Implement full HSN (Harmonized System Nomenclature) Code management for the Medical Shop Inventory & Billing System, following the Product Type pattern and integrating with billing and GST calculations.

## ✅ Implementation Complete

### Backend Implementation

#### 1. **HSN Model** (`backend/inventory/models.py`)
```python
class HSN(models.Model):
    hsn_code = CharField(max_length=20, unique=True, primary_key=True)
    description = CharField(max_length=255, blank=True)
    gst_rate = DecimalField(max_digits=5, decimal_places=2)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Key Features:**
- HSN code is the primary key (unique identifier)
- GST rate is stored directly on HSN (no hardcoding)
- Supports all tax slabs: 0%, 5%, 12%, 18%, 28%
- is_active flag for deactivating old HSN codes
- Timestamps for audit trail

#### 2. **Product-HSN Linking** (`backend/inventory/models.py`)
```python
class Product(models.Model):
    # ... existing fields ...
    hsn = ForeignKey(HSN, on_delete=models.SET_NULL, null=True, blank=True)
```

**Key Features:**
- Products can optionally have an HSN code
- ForeignKey allows null/blank for backward compatibility
- Existing products without HSN continue to work
- New products can link to HSN during creation/edit

#### 3. **HSN Serializer** (`backend/inventory/serializers.py`)
```python
class HSNSerializer(serializers.ModelSerializer):
    class Meta:
        model = HSN
        fields = ['hsn_code', 'description', 'gst_rate', 'is_active', 'created_at', 'updated_at']
```

#### 4. **HSN ViewSet** (`backend/inventory/views.py`)
```python
class HSNViewSet(viewsets.ModelViewSet):
    queryset = HSN.objects.filter(is_active=True)
    serializer_class = HSNSerializer
    lookup_field = 'hsn_code'
    # Supports: GET /api/hsn/ (list), POST (create), GET /api/hsn/{code}/, PUT/PATCH (update), DELETE
```

**Endpoints:**
- `GET /api/hsn/` - List all active HSN codes
- `POST /api/hsn/` - Create new HSN code
- `GET /api/hsn/{hsn_code}/` - Get HSN details
- `PUT/PATCH /api/hsn/{hsn_code}/` - Update HSN
- `DELETE /api/hsn/{hsn_code}/` - Delete HSN

#### 5. **Product API Enhancement** (`backend/inventory/serializers.py`)
```python
class ProductSerializer(serializers.ModelSerializer):
    hsn_code = serializers.CharField(source='hsn.hsn_code', read_only=True, allow_null=True)
    gst_rate = serializers.DecimalField(source='hsn.gst_rate', ..., read_only=True, allow_null=True)
    # ... other fields ...
```

**Returns in Product API:**
- `hsn` - HSN code foreign key
- `hsn_code` - HSN code string (read-only, derived)
- `gst_rate` - GST rate percentage (read-only, derived from HSN)

#### 6. **Billing Integration** (`backend/inventory/serializers.py`)
```python
# In InvoiceCreateSerializer.create():
hsn_code = product.hsn.hsn_code if product.hsn else ''
gst_rate = product.hsn.gst_rate if product.hsn else Decimal('0')

InvoiceItem.objects.create(
    # ...
    hsn_code=hsn_code,  # Auto-filled from product's HSN
    gst_percent=Decimal(str(item.get('gst_percent', gst_rate))),  # Default from HSN
    # ...
)
```

**Data Flow:**
1. User creates invoice with product
2. Backend fetches product's HSN
3. HSN code and GST rate are automatically populated in InvoiceItem
4. No manual entry needed

#### 7. **Database Migration** (`backend/inventory/migrations/0011_hsn_product_hsn.py`)
- Creates HSN table
- Adds HSN foreign key to Product
- Handles backward compatibility (null=True, blank=True)

#### 8. **API Registration** (`backend/config/urls.py` and `backend/inventory/urls.py`)
```python
router.register(r'hsn', HSNViewSet, basename='hsn')
```

### Frontend Implementation

#### 1. **HSN Service** (`frontend/src/services/hsnService.js`)
```javascript
export default {
  async getAll()          // Fetch all HSN codes
  async getByCode(code)   // Get specific HSN
  async create(hsnData)   // Create new HSN
  async update(code, data)  // Update HSN
  async delete(code)      // Delete HSN
  // with localStorage caching for offline support
}
```

#### 2. **ProductContext Extension** (`frontend/src/context/ProductContext.jsx`)
```javascript
// New state:
const [hsns, setHSNs] = useState([]);

// New functions:
const fetchHSNs = async ()        // Fetch all HSN codes
const addHSN = async (hsnData)    // Create new HSN
const updateHSN = async (code, data)  // Update HSN
const deleteHSN = async (code)    // Delete HSN
```

#### 3. **HSN Manager Component** (`frontend/src/components/Product/HSNManager.jsx`)
**Features:**
- Add new HSN codes with description and GST rate
- Edit existing HSN codes
- Delete HSN codes
- Display all HSN codes in table format
- GST rate display with color highlighting
- Active/Inactive status indicator
- Helpful tips and explanations

**UI Layout:**
```
HSN Code Management
├── Add HSN Code Button
├── Add/Edit Form (in collapsible section)
│   ├── HSN Code input (disabled when editing)
│   ├── Description input
│   ├── GST Rate input (0-100)
│   └── Submit/Cancel buttons
└── HSN Codes Table
    ├── HSN Code (blue text)
    ├── Description
    ├── GST Rate (green badge)
    ├── Status (Active/Inactive)
    └── Actions (Edit/Delete buttons)
```

#### 4. **Settings Page Enhancement** (`frontend/src/pages/Settings.jsx`)
```jsx
// Added HSN Manager section alongside Product Type Manager
<div className="card">
  <HSNManager
    hsns={hsns}
    onHSNAdded={handleAddHSN}
    onHSNUpdated={handleUpdateHSN}
    onHSNDeleted={handleDeleteHSN}
    loading={loading}
  />
</div>
```

#### 5. **Product Form Enhancement** (`frontend/src/components/Product/AddProductForm.jsx`)
**New HSN Field:**
```jsx
<div>
  <label>HSN Code (for GST)</label>
  <select name="hsn" onChange={handleHSNChange}>
    <option value="">-- No HSN Code --</option>
    {hsns.map(hsn => (
      <option value={hsn.hsn_code}>
        {hsn.hsn_code} - {hsn.description} ({hsn.gst_rate}% GST)
      </option>
    ))}
  </select>
</div>
```

**Features:**
- Optional HSN selection (products can exist without HSN)
- Shows HSN code, description, and GST rate
- Pre-fills with existing HSN if editing
- Visual feedback showing selected GST rate

#### 6. **Billing Form Enhancement** (`frontend/src/components/Billing/BillingForm.jsx`)
```javascript
// When product selected:
const selectedProduct = products.find(p => p.id === product_id);
item.hsn_code = selectedProduct.hsn_code || '';  // Auto-filled
item.gst_percent = selectedProduct.gst_rate || '';  // Auto-filled
```

**Features:**
- HSN code auto-fills when product is selected
- GST rate auto-fills from product's HSN
- "From HSN" indicator shows when GST is auto-filled
- User can override GST if needed
- HSN displayed in read-only field

#### 7. **Invoice Display** (`frontend/src/components/Billing/InvoicePrint.jsx`)
**Already has HSN column:**
```jsx
<th className="thermal-col-hsn">HSN</th>
// ...
<td className="thermal-col-hsn">{item.hsn_code || '-'}</td>
```

**Invoice Print View:**
```
Items Table Columns:
S.No | Qty | Product | Batch | Exp. | HSN | MRP | Rate | Disc% | GST% | Amount
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ HSN MASTER (Settings)                                               │
├──────────────────────────────────────────────────────────────────┬──┤
│ HSN Code | Description | GST Rate | Is Active                   │  │
│ 3004     | Antibiotics | 12%      | Yes                         │  │
│ 3003     | Other Drugs | 5%       | Yes                         │  │
└──────────────────────────────────────────────────────────────────┴──┘
                              ↓
                        (ForeignKey)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PRODUCT (Add/Edit)                                                  │
├────────────────────────────────────────────────────────────────┬────┤
│ Name: Amoxicillin 500mg                                        │    │
│ Type: Tablet                                                   │    │
│ HSN: 3004 ← User selects from dropdown                         │    │
│ (GST Rate: 12% is now linked)                                 │    │
└────────────────────────────────────────────────────────────────┴────┘
                              ↓
                        (Referenced in)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ BILLING (Create Invoice)                                            │
├────────────────────────────────────────────────────────────────┬────┤
│ Product: Amoxicillin                                           │    │
│ Batch: LOT-2024-001                                            │    │
│ Qty: 5                                                         │    │
│ HSN: 3004 ← Auto-filled from Product.HSN                       │    │
│ GST%: 12% ← Auto-filled from Product.HSN.gst_rate            │    │
│ Price: ₹120                                                    │    │
└────────────────────────────────────────────────────────────────┴────┘
                              ↓
                      (Stored in)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ INVOICE ITEM                                                        │
├────────────────────────────────────────────────────────────────┬────┤
│ product_name: Amoxicillin 500mg                                │    │
│ batch_number: LOT-2024-001                                    │    │
│ hsn_code: 3004                                                 │    │
│ gst_percent: 12                                                │    │
│ quantity: 5                                                    │    │
│ selling_rate: ₹120                                            │    │
└────────────────────────────────────────────────────────────────┴────┘
                              ↓
                      (Displayed in)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ INVOICE PRINT                                                       │
├────────────────────────────────────────────────────────────────┬────┤
│ S.No | Qty | Product  | Batch      | HSN  | GST% | Amount     │    │
│ 1    | 5   | Amox...  | LOT-24-001 | 3004 | 12%  | ₹672      │    │
│      |     |          |            |      |      | (incl GST) │    │
└────────────────────────────────────────────────────────────────┴────┘
```

## 🔄 Complete Data Flow

1. **Settings → HSN Master**
   - Owner creates HSN codes (3004, 3003, etc.) with their GST rates
   - Stored in HSN table with is_active flag

2. **Product Creation/Edit**
   - Owner creates/edits product
   - Selects HSN code from dropdown
   - HSN is linked via ForeignKey

3. **Billing → Invoice**
   - User selects product in billing form
   - HSN code and GST rate are auto-fetched from product.hsn
   - Displayed in billing line items
   - Stored in InvoiceItem.hsn_code and InvoiceItem.gst_percent

4. **Invoice Display**
   - HSN column visible in invoice table
   - GST calculation uses HSN-derived rate
   - CGST/SGST split 50-50
   - Backward compatible with old invoices (empty HSN = no GST)

## 🔐 Key Features

### ✓ Data-Driven HSN
- No hardcoding of HSN codes
- No manual entry during billing
- Changes to HSN master auto-propagate to products

### ✓ Auto-Fill Capability
- HSN auto-fills when product is selected in billing
- GST rate auto-fills from HSN
- User can override if needed

### ✓ Backward Compatibility
- Products without HSN continue to work
- Empty invoices with no HSN display "-"
- GST defaults to 0 if no HSN specified
- Existing invoices unaffected

### ✓ GST Flexibility
- Per-item GST rates (not invoice-level)
- Supports all tax slabs: 0%, 5%, 12%, 18%, 28%
- Automatic CGST/SGST calculation (50-50 split)
- Item-level and invoice-level discounts

### ✓ UI/UX
- Clean HSN management in Settings
- Intuitive HSN selection in product form
- Visual feedback in billing form
- Helpful tooltips and explanations

## 🧪 Testing Verification

### Backend Tests Completed ✓
- HSN CRUD operations working
- Product-HSN linking working
- Invoice creation with HSN auto-fill
- Backward compatibility (products without HSN)
- GST calculation correct
- Multiple HSN codes with different rates

### Test Results
```
✓ HSN 3004 created (12% GST)
✓ HSN 3003 created (5% GST)
✓ Product with HSN 3004 linked
✓ Invoice Item HSN auto-filled: 3004
✓ Invoice Item GST auto-filled: 12%
✓ CGST/SGST calculated correctly
✓ Product without HSN works
✓ Invoice with non-HSN product displays empty HSN
✓ Backward compatibility maintained
```

## 📋 Files Modified/Created

### Backend
- `backend/inventory/models.py` - Added HSN model, linked to Product
- `backend/inventory/serializers.py` - Added HSNSerializer, updated ProductSerializer
- `backend/inventory/views.py` - Added HSNViewSet
- `backend/inventory/urls.py` - Registered HSN routes
- `backend/config/urls.py` - Registered HSN in main router
- `backend/inventory/migrations/0011_hsn_product_hsn.py` - Created by Django

### Frontend
- `frontend/src/services/hsnService.js` - Created HSN API service
- `frontend/src/context/ProductContext.jsx` - Added HSN state and functions
- `frontend/src/components/Product/HSNManager.jsx` - Created HSN management UI
- `frontend/src/pages/Settings.jsx` - Integrated HSN Manager
- `frontend/src/components/Product/AddProductForm.jsx` - Added HSN field
- `frontend/src/components/Billing/BillingForm.jsx` - Added HSN auto-fill

## 🚀 Usage Guide

### For Shop Owner
1. **Create HSN Codes** (Settings → HSN Management)
   - Add new HSN code (e.g., "3004")
   - Set description (e.g., "Medicaments - Antibiotics")
   - Set GST rate (e.g., "12%")
   - Click "Add Code"

2. **Create/Edit Products** (Products → Add/Edit)
   - Fill product details
   - Select HSN Code from dropdown
   - System shows "GST will apply XX% during billing"
   - Save product

3. **Create Invoice** (Billing → New Invoice)
   - Select product
   - HSN code auto-fills in billing line
   - GST rate auto-fills (shown in green)
   - Can override if needed
   - Continue with billing process

4. **View Invoice**
   - HSN column visible in invoice table
   - GST calculated from HSN rate
   - Print shows HSN for tax compliance

### For Developers
- HSN API: `GET /api/hsn/`, `POST /api/hsn/`, `PUT /api/hsn/{code}/`
- Product API: Returns `hsn_code` and `gst_rate` fields
- Billing API: HSN auto-filled in InvoiceItem during invoice creation
- All endpoints follow REST conventions

## 🎓 Important Notes

### Design Decisions
1. **HSN as Primary Key**: Makes HSN unique and prevents duplicates
2. **GST on HSN, not Product**: Changes to HSN GST rate apply to all products
3. **Auto-Fill in Billing**: Reduces data entry errors and improves speed
4. **Backward Compatible**: Existing products/invoices unaffected
5. **Per-Item GST**: Supports multiple tax rates in single invoice

### Constraints Met ✓
- ❌ No hardcoded GST rates
- ❌ No manual HSN entry during billing
- ❌ No breaking changes to existing invoices
- ❌ Billing workflow unchanged

## 📊 Invoice Example

```
TAX INVOICE

Invoice No: 2025-001            Date: 29-Jan-2026

┌────┬─────┬──────────────┬──────────┬──────┬─────┬─────┬────────┬──────┬────────┬──────────┐
│ SN │ Qty │ Product      │ Batch    │ Exp  │HSN  │ MRP │ Rate   │Disc%│ GST%  │ Amount   │
├────┼─────┼──────────────┼──────────┼──────┼─────┼─────┼────────┼──────┼────────┼──────────┤
│ 1  │  5  │ Amoxicillin  │LOT-24-001│25-12 │3004 │ 150 │ 120.00 │ 0   │ 12    │ 672.00   │
│ 2  │ 10  │ Paracetamol  │LOT-24-002│25-12 │3003 │  50 │  40.00 │ 0   │  5    │ 420.00   │
└────┴─────┴──────────────┴──────────┴──────┴─────┴─────┴────────┴──────┴────────┴──────────┘

Subtotal:                                                                     1092.00
Discount (0%):                                                                  0.00
───────────────────────────────────────────────────────────────────────────────────
Taxable Amount:                                                               1092.00

CGST (12% on 600 + 5% on 400):                                                 90.00
SGST (12% on 600 + 5% on 400):                                                 90.00
───────────────────────────────────────────────────────────────────────────────────
GRAND TOTAL:                                                                  1272.00

Amount In Words: One Thousand Two Hundred Seventy Two Rupees Only

Thank You! Please Visit Again
```

## ✨ Future Enhancements (Optional)

1. **HSN Categories**: Group HSN codes by category
2. **Tax Slab Defaults**: Pre-configured standard HSN codes
3. **HSN Validation**: Validate HSN codes against actual classification
4. **Bulk Operations**: Import HSN codes from CSV
5. **Analytics**: Track GST collection by HSN code
6. **Tax Reports**: Generate tax reports by HSN slab

---

**Status**: ✅ COMPLETE AND TESTED  
**Last Updated**: January 29, 2026  
**Version**: 1.0
