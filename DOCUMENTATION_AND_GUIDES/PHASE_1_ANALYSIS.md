# PHASE 1: COMPREHENSIVE FULL-STACK ANALYSIS

## Executive Summary
Current system has working invoice/sales functionality but purchase bills have:
1. **NaN Issue**: amount_due becomes NaN when amount_paid=0 (JSON serializes Python's float('nan') as NaN)
2. **Dashboard Clutter**: Shows many sections instead of focused 4 cards
3. **Missing Fields**: Purchase bills lack bill_number and purchase_date
4. **No Global Search**: Cannot search products across app
5. **Data Flow Gaps**: Some fields not properly persisted/displayed

## Database Layer Analysis

### Models - Current State

**PurchaseBill** (backend/inventory/models.py, lines 340-373)
```python
- id: auto
- wholesaler: ForeignKey → Wholesaler
- total_amount: Decimal (10,2)
- amount_paid: Decimal (10,2), default=0
- amount_due: Decimal (10,2)
- payment_status: str (unpaid|partial|paid)
- notes: TextField
- created_at, updated_at: DateTime
```

**Problem in save() method**:
```python
def save(self, *args, **kwargs):
    self.amount_due = self.total_amount - self.amount_paid  # ← Always subtracts
    # Status logic correct, but amount_due still calculated even when amount_paid=0
```

**Solution**: Need to implement conditional logic:
- If `amount_paid == 0` → set `amount_due = None` or special value (CANNOT use NaN)
- Else → `amount_due = total - paid`

**SalesBill** (lines 260-290) - SAME ISSUE, needs fixing too

**Wholesaler** (lines 88-100)
- name, contact_number, gst_number
- No date fields - PurchaseBill needs created_at (has it)

### Migration Needed
- Add `bill_number` and `purchase_date` fields to PurchaseBill
- NOT auto-populated; must be form inputs

## API/Serializer Layer Analysis

### PurchaseBillSerializer (serializers.py, lines 501-512)
```python
fields: id, wholesaler, wholesaler_name, total_amount, amount_paid, amount_due, payment_status, notes, created_at, updated_at
read_only: amount_due, payment_status
```

**Issues**:
1. `amount_due` calculated in model.save() - returns actual Decimal or NaN
2. No JSON serialization fix - NaN passes through to frontend as JSON `NaN`
3. No custom `get_amount_due()` method to handle NaN conversion

**Solution**: Override `to_representation()` to replace NaN with null:
```python
def to_representation(self, instance):
    data = super().to_representation(instance)
    if math.isnan(data.get('amount_due', 0)):
        data['amount_due'] = None  # JSON-safe
    return data
```

### PurchaseBillCreateSerializer (lines 470-498)
- Correctly handles wholesaler_name → auto-create Wholesaler
- Payment creation logic working

## Frontend Layer Analysis

### PurchasesTable.jsx (lines 1-214)
```jsx
Displays: Bill #, Date, Wholesaler, Contact, Total, Paid, Due
Currently:
- bill_number: mapped from API bill.bill_number (doesn't exist!)
- date: mapped from API bill.date (doesn't exist!)
- amount_due: displayed with color based on parseFloat(bill.amount_due) > 0
```

**Issues**:
1. **Table shows undefined fields**: bill_number, date don't exist in API response
2. **NaN Display**: When amount_due is NaN, `parseFloat(NaN)` returns NaN, color broken
3. **Edit Functionality**: Can only edit amount_paid, notes (should allow these + bill fields?)

**Solution**:
1. Add bill_number and purchase_date to PurchaseBill model
2. Update serializer to include these fields
3. Update table display to show them
4. Fix NaN handling: `parseFloat(bill.amount_due) || 0` to prevent NaN comparisons

### PurchasesForm.jsx (lines 1-214)
```jsx
Currently accepts:
- wholesaler_name (required)
- contact_number (optional)
- total_amount (required)
- amount_paid (default 0)
- notes (optional)
```

**Issues**:
1. No bill_number or purchase_date fields
2. Form doesn't match what table expects to display

**Solution**: Add fields to form:
- bill_number: text input (user generates)
- purchase_date: date input (defaults to today)

### Dashboard.jsx (lines 1-486)
**Current Layout** (from reading):
```
- Stats: Total Products, Recent Invoices
- Low Stock Section: Fetches from /products/low_stock/
- Expiry Section: Fetches from /batches/expiring/
- Sales & Purchases: Two tables with form
- Period selector: month/year
```

**Required Layout** (PHASE 5):
```
- 4 Stats Cards:
  1. Total Sales (sum of SalesBill.total_amount)
  2. Total Purchases (sum of PurchaseBill.total_amount)
  3. Total Amount Paid (sum of both paid amounts)
  4. Total Amount Due (sum of both due amounts, handling NaN)
- Purchase Form below (to create new bills)
- Purchase Table below (to show all bills)
- NO low stock, NO expiry, NO sales table (keep minimal)
```

## Context Layer Analysis

### PurchaseBillsContext (context/PurchaseBillsContext.jsx)
```jsx
Methods:
- fetchPurchaseBills() ✅ Works
- fetchSummary(period) → Returns { total_purchases, total_paid, total_due, bill_count }
- createPurchaseBill() ✅ Works
- updatePurchaseBill() → PATCH only
```

**Issues**:
1. fetchSummary doesn't handle NaN values
2. No safeguard for NaN in aggregations

**Solution**:
1. Add NaN check in context summary calculation
2. Convert NaN to 0 or null before state update

### SalesBillsContext (context/SalesBillsContext.jsx) - SIMILAR PATTERN

## Calculation Rules - Current vs Required

### Current System
```
amount_due = total_amount - amount_paid  (always subtracts)
```

### Required System (STRICT RULES)
```
IF amount_paid === 0:
  amount_due = NaN  (or null/undefined - NOT displayable as number)
ELSE:
  amount_due = total_amount - amount_paid
```

**Rationale**: When no payment received, "amount due" is undefined/infinite, not calculable

## Global Search Feature (PHASE 3) - Current State

### Current Implementation
- Dashboard: Low stock search works
- PurchasesTable: Has search field but searches by "wholesaler" only (line 25: `search_fields = ['wholesaler']`)
- SalesTable: Similar limitations

### Requirements
- Single top-bar search across app
- Searches Products by: name OR salt_composition
- Case-insensitive, partial match
- Debounced to avoid excessive API calls
- Should NOT interfere with existing table searches

### Solution Path
1. Create GlobalSearch component (top bar)
2. Add API endpoint: GET /api/products/search/?q=term
3. Return: [{ id, name, salt, selling_rate, ... }]
4. Integrate into App.jsx layout
5. Handle navigation/filtering on result click

## NaN Issue - Deep Dive

### Root Cause Trace
```
1. Backend: PurchaseBill.save() calculates amount_due = total - paid (includes when paid=0)
2. Serializer: Returns amount_due as-is (Decimal, or if manually set to NaN, becomes float)
3. JSON: Encodes float('nan') as JSON NaN (valid JSON but problematic JS)
4. Frontend: Receives NaN, parseFloat(NaN) returns NaN
5. Display: NaN in UI, NaN comparisons fail, colors broken
```

### Current Code Issue

**Backend (models.py)**:
```python
def save(self, *args, **kwargs):
    self.amount_due = self.total_amount - self.amount_paid  # Always calculates
    # No conditional logic - when paid=0, amount_due=total (correct mathematically but not by biz rule)
```

**Frontend (PurchasesTable.jsx)**:
```jsx
<td className={`... ${parseFloat(bill.amount_due) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
  ₹{formatCurrency(bill.amount_due)}
</td>
// When amount_due is NaN: parseFloat(NaN) > 0 → false → green (wrong!)
// Display: "₹NaN" (broken)
```

### Correct Implementation

**Backend (models.py)**:
```python
def save(self, *args, **kwargs):
    if self.amount_paid == 0:
        self.amount_due = 0  # Or use Decimal('NaN') if using DecimalField properly
    else:
        self.amount_due = self.total_amount - self.amount_paid
    # Update status logic...
```

**Better: Serializer Override (serializers.py)**:
```python
class PurchaseBillSerializer(ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Handle NaN safely
        if isinstance(data.get('amount_due'), float):
            if math.isnan(data['amount_due']):
                data['amount_due'] = None  # JSON-safe null
        return data
```

**Frontend (PurchasesTable.jsx)**:
```jsx
const amountDue = parseFloat(bill.amount_due) || 0;  // Convert NaN/null to 0
<td className={`... ${amountDue > 0 ? 'text-orange-600' : 'text-green-600'}`}>
  ₹{formatCurrency(amountDue)}
</td>
```

## Data Flow Verification - Current Path

```
User Input (PurchasesForm)
  ↓
POST /api/purchase-bills/ {wholesaler_name, total_amount, amount_paid, ...}
  ↓
PurchaseBillCreateSerializer.create()
  ├─ Get/Create Wholesaler
  └─ Create PurchaseBill instance (triggers save())
      └─ amount_due calculated (ISSUE: may be NaN here)
  ↓
Response: PurchaseBillSerializer (serializes instance)
  └─ Includes amount_due field (ISSUE: NaN→JSON NaN)
  ↓
Frontend receives JSON
  └─ PurchasesTable renders bill.amount_due (ISSUE: displays "NaN")
```

## Summary of Issues by Priority

| Priority | Issue | Location | Type | Fix Complexity |
|----------|-------|----------|------|---|
| CRITICAL | NaN in amount_due | models.py save() | Logic | Low |
| CRITICAL | NaN JSON serialization | serializers.py | Serialization | Medium |
| CRITICAL | NaN frontend display | PurchasesTable.jsx | UI | Low |
| HIGH | Missing bill_number field | models.py, forms | Schema | High |
| HIGH | Missing purchase_date field | models.py, forms | Schema | High |
| HIGH | Dashboard shows wrong sections | Dashboard.jsx | Layout | Medium |
| MEDIUM | No global search | Throughout | Feature | High |
| MEDIUM | SalesBill has same NaN issue | models.py | Logic | Low |

## Action Items for PHASE 2-7

### PHASE 2: Fix NaN + Amounts (CRITICAL)
1. ✅ Update PurchaseBill.save() with conditional logic
2. ✅ Update SalesBill.save() with conditional logic
3. ✅ Add serializer safeguard for NaN→null
4. ✅ Update frontend display logic
5. ✅ Test with amount_paid=0 scenario

### PHASE 3: Global Search
1. Add API endpoint for product search
2. Create GlobalSearch component
3. Integrate into App.jsx
4. Test search functionality

### PHASE 4: Add bill_number + purchase_date
1. Create migration for PurchaseBill
2. Add fields to forms
3. Update table display
4. Update serializers

### PHASE 5: Dashboard 4-Card Layout
1. Simplify Dashboard.jsx
2. Keep only 4 stat cards
3. Keep purchase form + table
4. Remove low stock + expiry sections
5. Update period selector if needed

### PHASE 6: End-to-End Testing
1. Create purchase bill
2. Verify DB storage
3. Check API response
4. Confirm frontend display
5. Verify dashboard updates

### PHASE 7: Final Checks
1. Verify NaN logic
2. Check no console errors
3. Verify global search works
4. Test dashboard aggregations
5. Document findings

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| NaN in JSON breaks API | High | Critical | Add serializer check + test |
| Breaking changes to PurchaseBill | Medium | High | Test migration, data preservation |
| Dashboard breaks on simplification | Medium | Medium | Backup current, test incrementally |
| Global search conflicts with table search | Low | Medium | Use separate context/namespace |

## Testing Strategy

1. **Unit**: Backend model.save() with amount_paid=0
2. **Integration**: POST purchase bill → check DB + API response
3. **E2E**: Create → Display → Update → Verify aggregations
4. **Regression**: Check existing functionality doesn't break

