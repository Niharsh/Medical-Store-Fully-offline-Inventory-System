# 🔧 QUICK TROUBLESHOOTING GUIDE

**Last Updated**: January 19, 2026

---

## Issue 1: Product Rows Still Have Inconsistent Spacing

### Symptoms
- Newly added products look taller/shorter than existing ones
- Batch expansion rows have different indentation

### Troubleshooting Steps

1. **Clear browser cache**:
   ```bash
   # Hard refresh in browser
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

2. **Verify CSS was added**:
   ```bash
   grep "\.table-row" frontend/src/index.css
   # Should output: .table-row { ... }
   ```

3. **Check that frontend is served from updated files**:
   - Stop frontend dev server (Ctrl+C)
   - Clear node_modules cache: `rm -rf node_modules/.cache`
   - Restart: `npm run dev`

4. **Verify in browser DevTools**:
   - Open DevTools (F12)
   - Inspect a product row
   - Look for CSS rules: `.table-row`, `.table-body`
   - Should show `py-4` (16px padding) on main row

---

## Issue 2: Delete Button Still Does Nothing

### Symptoms
- Click Delete button → Nothing happens
- No confirmation dialog appears
- Console shows no errors

### Troubleshooting Steps

1. **Verify Inventory.jsx was updated**:
   ```bash
   grep -n "handleDelete" frontend/src/pages/Inventory.jsx
   # Should show handleDelete function
   ```

2. **Check browser console for errors** (F12):
   - Open Console tab
   - Click Delete button
   - Look for red error messages
   - If error, read the message for clues

3. **Verify ProductContext export**:
   ```bash
   grep "deleteProduct," frontend/src/context/ProductContext.jsx
   # Should find: deleteProduct, in the exports
   ```

4. **Check that ProductList received the handler**:
   - Open DevTools (F12)
   - Click a product row
   - In Console, type: `$0` (inspected element)
   - Check the component props

5. **Restart frontend**:
   ```bash
   # In frontend directory
   npm run dev
   ```

---

## Issue 3: Invoice Creation Still Returns HTTP 400

### Symptoms
- Click "Create Invoice" → Error message appears
- Error message is generic ("Failed to create bill")
- Don't know what field is invalid

### Debugging Checklist

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Create invoice and look for logs**:
   
   **Look for this log**:
   ```
   📤 BillingForm: Sending invoice payload: {
     "customer_name": "...",
     "items": [
       { "product_id": 1, "batch_number": "LOT-001", ... }
     ]
   }
   ```

   **Verify each field**:
   - ✅ `customer_name` - string, not empty
   - ✅ `items` - array with at least 1 item
   - ✅ `product_id` - number (integer)
   - ✅ `batch_number` - string
   - ✅ `quantity` - number > 0
   - ✅ `selling_rate` - number > 0
   - ✅ `original_selling_rate` - number (copied from batch)
   - ✅ `mrp` - number (from batch)

4. **Look for error log**:
   ```
   ❌ BillingForm: Error creating invoice:
     Response data: { "items": ["...error message..."] }
     Status: 400
   ```

5. **Common Error Messages & Solutions**:

   | Error | Cause | Solution |
   |-------|-------|----------|
   | `Item 1 missing required field: product_id` | Product dropdown not selected | Click product dropdown and select a product |
   | `Item 1 missing required field: batch_number` | Batch dropdown not selected | After selecting product, select a batch |
   | `Item 1 missing required field: quantity` | Quantity field is empty | Enter a quantity (e.g., 10) |
   | `Item 1 missing required field: selling_rate` | Price field is empty | It auto-fills; if empty, manually enter the price |
   | `Item 1 selling_rate must be greater than 0` | Selling rate is 0 or negative | Verify price is correct (must be > 0) |
   | `Item 1 quantity must be greater than 0` | Quantity is 0 or negative | Verify quantity is at least 1 |
   | `references non-existent product (ID: 1)` | Product was deleted from DB | Refresh page and reselect the product |
   | `references non-existent batch: LOT-001` | Batch was deleted from DB | Refresh page and reselect the batch |
   | `insufficient quantity in batch` | Trying to sell more than available | Reduce quantity to available amount shown in batch selection |

6. **If error still unclear**:
   - Right-click error in console
   - Click "Copy" → Paste in a text file
   - Share error message with development team

---

## General Debugging Tips

### Check if Changes Were Applied

```bash
# Verify CSS changes
grep -c "\.table-row" frontend/src/index.css
# Should output: 1 (at least)

# Verify Inventory.jsx changes
grep -c "handleDelete" frontend/src/pages/Inventory.jsx
# Should output: 2 (function definition + call)

# Verify BillingForm changes
grep -c "📤 BillingForm" frontend/src/components/Billing/BillingForm.jsx
# Should output: 1
```

### Restart Everything

```bash
# Stop both frontend and backend
# (Ctrl+C in each terminal)

# Clear caches
cd frontend && rm -rf node_modules/.cache
cd backend && find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null

# Restart backend
cd backend && python manage.py runserver

# Restart frontend (new terminal)
cd frontend && npm run dev
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Create invoice
4. Find POST request to `/api/invoices/`
5. Click it and check:
   - **Request tab**: View the payload being sent
   - **Response tab**: View the error message from backend
   - **Headers tab**: Verify Content-Type is `application/json`

### Browser Console Errors

If you see errors in console:
1. Read the error message carefully
2. Note which file and line number
3. Open that file and check the code around that line
4. Verify all imports and function calls are correct

---

## When to Ask for Help

Create an issue with:
1. **Exact error message** (from console or DevTools)
2. **Screenshots** of:
   - Console logs
   - Network tab response
   - The form/button you're trying to use
3. **Steps to reproduce**:
   - Which page → Which action → What happens
4. **Expected behavior**:
   - What should happen instead

---

## Verification Commands

```bash
# Check all three fixes are in place
echo "=== CHECKING ALL FIXES ===" && \
grep -q "\.table-row" frontend/src/index.css && echo "✅ CSS: table-row found" || echo "❌ CSS: table-row NOT found" && \
grep -q "handleDelete" frontend/src/pages/Inventory.jsx && echo "✅ Handlers: handleDelete found" || echo "❌ Handlers: handleDelete NOT found" && \
grep -q "📤 BillingForm" frontend/src/components/Billing/BillingForm.jsx && echo "✅ Logging: BillingForm logging found" || echo "❌ Logging: BillingForm logging NOT found"
```

Expected output:
```
=== CHECKING ALL FIXES ===
✅ CSS: table-row found
✅ Handlers: handleDelete found
✅ Logging: BillingForm logging found
```

---

## Still Having Issues?

1. **Read FIXES_COMPREHENSIVE_GUIDE.md** for detailed explanations
2. **Check the test files** created during verification:
   - `test_issues.sh` - Diagnostic checks
   - `verify_fixes.sh` - Verification of changes

3. **Review the code changes**:
   - [frontend/src/index.css](frontend/src/index.css)
   - [frontend/src/pages/Inventory.jsx](frontend/src/pages/Inventory.jsx)
   - [frontend/src/components/Billing/BillingForm.jsx](frontend/src/components/Billing/BillingForm.jsx)

4. **Contact development team** with detailed error logs from console

---

**Last Updated**: January 19, 2026  
**Status**: ✅ All Fixes Applied and Verified
