# 🏢 Wholesaler Feature - Quick Reference Card

## Usage

### In a Component
```javascript
import { useWholesalers } from '../context/WholesalersContext';

const MyComponent = () => {
  const {
    wholesalers,                    // Array of all wholesalers
    selectedWholesalerId,           // Currently selected ID (string or null)
    setSelectedWholesalerId,        // Function to select a wholesaler
    addWholesaler,                  // Function to add new
    updateWholesaler,               // Function to update
    deleteWholesaler,               // Function to delete
    recordPurchase,                 // Log cost price history
    getLastPurchasePrice,           // Get last purchase price
    getWholesaler                   // Get specific wholesaler by ID
  } = useWholesalers();

  return (
    // Your component code
  );
};
```

## API Reference

### Adding a Wholesaler
```javascript
const newWholesaler = addWholesaler(name, contactNumber);
// Returns: {id: "1768811665615", name: "...", contactNumber: "...", createdAt: "..."}
```

### Selecting a Wholesaler
```javascript
setSelectedWholesalerId(wholesalerId);
// Sets the selected wholesaler (string ID)
// Dropdown will auto-update
```

### Getting Selected Wholesaler
```javascript
const wholesaler = getSelectedWholesaler();
// Returns the full wholesaler object or null
```

### Getting a Specific Wholesaler
```javascript
const wholesaler = getWholesaler(wholesalerId);
// Returns: {id: "...", name: "...", contactNumber: "...", ...}
```

### Recording a Purchase
```javascript
recordPurchase(wholesalerId, productName, costPrice, date);
// Tracks cost price history for a product from a wholesaler
```

### Getting Cost History
```javascript
const lastPrice = getLastPurchasePrice(wholesalerId, productName);
// Returns: {id: "...", wholesalerId: "...", costPrice: 50, ...}
```

## Data Structure

### Wholesaler Object
```javascript
{
  id: "1768811665615",                        // Unique timestamp string
  name: "Wholesale Pharma Ltd",               // Wholesaler name
  contactNumber: "+91-9876543210",            // Contact (optional)
  createdAt: "2024-01-15T10:30:45.123Z"      // ISO timestamp
}
```

### Selected State
```javascript
selectedWholesalerId: "1768811665615"  // String ID or null
```

## Display Patterns

### Dropdown with Auto-Selection
```javascript
<select 
  value={selectedWholesalerId || ''} 
  onChange={(e) => setSelectedWholesalerId(e.target.value || null)}
>
  <option value="">-- Select Wholesaler --</option>
  {wholesalers.map(w => (
    <option key={w.id} value={w.id}>{w.name}</option>
  ))}
</select>
```

### Display Selected Wholesaler Name
```javascript
<p>Selected: {getSelectedWholesaler()?.name || 'None'}</p>
```

### List All Wholesalers
```javascript
<ul>
  {wholesalers.map(w => (
    <li key={w.id}>{w.name} ({w.contactNumber})</li>
  ))}
</ul>
```

## Storage

### Key
```
inventory_wholesalers
```

### Format
```json
[
  {
    "id": "1768811665615",
    "name": "Supplier A",
    "contactNumber": "+91-9876543210",
    "createdAt": "2024-01-15T10:30:45.123Z"
  }
]
```

### Access Directly
```javascript
// Read
const data = JSON.parse(localStorage.getItem('inventory_wholesalers'));

// Clear
localStorage.removeItem('inventory_wholesalers');
```

## Console Debugging

### View Current State
```javascript
const { wholesalers, selectedWholesalerId } = useWholesalers();
console.log({ wholesalers, selectedWholesalerId });
```

### Expected Logs When Adding
```
🏢 addWholesaler called with: {...}
📦 Old wholesalers: [...]
✅ New wholesaler object: {...}
📊 Updated wholesalers array: [...]
💾 saveWholesalers function called
🔄 WholesalersContext provider rendering with: {...}
✅ New wholesaler created: {...}
📝 Setting selectedWholesalerId to: [ID]
🔄 WholesalersManager render: {...}
```

## Common Tasks

### Check if Wholesaler is Selected
```javascript
if (selectedWholesalerId) {
  const wholesaler = getSelectedWholesaler();
  // Do something with wholesaler
}
```

### Filter Products by Selected Wholesaler
```javascript
const productsFromWholesaler = products.filter(
  p => p.wholesalerId === selectedWholesalerId
);
```

### Clear Selection
```javascript
setSelectedWholesalerId(null);
```

### Check if Name Already Exists
```javascript
const isDuplicate = wholesalers.some(
  w => w.name.toLowerCase() === name.toLowerCase()
);
```

### Get Cost Price for Product
```javascript
const purchase = getLastPurchasePrice(selectedWholesalerId, productName);
const costPrice = purchase?.costPrice || 0;
```

## File Locations

| File | Purpose |
|------|---------|
| `frontend/src/context/WholesalersContext.jsx` | Context provider & hook |
| `frontend/src/components/Wholesalers/WholesalersManager.jsx` | UI component |
| `test_wholesalers_logic.js` | Logic verification test |
| `test_wholesalers_manual.html` | Interactive test page |

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `useWholesalers must be used within WholesalersProvider` | Ensure component is wrapped by WholesalersProvider in App.jsx |
| Dropdown not showing new wholesaler | Check console logs, verify localStorage has the data |
| Selection not persisting | Check that useState is properly initialized with state value |
| Duplicate wholealers not prevented | Check case-insensitive comparison in validation |

## Props & Parameters

### addWholesaler(name, contactNumber?)
- `name` (string, required): Wholesaler name
- `contactNumber` (string, optional): Contact number
- Returns: Wholesaler object with unique ID

### setSelectedWholesalerId(id)
- `id` (string | null): Wholesaler ID or null to clear
- Side effects: Updates component state, triggers re-renders

### recordPurchase(wholesalerId, productName, costPrice, date?)
- `wholesalerId` (string): Wholesaler ID
- `productName` (string): Product name
- `costPrice` (number): Cost price paid
- `date` (string, optional): ISO date string
- Returns: Purchase history record

## Type Safety

```javascript
// All IDs are strings (from Date.now().toString())
const id = "1768811665615";  // ✓ Correct

// Comparison always works
if (wholesalers.find(w => w.id === selectedWholesalerId)) { }  // ✓

// No type conversion needed
<option value={w.id}>{w.name}</option>  // ✓
```

## Performance Notes

- Context value is memoized (useMemo)
- Re-renders only when wholesalers or selectedWholesalerId changes
- localStorage operations are synchronous (fine for small data)
- Array operations are O(n) (acceptable for ~100 wholesalers)

## Migration to Backend (Future)

When adding backend API:
1. Replace `addWholesaler` with API call
2. Add loading state management
3. Handle API errors with try/catch
4. Keep localStorage as cache (optional)
5. Change ID from timestamp to server-generated UUID

---

**Quick Start**: Import hook → destructure values → use in component  
**Data Access**: localStorage key is `inventory_wholesalers`  
**Debugging**: Check console for emoji-prefixed logs  
**Integration**: Works seamlessly with AddProductForm and ProductList  
