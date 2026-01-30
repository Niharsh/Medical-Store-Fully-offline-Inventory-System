# Autocomplete Search - Testing & Verification

## Quick Start Testing (2 minutes)

### 1. Load Page
```bash
# Terminal 1: Start backend
cd backend
python manage.py runserver

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 2. Navigate to Inventory
- Open: http://localhost:5173
- Click: "Inventory" or "Products" menu
- Verify: ProductAutocomplete component renders (search bar visible)

### 3. Test Basic Typing
```
Action: Click search input, type "a"
Expected:
  ✓ Dropdown appears below input
  ✓ Shows products containing "a" (Aspirin, Amlodipine, etc.)
  ✓ Input shows "a" (no clearing)
  ✓ No page refresh or flicker
  ✓ No console errors
Result: PASS or FAIL?
```

### 4. Test Narrowing Search
```
Action: Continue typing "s" (input is now "as")
Expected:
  ✓ Dropdown narrows to products containing "as"
  ✓ Fewer results than before
  ✓ Input shows "as"
  ✓ Instant update (no waiting)
Result: PASS or FAIL?
```

### 5. Test Selection
```
Action: Use arrow keys to highlight "Aspirin 500mg", press Enter
OR: Click directly on "Aspirin 500mg"
Expected:
  ✓ Edit dialog opens for Aspirin
  ✓ Dropdown closes
  ✓ No page refresh before dialog
  ✓ Dialog shows product details
Result: PASS or FAIL?
```

---

## Detailed Test Cases

### TEST 1: Input Stability
```
Test Name: Input should never auto-clear
Start: Fresh Inventory page
Steps:
  1. Type "asp"
  2. Wait 5 seconds (don't type)
  3. Type "irin" (input now shows "aspirin")
  4. Wait 5 seconds
Expected:
  ✓ Input always shows what user typed
  ✓ NO auto-clearing
  ✓ NO unexpected resets
  ✓ NO page refresh
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 2: Dropdown Visibility
```
Test Name: Dropdown should only show when needed
Start: Fresh Inventory page
Steps:
  1. Click input (empty)
     → Dropdown should NOT appear
  2. Type "a"
     → Dropdown SHOULD appear
  3. Press Escape
     → Dropdown SHOULD close (input keeps "a")
  4. Type more letters "as"
     → Dropdown SHOULD reappear (narrower results)
Expected:
  ✓ Dropdown hidden when input empty
  ✓ Dropdown shown when input has text
  ✓ Dropdown closed on Escape
  ✓ Input preserved after closing
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 3: Case Insensitivity
```
Test Name: Search should be case-insensitive
Start: Fresh Inventory page
Steps:
  1. Type "ASPIRIN" (all caps)
     → Should find "aspirin", "Aspirin", "ASPIRIN"
  2. Type "aMlOdIpInE" (mixed case)
     → Should find "amlodipine", "Amlodipine", "AMLODIPINE"
Expected:
  ✓ ALL variations found
  ✓ Case doesn't matter
  ✓ Results consistent
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 4: No Page Refresh
```
Test Name: Typing should NOT refresh page
Start: Fresh Inventory page
Browser Tools: Open DevTools → Network tab
Steps:
  1. Type "a"
  2. Type "sp" (total: "asp")
  3. Type "irin" (total: "aspirin")
Expected Network Tab:
  ✓ 0 GET /api/products/?search=* requests
  ✓ NO page reload (check for document requests)
  ✓ NO flicker or white screen
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 5: Keyboard Navigation
```
Test Name: Arrow keys should navigate dropdown
Start: Fresh Inventory page
Steps:
  1. Type "a" (dropdown shows 50 results)
  2. Press arrow DOWN
     → First item should highlight (blue background)
  3. Press arrow DOWN again
     → Second item should highlight
  4. Press arrow UP
     → First item should highlight again
  5. Press Enter
     → First item should be selected
Expected:
  ✓ Arrow keys highlight suggestions
  ✓ Highlighting visible (color change)
  ✓ Enter selects highlighted item
  ✓ Edit dialog opens for selected product
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 6: Escape Key
```
Test Name: Escape should close dropdown without selecting
Start: Type "asp" (dropdown shows 2 results)
Steps:
  1. Press Escape key
Expected:
  ✓ Dropdown closes
  ✓ Input still shows "asp"
  ✓ Edit dialog does NOT open
  ✓ Page stays on Inventory page
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 7: Click Outside
```
Test Name: Clicking outside dropdown should close it
Start: Type "a" (dropdown shows results)
Steps:
  1. Click on table area (below dropdown)
Expected:
  ✓ Dropdown closes
  ✓ Input still shows "a"
  ✓ Edit dialog does NOT open
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 8: Clear Button
```
Test Name: Clear button should clear input completely
Start: Type "aspirin 500mg"
Steps:
  1. Click "✕ Clear" button
Expected:
  ✓ Input becomes empty
  ✓ Dropdown closes
  ✓ suggestions = []
  ✓ Page shows all products (table visible)
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 9: Direct Click Selection
```
Test Name: Clicking product in dropdown should select it
Start: Type "asp" (dropdown shows results)
Steps:
  1. Click on "Aspirin 500mg" in dropdown
Expected:
  ✓ Product selected
  ✓ Dropdown closes
  ✓ Edit dialog opens for Aspirin
  ✓ Product details loaded
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 10: No Results Message
```
Test Name: Show message when no products match
Start: Fresh Inventory page
Steps:
  1. Type "zzzzzzzzzzz" (no products with this)
Expected:
  ✓ Dropdown appears
  ✓ Shows message: 'No products found matching "zzzzzzzzzzz"'
  ✓ Input keeps the text "zzzzzzzzzzz"
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 11: Generic Name Search
```
Test Name: Should find products by generic name
Start: Fresh Inventory page
Steps:
  1. Type "acetylsalicylic" (generic name for Aspirin)
Expected:
  ✓ Finds "Aspirin 500mg" (because generic name contains this)
  ✓ Shows in dropdown
  ✓ Can select it
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 12: Manufacturer Search
```
Test Name: Should find products by manufacturer
Start: Fresh Inventory page
Steps:
  1. Type manufacturer name (e.g., "cipla" or "glaxo")
Expected:
  ✓ Finds all products from that manufacturer
  ✓ Shows in dropdown
  ✓ Can select them
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 13: Mobile Responsiveness
```
Test Name: Should work on mobile devices
Start: Open DevTools → toggle device toolbar → iPhone SE
Steps:
  1. Type "a"
  2. See dropdown
  3. Tap product
Expected:
  ✓ Input works on touch
  ✓ Dropdown visible (no cutoff)
  ✓ Dropdown scrollable if 50+ results
  ✓ Selection works
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 14: Edit Then Search Again
```
Test Name: After editing product, search should still work
Start: Fresh Inventory page
Steps:
  1. Search and select "Aspirin 500mg"
  2. Edit dialog opens, close it (click X or outside)
  3. Search input should still be there
  4. Type "p" (search for different product)
Expected:
  ✓ Edit dialog closes
  ✓ Back to Inventory page
  ✓ Search input still works
  ✓ New search works fine
Result: ✓ PASS | ❌ FAIL
Reason:
```

### TEST 15: Special Characters
```
Test Name: Should handle special characters in product names
Start: Fresh Inventory page
Steps:
  1. If products have special chars, search for them
     e.g., type "+" or "-" or "&"
Expected:
  ✓ Finds products with special chars
  ✓ No JavaScript errors
  ✓ Results accurate
Result: ✓ PASS | ❌ FAIL
Reason:
```

---

## Console Verification

### Browser DevTools Console

**Expected Logs:**
```javascript
✅ When page loads:
   (No logs, or minimal logs)

✅ When typing "a":
   (No logs, or just state updates)

✅ When selecting product:
   "Product selected from autocomplete: Aspirin 500mg"
```

**Unexpected (ERRORS):**
```javascript
❌ TypeError: Cannot read property 'map' of undefined
❌ Uncaught ReferenceError: fetchProducts is not defined
❌ Form submission detected
❌ Infinite loop warning
```

**Check for these errors:**
```bash
# Open DevTools Console (F12)
# Look for red errors:
#  - Should see: NOTHING or just React warnings
#  - Should NOT see: Exceptions, TypeError, ReferenceError

# Type in search:
#  - Console should stay empty
#  - NO repeated logs
#  - NO warnings about dependencies
```

---

## Network Tab Verification

### Using Browser DevTools Network Tab

**Steps:**
1. Open DevTools (F12)
2. Click "Network" tab
3. Clear network log (click trash icon)
4. Go to Inventory page
5. Type "a" in search

**Expected:**
```
Network Requests During Typing:
  ✓ Only 1 request visible: GET /api/products/?limit=1000
  ✓ No additional requests while typing
  ✓ No form submissions
  ✓ No 404 errors
```

**Unexpected:**
```
❌ Multiple GET /api/products/?search=a|as|asp requests
❌ Form submission POST request
❌ 500 errors from server
❌ 100+ requests in 10 seconds
```

---

## Performance Metrics

### Using Lighthouse (Chrome DevTools)

**Steps:**
1. Go to Inventory page
2. Open DevTools (F12)
3. Click "Lighthouse" tab
4. Click "Analyze page load"

**Expected:**
```
Performance: 90-100
  ✓ No blocking requests
  ✓ Fast First Contentful Paint (FCP)
  ✓ Good Largest Contentful Paint (LCP)

Accessibility: 90-100
  ✓ Input has label
  ✓ Dropdown items have focus states
  ✓ Keyboard navigation works

Best Practices: 90-100
  ✓ No console errors
  ✓ No third-party scripts
```

---

## Edge Cases to Test

### Edge Case 1: Rapid Typing
```
Action: Type very fast (spam keys)
Expected:
  ✓ All keystrokes registered
  ✓ Input shows complete text
  ✓ No dropped characters
  ✓ Dropdown catches up
Result: ✓ PASS | ❌ FAIL
```

### Edge Case 2: Copy-Paste
```
Action: Copy "Aspirin 500mg" and paste into search
Expected:
  ✓ Input accepts pasted text
  ✓ Dropdown shows matching products
  ✓ No errors
Result: ✓ PASS | ❌ FAIL
```

### Edge Case 3: Long Product Names
```
Action: Search for product with very long name
Expected:
  ✓ Dropdown displays correctly
  ✓ Text truncated or wrapped (no overflow)
  ✓ Product selectable
Result: ✓ PASS | ❌ FAIL
```

### Edge Case 4: Unicode/Special Languages
```
Action: If database has Hindi/Arabic/Chinese names, search for them
Expected:
  ✓ Search works for these languages
  ✓ Results accurate
  ✓ No encoding issues
Result: ✓ PASS | ❌ FAIL
```

### Edge Case 5: Browser Back Button
```
Action: Search product, open edit dialog, click browser back
Expected:
  ✓ Go back to Inventory page
  ✓ Search input preserved (if possible)
  ✓ No errors
Result: ✓ PASS | ❌ FAIL
```

---

## Regression Testing

### Ensure Old Features Still Work

| Feature | Test | Expected | Pass |
|---------|------|----------|------|
| **View Products** | Load Inventory page | Products table shows | ✓ |
| **Edit Product** | Click Edit button | Edit dialog opens | ✓ |
| **Delete Product** | Click Delete button | Confirmation appears | ✓ |
| **View Batches** | Click expand batches | Batch details show | ✓ |
| **Add Product** | Click Add Product | Add dialog opens | ✓ |
| **Total Quantity** | Check total qty column | Values displayed | ✓ |
| **MRP Range** | Check MRP column | Min-Max shown | ✓ |
| **Product Type** | Check type column | Type displayed | ✓ |

---

## Performance Baseline

### Before vs After Comparison

**Run these tests to verify improvement:**

1. **Keystroke Latency**
   ```
   Measure time between typing "a" and dropdown appearing
   Before: 100-500ms ❌
   After: < 20ms ✅
   ```

2. **API Requests During Typing "aspirin" (8 chars)**
   ```
   Before: 8 requests ❌
   After: 0 requests ✅
   ```

3. **CPU Usage While Typing**
   ```
   Open DevTools → Performance tab
   Record 10 seconds of typing
   Before: 60-80% CPU ❌
   After: 5-10% CPU ✅
   ```

4. **Memory Usage**
   ```
   Open DevTools → Memory tab
   Before: 15-20MB spikes ❌
   After: < 1MB spikes ✅
   ```

---

## Sign-Off Checklist

- [ ] All 15 test cases passed
- [ ] Console has no errors
- [ ] Network tab shows 1 API call (on load only)
- [ ] Dropdown functionality works
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Performance improved (< 20ms per keystroke)
- [ ] No page refresh on typing
- [ ] Input stays stable
- [ ] Edit dialog opens correctly
- [ ] All regression tests passed
- [ ] Ready for production ✅

---

**Total Testing Time:** 15-30 minutes for comprehensive verification

**Next Steps:** Run tests, document results, deploy when all pass ✅
