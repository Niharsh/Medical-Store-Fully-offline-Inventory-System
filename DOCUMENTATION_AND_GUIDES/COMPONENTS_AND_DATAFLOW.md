# Frontend Components & Data Flow

## Component Hierarchy

```
App
├── ProductProvider
│   └── InvoiceProvider
│       ├── Header
│       ├── Navigation
│       └── Routes
│           ├── Dashboard
│           │   ├── StatCard (multiple)
│           │   ├── LowStockAlert
│           │   └── QuickActions
│           │
│           ├── Inventory
│           │   ├── AddProductForm
│           │   │   └── ErrorAlert
│           │   └── ProductList
│           │       ├── LoadingSpinner
│           │       └── ErrorAlert
│           │
│           └── Billing
│               ├── BillingForm
│               │   └── ErrorAlert
│               └── InvoiceHistory
│                   ├── LoadingSpinner
│                   └── ErrorAlert
```

---

## Data Flow Diagram

### Adding a Product

```
┌─ User fills AddProductForm ─────────┐
│                                     │
│  1. handleChange() updates state    │
│  2. handleSubmit() validates form   │
│  3. Calls productService.create()   │
│                                     ↓
│                        API REQUEST
│                        POST /api/products/
│                                     ↓
│  4. Backend validates & creates     │
│  5. Returns full product object     │
│                                     ↓
│  6. useProducts().addProduct()      │
│  7. Updates ProductContext          │
│                                     ↓
│  8. ProductList re-renders          │
│  9. New product appears in list     │
│                                     │
└─────────────────────────────────────┘
```

### Creating an Invoice

```
┌─ User fills BillingForm ────────────┐
│                                     │
│  1. Add items to billItems array    │
│  2. Fill customer details           │
│  3. handleSubmit() validates form   │
│  4. Calls invoiceService.create()   │
│                                     │
│  5. Sends:                          │
│     {                               │
│       customer_name,                │
│       items: [...]  ← NO TOTALS!   │
│     }                               │
│                                     ↓
│                        API REQUEST
│        POST /api/invoices/
│     (BACKEND CALCULATES TOTALS!)
│                                     ↓
│  6. Backend returns:                │
│     {                               │
│       id,                           │
│       total_amount: "151.00", ✓    │
│       items: [{                     │
│         subtotal: "51.00" ✓        │
│       }]                            │
│     }                               │
│                                     ↓
│  7. useInvoices().createInvoice()   │
│  8. Updates InvoiceContext          │
│                                     ↓
│  9. InvoiceHistory re-renders       │
│  10. New invoice appears with       │
│      backend-calculated total       │
│                                     │
└─────────────────────────────────────┘
```

---

## State Management with Context

### ProductContext

```javascript
// State
{
  products: [],           // Array of Product objects from API
  loading: false,         // Loading state
  error: null            // Error message if any
}

// Methods
fetchProducts()          // GET /api/products/
addProduct(data)         // POST /api/products/
updateProduct(id, data)  // PATCH /api/products/{id}/
deleteProduct(id)        // DELETE /api/products/{id}/
getLowStock(threshold)   // GET /api/products/?quantity__lt={threshold}
```

**Usage in Components**:
```jsx
const { products, loading, error, fetchProducts, addProduct } = useProducts();

// Fetch on mount
useEffect(() => {
  fetchProducts();
}, []);

// Add product
const handleAdd = async (formData) => {
  const newProduct = await addProduct(formData);
  // Context automatically updates
};
```

### InvoiceContext

```javascript
// State
{
  invoices: [],          // Array of Invoice objects
  currentInvoice: null,  // Currently viewed invoice
  loading: false,        // Loading state
  error: null           // Error message
}

// Methods
fetchInvoices()          // GET /api/invoices/
fetchInvoice(id)         // GET /api/invoices/{id}/
createInvoice(data)      // POST /api/invoices/
updateInvoice(id, data)  // PATCH /api/invoices/{id}/
deleteInvoice(id)        // DELETE /api/invoices/{id}/
```

---

## API Service Layer

### Structure

```
medicineService.js
├── productService
│   ├── getAll(params)
│   ├── getById(id)
│   ├── create(data)
│   ├── update(id, data)
│   ├── delete(id)
│   └── getLowStock(threshold)
│
├── batchService
│   ├── getAll(params)
│   ├── getByProduct(productId)
│   ├── create(data)
│   ├── update(id, data)
│   ├── delete(id)
│   └── getExpiring(days)
│
├── invoiceService
│   ├── getAll(params)
│   ├── getById(id)
│   ├── create(data)
│   ├── update(id, data)
│   ├── delete(id)
│   ├── addItem(invoiceId, data)
│   └── removeItem(invoiceId, itemId)
│
└── invoiceItemService
    ├── getByInvoice(invoiceId)
    ├── update(id, data)
    └── delete(id)
```

### Axios Interceptors

```javascript
// Request Interceptor
- Adds Authorization header if token exists
- All requests sent with auth token

// Response Interceptor
- Handles 401 errors (clears token, redirects to login)
- Catches and re-throws other errors
```

---

## Form Validation Strategy

### Frontend Validation (Input Level)
```javascript
✓ Required fields
✓ Data types (number, email, etc.)
✓ Field length limits
✓ Pattern matching (optional)

// Example
if (!formData.customer_name) {
  throw new Error('Customer name is required');
}

if (billItems.length === 0) {
  throw new Error('Add at least one item');
}
```

### Backend Validation (Business Logic)
```python
✓ Unique constraints
✓ Foreign key validation
✓ Stock availability
✓ Price/quantity > 0
✓ Expiry date > manufacturing date
✓ Custom business rules

# Example
if quantity < 0:
    raise ValidationError("Quantity must be positive")

if not Product.objects.filter(id=product_id).exists():
    raise ValidationError("Product does not exist")
```

---

## Error Handling

### Frontend Error Handling

```javascript
try {
  const product = await productService.create(formData);
  // Success handling
} catch (error) {
  // Catch validation errors from backend
  // Or network errors
  setFormError(error.response?.data?.detail || error.message);
}
```

### Error Display

```jsx
{error && (
  <ErrorAlert 
    error={error} 
    onDismiss={() => setError('')} 
  />
)}
```

### Error Response Format (Expected from Backend)

```json
{
  "detail": "Validation failed",
  "errors": {
    "name": ["This field is required."],
    "price": ["Ensure this value is greater than or equal to 0."]
  }
}
```

---

## Component Patterns

### Presentational Component Pattern

```jsx
// ProductList.jsx - Pure presentation
const ProductList = ({ products, loading, error, onEdit, onDelete }) => {
  // Only displays data
  // No API calls
  // No calculations
  // No business logic
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert error={error} />}
      {products.map(product => (
        <ProductRow 
          key={product.id} 
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

### Container Component Pattern

```jsx
// Inventory.jsx - Orchestrates logic
const Inventory = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    addProduct,
    deleteProduct 
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <AddProductForm onProductAdded={handleProductAdded} />
      <ProductList 
        products={products}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onDelete={deleteProduct}
      />
    </div>
  );
};
```

---

## Field Naming Convention

### Frontend (Form Input)
```javascript
formData = {
  customer_name: '',
  customer_phone: '',
  notes: ''
}

billItems = [
  {
    product: 1,        // Product ID
    quantity: 2,
    unit_price: '25.50'
  }
]
```

### Backend (API Response)
```json
{
  "id": 1,
  "customer_name": "John",
  "customer_phone": "9876543210",
  "total_amount": "51.00",
  "items": [{
    "id": 1,
    "product": 1,
    "quantity": 2,
    "unit_price": "25.50",
    "subtotal": "51.00"
  }],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## Styling Strategy (Tailwind CSS)

### Custom CSS Classes
```css
/* index.css */
.btn-primary       /* Blue button */
.btn-secondary     /* Gray button */
.btn-danger        /* Red button */
.card              /* White card with shadow */
.input-field       /* Form input with focus styles */
.table-row         /* Table row with hover effect */
```

### Tailwind Utilities
- Grid layouts: `grid grid-cols-1 md:grid-cols-2`
- Spacing: `p-4 mb-6 space-y-4`
- Colors: `text-sky-600 bg-sky-50 border-amber-600`
- Responsive: `hidden md:block lg:flex`

---

## Pagination (DRF Default)

### Response Format
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/products/?page=2",
  "previous": null,
  "results": [...]
}
```

### Frontend Handling
```javascript
const response = await api.get('/products/', { params });
// response.data.results contains items
// response.data.count is total count
// response.data.next is next page URL
```

---

## Loading States

### Three States
```javascript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorAlert error={error} />;
return <Content />;
```

### Spinner Component
```jsx
<div className="flex justify-center items-center p-8">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
</div>
```

---

## Summary

| Aspect | Frontend | Backend |
|---|---|---|
| **API Calls** | Axios through medicineService.js | DRF ViewSets |
| **State** | Context API | Database |
| **Validation** | Input level | Business rules |
| **Calculations** | None | All |
| **Response Handling** | Display as-is | Return computed values |
| **Error Handling** | Show to user | Validate and return errors |
| **Transformations** | None | Data enrichment |

This ensures clean separation: **Frontend displays, Backend calculates**.
