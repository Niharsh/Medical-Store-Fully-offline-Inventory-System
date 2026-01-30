# PHASE 6: END-TO-END VERIFICATION TEST GUIDE

## Quick Test Steps (15-20 minutes)

### Step 1: Start Backend and Frontend

**Terminal 1 - Backend**:
```bash
cd /home/niharsh/Desktop/Inventory/backend
source ../.venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend**:
```bash
cd /home/niharsh/Desktop/Inventory/frontend
npm run dev
```

**Terminal 3 - Browser**:
Open: http://localhost:5173 (or the frontend dev URL shown)

---

### Step 2: Test NaN Logic (Critical)

**Test: Create purchase bill with NO payment**

1. Navigate to Dashboard
2. Go to "Purchase Management" section
3. Fill form:
   - Bill Number: `PB-TEST-001`
   - Purchase Date: Today
   - Wholesaler Name: `Test Wholesaler Inc`
   - Contact Number: `9876543210`
   - Total Amount: `5000`
   - Amount Paid: `0` (IMPORTANT: Leave as 0)
   - Notes: `Test bill for NaN verification`
4. Click "Create Purchase Bill"

**Expected Result**: ✅ Bill created successfully

**Verify in Table**:
- Bill displays in "Purchase Bills" table
- Amount Due column shows: `—` (dash, not a number)
- Amount Due color is GREEN (not orange)
- No console errors

**Console Check** (F12 → Console tab):
- No errors
- Bill should log: `{id: 1, bill_number: "PB-TEST-001", ..., amount_due: null}`

---

### Step 3: Test NaN Resolution (Amount Paid > 0)

**Test: Add partial payment to same bill**

1. In "Purchase Bills" table, find the bill you just created
2. Click the "Edit" button
3. Change "Amount Paid" to: `2000`
4. Click "Save"

**Expected Result**: ✅ Payment updated successfully

**Verify**:
- Amount Due now shows: `₹3000.00` (not a dash)
- Amount Due color changed to ORANGE (payment status: partial)
- Status changed from `unpaid` to `partial`
- No console errors

**Console Check**:
- Bill should now show: `{..., amount_due: 3000, payment_status: "partial"}`

---

### Step 4: Dashboard Aggregation Test

**Navigate to Dashboard Home**

**Verify 4-Card Layout**:
1. ✅ Card 1: "Total Sales" showing ₹X.XX
2. ✅ Card 2: "Total Purchases" showing ₹X.XX (should include our test bill)
3. ✅ Card 3: "Total Amount Paid" showing combined sales + purchases paid
4. ✅ Card 4: "Total Amount Due" showing combined sales + purchases due

**Monthly vs Annually**:
1. Click "📅 Monthly" button
2. Cards should update with monthly data
3. Click "📊 Annually" button
4. Cards should update with annual data

**Verify Values**:
- Total Purchases should include ₹5000 from our test bill
- Total Amount Due should include our ₹3000 (after partial payment)
- All calculations show in real-time without page refresh

---

### Step 5: Table Display Verification

**In "Purchase Bills" table header, verify columns**:
- [ ] Bill # (column showing bill_number)
- [ ] Date (column showing purchase_date)
- [ ] Wholesaler
- [ ] Contact
- [ ] Total Amount
- [ ] Amount Paid
- [ ] Amount Due
- [ ] Action

**For test bill, verify display**:
- Bill #: `PB-TEST-001`
- Date: Today's date (formatted nicely)
- Wholesaler: `Test Wholesaler Inc`
- Contact: `9876543210`
- Total Amount: `₹5000.00`
- Amount Paid: `₹2000.00` (green text)
- Amount Due: `₹3000.00` (orange text)
- Actions: Edit, Delete buttons

---

### Step 6: Create Full Payment Bill

**Test: Create another bill with full payment**

1. Create new purchase bill:
   - Bill Number: `PB-TEST-002`
   - Purchase Date: Today
   - Wholesaler Name: `XYZ Pharma Corp`
   - Contact Number: `8765432109`
   - Total Amount: `10000`
   - Amount Paid: `10000` (FULL PAYMENT)
2. Click "Create Purchase Bill"

**Expected Result**: ✅ Bill created and immediately marked as "paid"

**Verify**:
- Amount Due shows: `₹0.00` (not a dash, because payment is full)
- Status shows: `paid` (green)
- Amount Due color is GREEN

---

### Step 7: API Response Verification

**Open Browser DevTools** (F12 → Network tab)

1. Create or edit a purchase bill
2. Look for API request: `POST /api/purchase-bills/` or `PATCH /api/purchase-bills/{id}/`
3. Click the request
4. Go to "Response" tab
5. Verify JSON structure:

```json
{
  "id": 1,
  "bill_number": "PB-TEST-001",
  "purchase_date": "2026-01-27",
  "wholesaler": 1,
  "wholesaler_name": "Test Wholesaler Inc",
  "total_amount": "5000.00",
  "amount_paid": "2000.00",
  "amount_due": 3000.00,  // Should be number, not null
  "payment_status": "partial",
  "notes": "Test bill",
  "created_at": "2026-01-27T...",
  "updated_at": "2026-01-27T..."
}
```

**For NO payment bill**:
- `"amount_due": null` (should be null, NOT a number)
- `"payment_status": "unpaid"`

---

### Step 8: Console Error Check

**Open DevTools Console** (F12 → Console tab)

**Expected**: No errors, warnings should be minimal

**Suspicious console logs**:
- ❌ "NaN is not a number"
- ❌ "Cannot read property 'toFixed' of NaN"
- ❌ "Decimal NaN serialization error"
- ❌ "Invalid date"

**Good console logs**:
- ✅ API requests completing successfully
- ✅ State updates logged
- ✅ No red errors

---

### Step 9: Form Validation Test

**Create bill with missing fields**

1. Try to submit form without "Total Amount"
2. Try to submit with negative "Amount Paid"
3. Try to submit with "Amount Paid" > "Total Amount"

**Expected**:
- ✅ Form shows validation errors
- ✅ Errors clear when you fix the field
- ✅ Bill not created if validation fails

---

### Step 10: Data Persistence Test

**Refresh page** (F5 or Cmd+R)

**Expected**:
- ✅ All purchase bills still visible
- ✅ Calculations still correct
- ✅ Dashboard cards show same values

---

## Detailed Test Scenarios

### Scenario A: NaN Display Bug (Before Fix)
**Old behavior** (would have happened before PHASE 2):
```
User: Creates bill with amount_paid=0, total=1000
Backend: Returns {"amount_due": NaN}
Frontend: Tries parseFloat(NaN) > 0
Result: ❌ Displays "₹NaN" in red (broken)
```

**New behavior** (PHASE 2 fix):
```
User: Creates bill with amount_paid=0, total=1000
Backend: Returns {"amount_due": null}
Frontend: Checks amount_due !== null, shows "—"
Result: ✅ Displays "—" in green (correct)
```

### Scenario B: Partial Payment Update
```
1. Create bill: total=5000, paid=0
   → amount_due=null ✅
2. Update: paid=2000
   → amount_due=3000 ✅
3. Update: paid=5000
   → amount_due=0, status=paid ✅
```

### Scenario C: Dashboard Aggregation
```
Bill 1: total=5000, paid=2000, due=3000 (partial)
Bill 2: total=10000, paid=10000, due=0 (paid)
Bill 3: total=3000, paid=0, due=null (unpaid with NaN logic)

Dashboard should show:
- Total Purchases: 5000 + 10000 + 3000 = 18000 ✅
- Total Paid: 2000 + 10000 + 0 = 12000 ✅
- Total Due: 3000 + 0 + 0 = 3000 ✅ (null is sanitized to 0)
```

---

## Success Criteria

| Test | Criteria | Status |
|------|----------|--------|
| NaN Logic | amount_due null when paid=0 | 🔄 Test |
| NaN Logic | amount_due calculated when paid>0 | 🔄 Test |
| Table Display | "—" shown for null amount_due | 🔄 Test |
| Table Display | Numbers shown for valid amounts | 🔄 Test |
| Dashboard | 4 cards visible and populated | 🔄 Test |
| Dashboard | Period selector works | 🔄 Test |
| Dashboard | Aggregations correct | 🔄 Test |
| Form | New fields (bill_number, date) work | 🔄 Test |
| API | Response includes new fields | 🔄 Test |
| Console | No errors present | 🔄 Test |
| Data | Persists after refresh | 🔄 Test |

---

## Troubleshooting

**If you see "₹NaN" in table**:
1. Backend serializer not converting Decimal('NaN') to null
2. Solution: Check `/backend/inventory/serializers.py` lines 475-489 (to_representation override)

**If console shows NaN errors**:
1. Frontend not checking for null before formatting
2. Solution: Check `/frontend/src/components/SalesAndPurchases/PurchasesTable.jsx` line 155-162

**If amount_due still calculating when paid=0**:
1. Backend model.save() not implementing NaN logic
2. Solution: Check `/backend/inventory/models.py` lines 342-358 (save() method)

**If dashboard shows 0 instead of actual values**:
1. Contexts not fetching fresh data
2. Solution: Click period button again or refresh browser

---

## Quick Command Reference

```bash
# Reset database (if needed - WARNING: deletes data)
cd backend
python manage.py flush

# Apply fresh migrations
python manage.py migrate

# Create test data
python manage.py shell
>>> from inventory.models import PurchaseBill, Wholesaler
>>> w = Wholesaler.objects.create(name="Test Corp", contact_number="1234567890")
>>> pb = PurchaseBill.objects.create(wholesaler=w, total_amount=5000, amount_paid=0)
>>> pb.amount_due  # Should be Decimal('NaN')

# Check API response
curl http://localhost:8000/api/purchase-bills/ | python -m json.tool
```

---

## Report Results

After running tests, document:
1. ✅ Which tests passed
2. ❌ Any tests that failed
3. 🔄 Any unexpected behaviors
4. 💡 Any edge cases discovered

All tests should pass for PHASE 6 to be marked complete.
