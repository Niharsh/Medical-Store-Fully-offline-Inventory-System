# HSN Code Implementation - Quick Start Testing Guide

## ✅ Pre-Test Checklist
- [x] Backend HSN model created
- [x] Frontend HSN service created
- [x] Product form updated with HSN field
- [x] Billing form updated with HSN auto-fill
- [x] Invoice display shows HSN column
- [x] Database migration applied
- [x] API endpoints registered

## 🚀 Quick Start (5-10 minutes)

### Step 1: Start Backend Server
```bash
cd /home/niharsh/Desktop/Inventory/backend
python manage.py runserver 0.0.0.0:8000
```
✓ Should see: "Starting development server at http://0.0.0.0:8000/"

### Step 2: Start Frontend Development Server
```bash
cd /home/niharsh/Desktop/Inventory/frontend
npm start
```
✓ Should see: "Compiled successfully" and app opens at http://localhost:3000

### Step 3: Test HSN Master (Settings)

**Go to Settings page:**
1. Click "Settings & Management" in sidebar
2. Scroll to "HSN Code Management" section
3. Click "+ Add HSN Code" button

**Add First HSN Code:**
- HSN Code: `3004`
- Description: `Medicaments - Antibiotics`
- GST Rate: `12`
- Click "Add Code"

✓ Expected: HSN 3004 appears in table with 12% badge

**Add Second HSN Code:**
- HSN Code: `3003`
- Description: `Medicaments - Other`
- GST Rate: `5`
- Click "Add Code"

✓ Expected: HSN 3003 appears in table with 5% badge

### Step 4: Create Product with HSN

**Go to Products page:**
1. Click "Products" in sidebar
2. Scroll to "Step 2: Product Details"
3. Fill in:
   - Product Name: `Amoxicillin 500mg`
   - Product Type: `Tablet`
   - Generic Name: `Amoxicillin`
   - **HSN Code: Select "3004 - Medicaments - Antibiotics (12% GST)"**
4. Fill remaining fields (manufacturer, unit, description)
5. Add batch:
   - Batch Number: `LOT-2024-001`
   - MRP: `150`
   - Selling Rate: `120`
   - Cost Price: `90`
   - Quantity: `100`
   - Expiry: `31-12-2025`
6. Click "Save Product"

✓ Expected: Product created successfully, shown in product list

### Step 5: Create Invoice with HSN Auto-Fill

**Go to Billing page:**
1. Click "Billing" in sidebar
2. Fill customer details:
   - Customer Name: `Test Customer`
   - Phone: `9876543210`
3. Click "Add Item"

**Item Details:**
1. Select Product: `Amoxicillin 500mg`
   - ✓ Batch auto-fills: `LOT-2024-001`
   - ✓ Selling Rate auto-fills: `120`
   - ✓ **HSN Code auto-fills: `3004`** (read-only, gray background)
   - ✓ **GST % auto-fills: `12%`** (with "From HSN" indicator)

2. Set Quantity: `5`
3. Click "Create Invoice"

✓ Expected: Invoice created successfully

### Step 6: View Invoice with HSN

**From invoice list or invoice detail page:**
1. Click "View" on the invoice you just created
2. Scroll to items table
3. Look at columns: S.No | Qty | Product | Batch | Exp. | **HSN** | MRP | Rate | Disc% | GST% | Amount

✓ Expected: **HSN column shows "3004"**
✓ Expected: GST% shows `12`
✓ Expected: Amount includes 12% GST

**Verify Calculations:**
- Subtotal: 5 × ₹120 = ₹600
- Taxable: ₹600 (no discount)
- GST Amount: ₹600 × 12% = ₹72
  - CGST: ₹36
  - SGST: ₹36
- Total: ₹600 + ₹72 = ₹672

✓ Click "Print Invoice" to see thermal format with HSN

### Step 7: Test Backward Compatibility (No HSN)

**Create Product Without HSN:**
1. Go to Products
2. Add new product:
   - Product Name: `Generic Paracetamol 500mg`
   - Product Type: `Tablet`
   - **HSN Code: Leave blank (-- No HSN Code --)**
   - Add batch with same details as before
3. Save product

✓ Expected: Product created successfully

**Create Invoice with Non-HSN Product:**
1. Go to Billing
2. Add item with Paracetamol product
   - ✓ HSN Code field shows empty (placeholder)
   - ✓ GST % field shows empty (user must select)
3. Create invoice

✓ Expected: Invoice created, HSN shows "-" in table

## 🧪 Advanced Tests

### Test 1: Edit HSN Code
**In Settings:**
1. Click "Edit" on HSN 3004
2. Change GST Rate from 12 to 15
3. Click "Update Code"
4. Go to Products and check if new products show 15% GST

### Test 2: Edit Product HSN
**In Products:**
1. Click product "Amoxicillin 500mg"
2. Change HSN from 3004 to 3003
3. Save
4. Create new invoice with this product
5. ✓ HSN should now show 3004 (as stored in InvoiceItem at creation time)

### Test 3: Delete HSN Code
**In Settings:**
1. Try to delete HSN 3004
2. ✓ Should work (even if products reference it - backward compatible)
3. Existing invoices still show 3004 in HSN column

### Test 4: Multiple Invoices with Different HSN Codes
**Create products with different HSN:**
1. Create Product A with HSN 3004 (12% GST)
2. Create Product B with HSN 3003 (5% GST)
3. Create invoice with both products
4. ✓ Each item should show correct HSN and GST rate
5. ✓ GST calculation should be per-item, not invoice-level

### Test 5: Edit Invoice Item GST (Override)
**In Billing Form:**
1. Add product (HSN auto-fills)
2. Change GST% from auto-filled value to different value
3. Create invoice
4. ✓ Invoice shows the overridden GST%, not HSN's default

## 📋 Verification Checklist

After completing all steps, verify:

- [ ] **HSN Master Works**
  - [ ] Can create HSN codes in Settings
  - [ ] Can edit HSN codes
  - [ ] Can delete HSN codes
  - [ ] HSN list shows in table

- [ ] **Product-HSN Linking Works**
  - [ ] Product form shows HSN dropdown
  - [ ] Can select HSN when creating product
  - [ ] Can edit product and change HSN
  - [ ] Product API returns hsn_code and gst_rate

- [ ] **Billing Auto-Fill Works**
  - [ ] HSN code auto-fills in billing form
  - [ ] GST % auto-fills from HSN
  - [ ] Shows "From HSN" indicator
  - [ ] User can override if needed

- [ ] **Invoice Display Shows HSN**
  - [ ] Invoice detail shows HSN column
  - [ ] HSN column displays correct code
  - [ ] GST calculation is correct
  - [ ] Print invoice shows HSN

- [ ] **Backward Compatibility Works**
  - [ ] Products without HSN can be created
  - [ ] Invoices with non-HSN products work
  - [ ] Existing invoices display correctly
  - [ ] Empty HSN shows as "-"

- [ ] **GST Calculation Correct**
  - [ ] CGST = GST Amount ÷ 2
  - [ ] SGST = GST Amount ÷ 2
  - [ ] Total = Taxable + CGST + SGST
  - [ ] Handles multiple GST rates in single invoice

## 🔍 Debug Tips

### If HSN API returns 404:
```bash
# Check API registration
curl http://localhost:8000/api/hsn/ -H "Content-Type: application/json"

# Should return JSON list or auth error, NOT 404
```

### If HSN dropdown is empty in Product Form:
1. Check browser console for errors (F12 → Console)
2. Verify HSNs are created in database:
   ```bash
   python manage.py shell
   from inventory.models import HSN
   print(HSN.objects.all())
   ```

### If GST doesn't auto-fill in Billing:
1. Check if product has HSN linked
2. Check console for JavaScript errors
3. Verify product API returns `gst_rate` field

### If Invoice shows "null" for HSN:
1. Check if product had HSN when invoice was created
2. Verify InvoiceItem.hsn_code was populated
3. Check database: `SELECT hsn_code FROM inventory_invoiceitem WHERE id=X;`

## 📞 Support

For issues or questions:
1. Check Django logs: `tail -f /tmp/django.log`
2. Check browser console: F12 → Console
3. Review implementation summary: `HSN_IMPLEMENTATION_SUMMARY.md`
4. Check test results from: `test_hsn_flow.sh`

---

**Ready to Test!** Start with Step 1 above. 🎉
