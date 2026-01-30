# 🔍 Global Product Search - Visual Guide

## Navigation Layout

### Before
```
┌─────────────────────────────────────────────────────┐
│ Dashboard │ Inventory │ Billing │ Settings         │
└─────────────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────────────────────┐
│ Dashboard │ Inventory │ Billing │ Settings   [Search] [🔍]  │
└──────────────────────────────────────────────────────────────┘
                                      ↑ Global Search Bar
```

---

## Search Flow

```
User on ANY page (Dashboard, Inventory, Billing, etc.)
        ↓
    Types in search bar: "Aspirin"
        ↓
    Presses Enter or clicks 🔍
        ↓
    Frontend sends to: /search?q=Aspirin
        ↓
    Backend queries: /api/products/?search=Aspirin
        ↓
    Results return from database
        ↓
    ProductSearch page displays results
        ↓
User sees:
  ✓ Product Name
  ✓ Salt/Composition
  ✓ Type
  ✓ Stock (color-coded)
  ✓ Cost Price
  ✓ Selling Price
  ✓ Expiry Date
```

---

## Results Table Example

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         Product Search Results                                      │
│                                                                                     │
│ Search query: paracetamol                                                          │
│ Found 8 products                                                                    │
│                                                                                     │
│ ┌──────────────┬──────────────────────┬────────┬────────┬───────┬───────┬─────────┐│
│ │Product Name  │Salt/Composition      │Type    │Stock   │Cost   │Sell   │Expiry   ││
│ ├──────────────┼──────────────────────┼────────┼────────┼───────┼───────┼─────────┤│
│ │Crocin 500    │Paracetamol 500mg    │Tablet  │ 450    │₹2.50  │₹4.00  │Jan 2026 ││
│ │Paracet 500   │Paracetamol 500mg    │Tablet  │  45    │₹2.00  │₹3.50  │Mar 2026 ││ ← Low stock (red)
│ │Paracetamol D │Paracetamol 500mg +  │Tablet  │ 200    │₹3.50  │₹5.50  │Feb 2026 ││
│ │              │Diphenhydramine      │        │        │       │       │         ││
│ │Tylenol       │Paracetamol 650mg    │Capsule │ 120    │₹4.00  │₹6.50  │May 2026 ││
│ └──────────────┴──────────────────────┴────────┴────────┴───────┴───────┴─────────┘│
└─────────────────────────────────────────────────────────────────────────────────────┘

Legend:
  Red Stock = 45 units (≤ 10 below minimum, alert color)
  Green Stock = Normal (≥ 100)
```

---

## Search Results Features

### ✅ Product Name
- Full product name
- Exactly as entered in inventory

### ✅ Salt/Composition
- Active ingredient
- Dosage information
- Example: "Paracetamol 500mg"

### ✅ Type Badge
- Product category
- Blue badge styling
- Examples: Tablet, Syrup, Powder, Cream

### ✅ Stock (Color-Coded)
- Green: Normal stock
- Red: Low stock (≤ 10)
- Shows exact quantity

### ✅ Cost Price
- Purchase price from wholesaler
- Right-aligned in table
- Format: ₹X.XX

### ✅ Selling Price
- Price to customer
- Bold font (emphasis)
- Format: ₹X.XX

### ✅ Expiry Date
- Earliest batch expiry
- Sorted by expiry
- Shows nearest expiry first
- Format: Month Year (e.g., Jan 2026)

---

## Search Capabilities

### Searchable Fields
1. **Product Name**
   - Example: "Aspirin"
   - Matches: Aspirin, Aspirin D, Aspirin Plus

2. **Generic Name**
   - Example: "Acetylsalicylic"
   - Matches: Aspirin (ASA), Ecosprin

3. **Manufacturer**
   - Example: "Bayer"
   - Matches: All Bayer products

4. **Salt/Composition** ✨ NEW
   - Example: "Paracetamol"
   - Matches: Crocin, Tylenol, Paracet, etc.

---

## Empty States

### No Results
```
┌─────────────────────────────────────────────────────┐
│ Product Search Results                              │
│                                                     │
│ Search query: xyz123                                │
│                                                     │
│ ⚠️  No products found matching "xyz123"             │
│ Try searching with different keywords.              │
└─────────────────────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────────────────────┐
│ Product Search Results                              │
│                                                     │
│ Search query: aspirin                               │
│                                                     │
│     Searching products...                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Error State
```
┌─────────────────────────────────────────────────────┐
│ Product Search Results                              │
│                                                     │
│ ❌ Failed to search products                        │
│ Please try again or contact support.                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Focus search bar | Tab (from menu) |
| Submit search | Enter |
| Clear search | Backspace (all text) |
| New search | Click input → clear → type |

---

## Mobile Responsiveness

### Desktop (Full Width)
```
[Nav] [Search Input 300px] [🔍]
```

### Tablet (Adjusted Width)
```
[Nav] [Search Input 250px] [🔍]
```

### Mobile (Wrapped)
```
[Nav items]
[Search Input full width]
[🔍 Button]
```

---

## Integration with Existing Features

### Dashboard
- Global search available
- Purchase Bills shown without search
- Can search products from dashboard

### Inventory
- Global search available
- Product list visible
- Can search from anywhere

### Billing
- Global search available
- Create invoices as normal
- Can search products quickly

### Settings
- Global search available
- Settings unchanged
- Can search products

---

## Data Flow

```
Frontend                    Backend                 Database
─────────────────────────────────────────────────────────────

1. User enters "Aspirin"
   │
   ├─ Text input → state
   │
   └─ Press Enter
      │
      └──→ /search?q=Aspirin
         │
         └─→ ProductSearch.jsx
            │
            └──→ GET /api/products/?search=Aspirin
               │
               ├─→ ViewSet receives query
               │
               ├─→ Search Filter processes
               │  (searches: name, generic_name,
               │             manufacturer,
               │             salt_composition)
               │
               └─→ Query database
                  │
                  ├─→ SELECT * FROM products
                  │   WHERE name ILIKE '%Aspirin%'
                  │      OR generic_name ILIKE '%Aspirin%'
                  │      OR manufacturer ILIKE '%Aspirin%'
                  │      OR salt_composition ILIKE '%Aspirin%'
                  │
                  └─→ Return results with batches
                     │
                     └──→ Serialize to JSON
                        │
                        └──→ Frontend receives
                           │
                           └─→ Display in table
```

---

## Testing Scenarios

### Scenario 1: Find Product by Name
- Search: "Aspirin"
- Expected: All Aspirin products shown
- Verify: Names display correctly

### Scenario 2: Find Product by Salt
- Search: "Paracetamol"
- Expected: Crocin, Tylenol, Paracet shown
- Verify: Salt composition displays

### Scenario 3: Find Low Stock Items
- Search: Any product with low stock
- Expected: Stock number shown in red
- Verify: Color-coding works

### Scenario 4: No Results
- Search: "xyz123"
- Expected: "No products found" message
- Verify: Error handling works

### Scenario 5: Empty Search
- Click search bar (empty)
- Press Enter
- Expected: No navigation (prevented)
- Verify: Validation works

---

## Performance

### Search Optimization
- Uses DRF SearchFilter (built-in optimization)
- Indexes on searchable fields
- Pagination: 50 results per page
- Load time: < 500ms

### Display Optimization
- Only shows necessary columns
- Lazy loads batch data
- Efficient sorting
- Responsive CSS grid

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers

---

**For implementation details, see: GLOBAL_SEARCH_IMPLEMENTATION.md**
