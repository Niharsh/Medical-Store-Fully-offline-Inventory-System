# 🖨️ QUICK PRINT TEST GUIDE

## 3-Minute Test to Verify Print Fix

### Step 1: Start App (30 seconds)
```bash
cd /home/niharsh/Desktop/Inventory/frontend
npm run dev
```
✓ Wait for: "Local: http://localhost:5173"

### Step 2: Open Invoice (30 seconds)
Open browser → `http://localhost:5173/billing/invoices/1`
(Replace `1` with any valid invoice ID)

✓ You should see: Screen invoice with data, "🖨 Print Invoice" button

### Step 3: Click Print (30 seconds)
Click "🖨 Print Invoice" button

✓ Browser print dialog opens

### Step 4: Verify Print Preview (60 seconds)
In print preview, scroll down and verify you see ALL of:

**✅ REQUIRED SECTIONS:**
- [ ] Shop name at top (bold, centered)
- [ ] Shop address, phone, DL#, GSTIN
- [ ] "TAX INVOICE" header (centered)
- [ ] Invoice number & date
- [ ] "Bill To:" with customer name
- [ ] **ITEM TABLE** with ALL columns:
  - S.No, Product, Batch, Expiry, HSN, Qty, MRP, Rate, Amount
- [ ] Subtotal, Discount, Taxable, CGST, SGST, Grand Total
- [ ] "In Words:" amount (e.g., "One Thousand...")
- [ ] Footer: terms & signature areas
- [ ] "Thank you for your business"

**If all ✅ above are visible → FIX IS WORKING!**

---

## What NOT to See

❌ **NOT a passing test if you see:**
- Blank page
- Only header visible, no table
- Screen UI (buttons, back link, etc)
- Only partial invoice

---

## If Print is Still Blank

### Debug in DevTools (2 minutes)

1. **Press F12** → DevTools opens
2. **Press Ctrl+Shift+M** → Print preview mode in DevTools
3. **Press Ctrl+F** → Find input opens
4. **Type**: `.invoice-print`
5. **Press Enter** → Should highlight element

If element is found ✓ but still blank:
- Right-click on it → "Inspect"
- Look at **Styles panel**
- Should show: `display: block !important`
- Should show: `visibility: visible !important`

If element NOT found ✗:
- Data fetch failed
- Check screen invoice - if blank, backend issue
- Check Network tab → `/api/invoices/1/` 
- Should return 200 with invoice data

---

## Quick Fixes (Try These First)

### Fix 1: Hard Refresh
- Chrome: **Ctrl+Shift+R**
- Firefox: **Ctrl+Shift+R**
- Safari: **Cmd+Shift+R**

### Fix 2: Rebuild
```bash
cd /home/niharsh/Desktop/Inventory/frontend
npm run build
npm run dev
```

### Fix 3: Clear Browser Cache
- Chrome: Settings → Privacy → Clear Browsing Data
- Firefox: History → Clear Recent History
- Safari: Develop → Empty Web Storage

---

## Save as PDF Test

1. In print preview
2. Click "Save as PDF"
3. Open saved PDF
4. Verify all content is there

✓ If PDF has full invoice → Print CSS working correctly!

---

## Test Checklist

| Item | Status | Notes |
|------|--------|-------|
| Dev server running | [ ] | npm run dev started |
| Browser opened | [ ] | http://localhost:5173 |
| Invoice page loaded | [ ] | /billing/invoices/{id} |
| Screen shows invoice | [ ] | Can see customer, items, total |
| Print button clicked | [ ] | Browser print dialog appeared |
| Print preview shows: | | |
| - Shop header | [ ] | Name, address, phone, DL, GSTIN |
| - Invoice header | [ ] | TAX INVOICE, number, date |
| - Customer | [ ] | Bill To, name, phone, GSTIN |
| - Item table | [ ] | All 9 columns with data |
| - Tax summary | [ ] | Subtotal to Grand Total |
| - Amount words | [ ] | "Rupees X Paise Only" |
| - Footer | [ ] | Terms, signatures |
| PDF save works | [ ] | Can save to PDF |
| No errors in console | [ ] | DevTools clean |

---

## Common Scenarios

### ✅ Scenario 1: All Content Shows
**Status**: SUCCESS! Print is working! 🎉
- All sections visible
- All columns in table
- Proper spacing
- No overlaps

**Action**: Continue testing with more invoices, test PDF, done!

### ❌ Scenario 2: Blank Print
**Status**: CSS issue not fully fixed
- Check CSS was updated: `body > *` in line 21
- Check build: `npm run build` passed
- Clear cache and reload

### ⚠️ Scenario 3: Partial Content (Header only)
**Status**: Likely table display issue
- Check table has data: Screen should show items
- Check DevTools: `display: table !important` applied
- Verify `table-row` and `table-cell` properties exist

### ⚠️ Scenario 4: Screen UI Shows in Print
**Status**: @media screen rule not working
- Check: `@media screen { .invoice-print { display: none } }`
- Verify print and screen rules don't conflict
- Clear cache and rebuild

---

## Expected Output (Reference)

```
╔══════════════════════════════════════╗
║    MEDICAL STORE NAME (Shop)         ║
║    Address: Pharmacy Loc             ║
║    Phone: +91-XXXXXXXXX0             ║
║    DL No: DL-XXXXXXXXXXXXX           ║
║    GSTIN: 27XXXXXXXXXXXXXXX          ║
╠══════════════════════════════════════╣
║         TAX INVOICE                  ║
║  Invoice No: 1                       ║
║  Date: 26/01/2024                    ║
╠══════════════════════════════════════╣
║ Bill To:                             ║
║ Customer Name                        ║
║ Phone: +91-XXXXXXXXX0                ║
║ GSTIN: 27XXXXXXXXXXXXXXX             ║
╠══════════════════════════════════════╣
║ S│Product │Batch│Exp│HSN│Qty│MRP│Rate│Amt
║ 1│Aspirin │B123 │01│123│  1│100│ 50│ 50
║ 2│Parace  │B124 │02│124│  2│200│150│300
╠══════════════════════════════════════╣
║ Subtotal:        350.00              ║
║ Discount:         50.00 (red)        ║
║ Taxable:         300.00              ║
║ CGST (9%):        27.00              ║
║ SGST (9%):        27.00              ║
║ Grand Total:     354.00 (bold)       ║
╠══════════════════════════════════════╣
║ In Words: Three Hundred Fifty Four   ║
║ Rupees Only                          ║
╠══════════════════════════════════════╣
║ • Goods once sold cannot be          ║
║   taken back or exchanged.           ║
║ • Please check before leaving.       ║
║                                      ║
║ For Medical Store    Customer        ║
║ _______________      __________      ║
║ Authorized Signatory Signature      ║
║                                      ║
║ Thank you for your business!         ║
║ Visit again soon.                    ║
╚══════════════════════════════════════╝
```

---

## Need Help?

### Check Documentation
- 📄 PRINT_FIX_DIAGNOSTIC.md - Detailed diagnostic guide
- 📄 PRINT_PREVIEW_FIX_SUMMARY.md - Complete technical summary

### Verify Fix Was Applied
```bash
grep "body >" /home/niharsh/Desktop/Inventory/frontend/src/components/Billing/InvoicePrint.css
# Should return: body > * { display: none !important; }
```

### Run Verification Script
```bash
/home/niharsh/Desktop/Inventory/verify_print_fix.sh
# Should show all checks PASSED
```

---

## Summary

✅ CSS fix applied
✅ Build passes  
✅ Architecture correct
✅ Ready for testing

**Time to verify**: 3 minutes
**Expected result**: Print preview shows complete medical invoice
**Status**: 🟢 READY
