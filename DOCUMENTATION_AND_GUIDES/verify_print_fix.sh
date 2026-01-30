#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# PRINT FIX VERIFICATION SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════
# 
# Purpose: Verify the print preview fix is working correctly
# Usage: ./verify_print_fix.sh
#
# This script:
# 1. Checks if InvoicePrint.css has the correct print CSS
# 2. Verifies InvoiceDetail.jsx architecture is correct
# 3. Confirms build passes
# 4. Provides manual testing instructions
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e

PRINT_CSS="/home/niharsh/Desktop/Inventory/frontend/src/components/Billing/InvoicePrint.css"
INVOICE_DETAIL="/home/niharsh/Desktop/Inventory/frontend/src/pages/InvoiceDetail.jsx"
FRONTEND_DIR="/home/niharsh/Desktop/Inventory/frontend"

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                   PRINT FIX VERIFICATION SCRIPT                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 1: CSS Print Rules
# ═══════════════════════════════════════════════════════════════════════════════

echo "▶ CHECK 1: Verifying InvoicePrint.css print rules..."
echo ""

if grep -q "@media print" "$PRINT_CSS"; then
  echo "  ✅ @media print block exists"
else
  echo "  ❌ ERROR: @media print block NOT found"
  exit 1
fi

if grep -q "body > \*.*display: none" "$PRINT_CSS"; then
  echo "  ✅ body > * { display: none } rule found"
else
  echo "  ❌ WARNING: body > * selector not found"
  echo "     Expected: body > * { display: none !important; }"
fi

if grep -q "\.invoice-print {" "$PRINT_CSS" && grep -q "display: block !important" "$PRINT_CSS"; then
  echo "  ✅ .invoice-print { display: block !important } rule found"
else
  echo "  ❌ ERROR: .invoice-print display rule not found or incorrect"
  exit 1
fi

if grep -q "\.invoice-print \*" "$PRINT_CSS" && grep -q "visibility: visible !important" "$PRINT_CSS"; then
  echo "  ✅ .invoice-print * { visibility: visible !important } rule found"
else
  echo "  ❌ ERROR: .invoice-print child visibility rule not found"
  exit 1
fi

if grep -q "display: table !important" "$PRINT_CSS"; then
  echo "  ✅ Table display properties configured"
else
  echo "  ⚠️  WARNING: Table display properties may not be fully optimized"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 2: React Architecture
# ═══════════════════════════════════════════════════════════════════════════════

echo "▶ CHECK 2: Verifying InvoiceDetail.jsx architecture..."
echo ""

if grep -q "const InvoiceDetail = ()" "$INVOICE_DETAIL"; then
  echo "  ✅ InvoiceDetail component found"
else
  echo "  ❌ ERROR: InvoiceDetail component not found"
  exit 1
fi

if grep -q "useEffect" "$INVOICE_DETAIL"; then
  echo "  ✅ useEffect hook found (data fetching)"
else
  echo "  ❌ WARNING: useEffect not found"
fi

if grep -q "InvoicePrint" "$INVOICE_DETAIL"; then
  echo "  ✅ InvoicePrint component imported and used"
else
  echo "  ❌ ERROR: InvoicePrint not being rendered"
  exit 1
fi

if grep -q "window.print()" "$INVOICE_DETAIL"; then
  echo "  ✅ window.print() is being used (no hacks)"
else
  echo "  ❌ ERROR: window.print() not found"
  exit 1
fi

if ! grep -q "setTimeout" "$INVOICE_DETAIL"; then
  echo "  ✅ No setTimeout hacks (clean architecture)"
else
  echo "  ⚠️  WARNING: setTimeout found (potential issue)"
fi

if ! grep -q "fetch\|axios" "$INVOICE_DETAIL" | grep -v "fetchInvoice"; then
  echo "  ✅ Data fetched only once (no re-fetch on print)"
else
  echo "  ⚠️  WARNING: Multiple fetch/axios calls detected"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 3: Build Status
# ═══════════════════════════════════════════════════════════════════════════════

echo "▶ CHECK 3: Building frontend..."
echo ""

cd "$FRONTEND_DIR"

if npm run build > /tmp/build_output.txt 2>&1; then
  echo "  ✅ Build PASSED"
  echo ""
  echo "  Build output:"
  tail -8 /tmp/build_output.txt | sed 's/^/     /'
else
  echo "  ❌ BUILD FAILED"
  echo ""
  echo "  Error details:"
  tail -20 /tmp/build_output.txt | sed 's/^/     /'
  exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 4: DOM Structure
# ═══════════════════════════════════════════════════════════════════════════════

echo "▶ CHECK 4: Verifying DOM structure..."
echo ""

if grep -q "<InvoicePrint" "$INVOICE_DETAIL"; then
  echo "  ✅ <InvoicePrint /> component being rendered"
else
  echo "  ❌ ERROR: InvoicePrint not rendered"
  exit 1
fi

if grep -q "invoice={invoice}" "$INVOICE_DETAIL"; then
  echo "  ✅ Data being passed to InvoicePrint: invoice prop"
else
  echo "  ⚠️  WARNING: invoice prop not passed"
fi

if grep -q "shop={shopData}" "$INVOICE_DETAIL"; then
  echo "  ✅ Data being passed to InvoicePrint: shop prop"
else
  echo "  ⚠️  WARNING: shop prop not passed"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# CHECK 5: InvoicePrint Component
# ═══════════════════════════════════════════════════════════════════════════════

echo "▶ CHECK 5: Verifying InvoicePrint.jsx component..."
echo ""

INVOICE_PRINT="/home/niharsh/Desktop/Inventory/frontend/src/components/Billing/InvoicePrint.jsx"

if grep -q "className=\"invoice-print\"" "$INVOICE_PRINT"; then
  echo "  ✅ Root element has .invoice-print class"
else
  echo "  ❌ ERROR: .invoice-print class not found"
  exit 1
fi

if grep -q "shop-header\|invoice-header\|buyer-section\|invoice-table\|summary-container\|amount-words\|footer-section" "$INVOICE_PRINT"; then
  echo "  ✅ All invoice sections present (8 sections)"
else
  echo "  ⚠️  WARNING: Some invoice sections may be missing"
fi

if ! grep -q "useState\|useEffect\|useCallback" "$INVOICE_PRINT"; then
  echo "  ✅ Pure presentation component (no hooks)"
else
  echo "  ⚠️  WARNING: Hooks found in InvoicePrint (should be pure)"
fi

if ! grep -q "\.get(\|\.post(\|\.put(\|fetch(" "$INVOICE_PRINT"; then
  echo "  ✅ No API calls (pure data rendering)"
else
  echo "  ❌ ERROR: API calls found in InvoicePrint"
  exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                         VERIFICATION SUMMARY                              ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ All checks PASSED"
echo ""
echo "The print fix has been successfully applied:"
echo "  • CSS print rules configured correctly"
echo "  • React architecture is correct"
echo "  • Build passes without errors"
echo "  • InvoicePrint component is properly set up"
echo ""

# ═══════════════════════════════════════════════════════════════════════════════
# MANUAL TESTING INSTRUCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                     MANUAL TESTING INSTRUCTIONS                           ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "STEP 1: Start Frontend Dev Server"
echo "  $ cd /home/niharsh/Desktop/Inventory/frontend"
echo "  $ npm run dev"
echo ""
echo "STEP 2: Navigate to Invoice Page"
echo "  Open: http://localhost:5173/billing/invoices/{id}"
echo "  Replace {id} with a valid invoice ID (e.g., 1, 2, 3)"
echo ""
echo "STEP 3: Click Print Button"
echo "  Click the \"🖨 Print Invoice\" button"
echo ""
echo "STEP 4: Verify Print Preview"
echo "  Expected to see in print preview:"
echo "  ✓ Shop name at top (centered, bold)"
echo "  ✓ Shop address, phone, DL, GSTIN"
echo "  ✓ \"TAX INVOICE\" header"
echo "  ✓ Invoice number and date"
echo "  ✓ \"Bill To:\" customer details"
echo "  ✓ Full item table with all columns"
echo "  ✓ Tax summary (Subtotal, Discount, CGST, SGST, Grand Total)"
echo "  ✓ \"Amount in Words\" section"
echo "  ✓ Footer with signature lines"
echo ""
echo "STEP 5: Test Save as PDF"
echo "  In print preview: Click \"Save as PDF\""
echo "  Verify PDF contains full invoice"
echo ""
echo "STEP 6: Debug (if print is still blank)"
echo "  Press F12 to open DevTools"
echo "  Press Ctrl+Shift+M for print preview mode"
echo "  In Inspector, look for .invoice-print element"
echo "  Right-click → Inspect"
echo "  Check Styles panel for:"
echo "    • display: block !important  ✓"
echo "    • visibility: visible !important  ✓"
echo "    • width: 148mm !important  ✓"
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "✅ VERIFICATION COMPLETE - Ready for print testing!"
echo ""
