#!/bin/bash
echo "=== ISSUE 1: Check if table-row/table-body CSS is defined ==="
grep -n "\.table-row\|\.table-body\|\.table-header" frontend/src/index.css || echo "❌ NO TABLE STYLES DEFINED"

echo ""
echo "=== ISSUE 2: Check ProductList spacing in rendered row ==="
grep -A2 "className=\"table-row\"" frontend/src/components/Product/ProductList.jsx | head -5

echo ""
echo "=== ISSUE 3: Check batch expansion row spacing ==="
grep -B2 -A1 "Batch Details Row" frontend/src/components/Product/ProductList.jsx | grep "colSpan\|className"

echo ""
echo "=== ISSUE 4: Check Edit/Delete handlers in Inventory.jsx ==="
grep "ProductList\|onEdit\|onDelete" frontend/src/pages/Inventory.jsx

echo ""
echo "=== ISSUE 5: Check InvoiceContext error handling ==="
grep -A2 "catch (err)" frontend/src/context/InvoiceContext.jsx | grep "setError"

echo ""
echo "=== ISSUE 6: Check medicineService invoice create method ==="
grep -A10 "create.*invoice\|invoiceService.create" frontend/src/services/medicineService.js
