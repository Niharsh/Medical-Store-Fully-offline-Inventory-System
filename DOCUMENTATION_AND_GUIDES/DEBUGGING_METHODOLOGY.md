# 🔬 TECHNICAL DEEP-DIVE: Expiry Section Debugging Methodology

**Purpose**: Guide for debugging similar issues in complex full-stack applications  
**Context**: Medical inventory & billing system (Django + React)  
**Issue**: Dashboard expiry section showing blank data  
**Solved**: ✅ Root cause identified & fixed in production

---

## 📋 THE DEBUGGING METHODOLOGY

When faced with a feature that "doesn't work," follow this systematic approach:

### Phase 1: Understand the Feature (5 minutes)

**Question**: What should happen?
```
User clicks "Expiring in 3 Months"
  → System fetches batches expiring within 3 months
  → Table displays: product name, batch number, quantity, expiry date
  → Items ordered by expiry date (nearest first)
```

**Question**: What is happening?
```
User clicks "Expiring in 3 Months"
  → Nothing happens (blank screen)
  → No error in console
```

### Phase 2: Trace the Data Flow (10 minutes)

**Frontend → API → Backend → Database**

1. **Frontend makes request**
   ```javascript
   const [expiringProducts, setExpiringProducts] = useState([]);
   
   // Where does it get data?
   // Answer: products.filter(p => p.expiry_date)
   ```

2. **What's in `products`?**
   ```javascript
   // From ProductContext
   // Fetched via: api.get('/products/')
   ```

3. **What does `/api/products/` return?**
   ```bash
   curl http://localhost:8000/api/products/ | python3 -m json.tool
   # Response:
   # {
   #   "id": 1,
   #   "name": "Aspirin",
   #   "product_type": "tablet",
   #   "expiry_date": null,  ← PROBLEM!
   #   "quantity": null,     ← PROBLEM!
   # }
   ```

4. **Why is `expiry_date` null on Product?**
   ```python
   # Check models.py
   class Product(models.Model):
       name = CharField()
       product_type = CharField()
       # NO expiry_date or quantity here!
   
   class Batch(models.Model):
       product = ForeignKey(Product)
       expiry_date = DateField()  ← HERE!
       quantity = PositiveIntegerField()  ← HERE!
   ```

5. **Aha! Data is on Batch, not Product**
   ```
   ONE Product → MANY Batches
   Each Batch has its own expiry & quantity
   ```

### Phase 3: Check Backend Endpoints (5 minutes)

**Question**: Is there a Batch endpoint?
```bash
curl http://localhost:8000/api/batches/ | head
# Yes, it exists
```

**Question**: Can we filter by expiry?
```bash
curl http://localhost:8000/api/batches/?expiry_date=2026-12-31
# Yes, but limited - must know exact date
```

**Question**: Is there an "expiring within X days" endpoint?
```bash
curl http://localhost:8000/api/batches/expiring/?months=3
# No! This doesn't exist
```

### Phase 4: Fix Selection (2 minutes)

**Option 1**: Frontend filters locally (❌ Wrong)
- Product doesn't have expiry_date → always empty

**Option 2**: Create backend endpoint (✅ Correct)
- Backend knows all batches
- Backend can filter efficiently at SQL level
- Frontend just displays

### Phase 5: Implementation (30 minutes)

**Step 1**: Create serializer
```python
class BatchExpiringSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    product_type = serializers.CharField(source='product.product_type')
    # Flatten nested data for frontend
```

**Step 2**: Create backend action
```python
@action(detail=False, methods=['get'])
def expiring(self, request):
    months = int(request.GET.get('months', 6))
    today = timezone.now().date()
    future_date = today + timedelta(days=30 * months)
    
    batches = Batch.objects.filter(
        expiry_date__gte=today,
        expiry_date__lte=future_date,
        quantity__gt=0
    ).select_related('product')
```

**Step 3**: Update frontend
```javascript
const fetchExpiringBatches = async (months) => {
  const response = await api.get(`/batches/expiring/?months=${months}`);
  setExpiringBatches(response.data.batches);
};
```

### Phase 6: Verification (5 minutes)

**Manual testing**:
```bash
# 1. Test backend endpoint
curl http://localhost:8000/api/batches/expiring/?months=3 | python3 -m json.tool

# 2. Navigate to dashboard
# http://localhost:5173

# 3. Click "3 Months" button
# → Should show table with batch data
```

**Automated verification**:
```javascript
console.log('✅ Expiring batches fetched:', response.data);
// Should show array with batch objects
```

---

## 🧠 DEBUGGING MINDSET

### Common Mistakes to Avoid

❌ **Mistake 1**: Assume it's a frontend bug
- Didn't check if data exists in backend
- Didn't verify API response
- **Fix**: Always check the data source first

❌ **Mistake 2**: Don't look at the data model
- Assumed Product has expiry_date because frontend tried to use it
- Didn't verify which model actually stores this data
- **Fix**: Always check models.py first

❌ **Mistake 3**: Make frontend do backend's job
- Frontend filters, calculates, aggregates
- Complex logic belongs on backend
- **Fix**: Backend handles logic, frontend handles display

❌ **Mistake 4**: Don't test the API independently
- Only tested through frontend
- Frontend could be broken for other reasons
- **Fix**: Test API with curl/Postman separately

### Correct Debugging Approach

✅ **Step 1**: Understand requirement
✅ **Step 2**: Trace data: Frontend → API → Backend → Database
✅ **Step 3**: Check each layer independently
✅ **Step 4**: Find the broken layer
✅ **Step 5**: Fix at the source, not downstream
✅ **Step 6**: Verify each layer after fix

---

## 🏗️ ARCHITECTURE INSIGHTS

### Data Model Hierarchy

```
Store (Single)
├── ShopProfile (1:1)
│   └── shop_name, address, phone, GST
│
├── ProductType (Many)
│   └── name, label (tablet, syrup, powder, etc.)
│
├── Product (Many, 1:1 with ProductType)
│   ├── name, generic_name, manufacturer
│   ├── NO expiry_date  ← Key insight
│   └── Batches (1:N)  ← Related objects
│       ├── batch_number (e.g., LOT-2024-001)
│       ├── expiry_date  ← HERE
│       ├── quantity  ← HERE
│       ├── mrp, selling_rate, cost_price
│       └── Wholesaler (Foreign key)
│
├── Invoice (Many) ← Sales bills
│   ├── customer_name, customer_phone
│   ├── InvoiceItem (Many, 1:N)
│   │   ├── Snapshot of product info
│   │   └── Snapshot of prices (can differ from batch)
│   └── SalesBill (1:1)
│       └── Payment tracking (paid, due, status)
│
└── PurchaseBill (Many) ← Purchase bills
    ├── wholesaler FK
    └── Payment tracking
```

### Why Batch Has Expiry, Not Product

1. **Medical stores buy multiple times**
   - Same product from same or different suppliers
   - Each purchase is a batch

2. **Each batch is unique**
   - Different manufacturing date
   - Different expiry date
   - Different lot/batch number
   - Potentially different price

3. **FIFO (First In First Out) management**
   - Sell older batches first
   - Track expiry per batch
   - Not possible with product-level data

4. **Audit trail**
   - Can track which batch was sold
   - Can match invoice item to batch
   - Required for medical/pharmaceutical tracking

### Why Frontend Can't Filter Locally

1. **Product model doesn't have the data**
   ```python
   product.expiry_date  # None (doesn't exist)
   product.quantity     # None (doesn't exist)
   ```

2. **Need to aggregate across batches**
   ```
   Product "Aspirin" has:
   - Batch 1: 100 units, expires 2026-12-31
   - Batch 2: 50 units, expires 2027-06-30
   
   Frontend would need to:
   1. Fetch product
   2. Fetch all batches for product
   3. Filter batches by expiry
   4. Calculate totals
   
   Backend is 100x better:
   SELECT batch FROM Batch
   WHERE expiry_date BETWEEN ? AND ?
   AND quantity > 0
   ORDER BY expiry_date;
   ```

---

## 💡 BEST PRACTICES APPLIED

### 1. **API-First Design**
- Create endpoints for complex queries
- Don't make frontend assemble data
- Backend is source of truth

### 2. **Database-Level Filtering**
```python
# ✅ GOOD - Filters at SQL level
Batch.objects.filter(expiry_date__gte=today).count()
# SELECT COUNT(*) FROM batch WHERE expiry_date >= '2026-01-25'

# ❌ BAD - Fetches all, filters in Python
[b for b in Batch.objects.all() if b.expiry_date >= today]
# SELECT * FROM batch; [filter in Python]
```

### 3. **Efficient Database Queries**
```python
# ✅ GOOD - Single query with related data
batches = Batch.objects.filter(...).select_related('product')
# Fetches batch + product in 1 query

# ❌ BAD - N+1 queries
batches = Batch.objects.filter(...)
for batch in batches:
    print(batch.product.name)  # Query again for each batch!
```

### 4. **Serializer for API Response**
```python
# ✅ GOOD - Flatten nested data
class BatchExpiringSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    # Frontend gets flat structure, easier to work with

# ❌ BAD - Keep nested structure
class BatchSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    # Frontend needs to dig into nested objects
```

### 5. **Clear API Contracts**
```python
@action(detail=False, methods=['get'])
def expiring(self, request):
    """
    Get batches expiring within specified months.
    
    Query params:
    - months (int): Default 6
    
    Response:
    {
        "months": 3,
        "today": "2026-01-25",
        "until": "2026-04-25",
        "count": 5,
        "batches": [...]
    }
    """
```

### 6. **Error Handling**
```javascript
// ✅ GOOD
try {
  const response = await api.get(...);
  setExpiringBatches(response.data.batches);
} catch (error) {
  setExpiryError('Failed to fetch...');
}

// ❌ BAD
const response = await api.get(...);
setExpiringBatches(response.data.batches);  // Crashes if error
```

---

## 📊 BEFORE/AFTER COMPARISON

### ❌ BEFORE (Broken Logic)

```
Frontend Component
  ↓
ProductContext.products
  ├─ Fetches from /api/products/
  └─ Products have NO expiry_date
    ↓
Dashboard
  ↓
Filter: products.filter(p => p.expiry_date)
  ↓
Result: Always empty array ❌
  ↓
Display: Blank section
```

**Why it's broken**:
- Product model doesn't have expiry_date
- Filter always returns empty
- User sees nothing

### ✅ AFTER (Fixed Logic)

```
Frontend Component
  ↓
API Call: api.get('/batches/expiring/?months=3')
  ↓
Backend View
  ├─ Parse query param: months=3
  ├─ Calculate date range
  ├─ Query: Batch.objects.filter(
  │    expiry_date__gte=today,
  │    expiry_date__lte=future,
  │    quantity__gt=0
  │  ).select_related('product')
  └─ Serialize: BatchExpiringSerializer
    ↓
Response JSON
  ├─ months: 3
  ├─ count: 5
  └─ batches: [...]
    ↓
Frontend
  ├─ Set state: expiringBatches
  └─ Render table with batch data ✅
    ↓
Display: Professional table with data
```

**Why it works**:
- Backend queries database directly
- Efficient SQL filtering
- Frontend receives complete, ready-to-display data
- User sees exactly what they need

---

## 🎯 KEY TAKEAWAYS

### For This Project

1. **Data lives on Batch, not Product**
   - Product is just metadata (name, type, etc.)
   - Batch is where inventory lives (qty, expiry, prices)

2. **Create endpoints for complex queries**
   - `/api/batches/expiring/?months=X` is better than having frontend filter
   - Backend can optimize with SQL

3. **Use serializers to flatten nested data**
   - Frontend gets `product_name` directly
   - Not `{product: {name: "..."}}`

### For Similar Projects

1. **Always trace the data**
   - Frontend → API → Backend → Database
   - Find where the break is

2. **Check the data model first**
   - Don't assume - verify
   - Use `manage.py shell` to inspect

3. **Never make frontend do backend's job**
   - Backend = data & logic
   - Frontend = display & UX

4. **Test each layer independently**
   - Test API with curl
   - Test frontend components separately
   - Don't test end-to-end first

5. **Write clear API contracts**
   - Docstrings for endpoints
   - Clear query params
   - Clear response structure

---

## 🔗 RELATED CONCEPTS

### Django ORM

- `.filter()` - WHERE clause
- `.exclude()` - NOT WHERE
- `.order_by()` - ORDER BY
- `.select_related()` - JOIN for ForeignKey
- `.prefetch_related()` - JOIN for ManyToMany/reverse FK
- `.values()` - SELECT specific columns
- `.annotate()` - Aggregate functions (COUNT, SUM, etc.)

### Django REST Framework

- ViewSet - CRUD + custom actions
- @action decorator - Custom endpoints
- Serializer - JSON conversion
- source= parameter - Rename fields
- read_only_fields - Prevent PUT/POST

### React Patterns

- useState - Manage state
- useEffect - Side effects (fetching)
- try/catch - Error handling
- .map() - Render lists
- conditional rendering - Show/hide

---

## 📖 FURTHER READING

- Django ORM: https://docs.djangoproject.com/en/stable/topics/db/queries/
- DRF: https://www.django-rest-framework.org/
- React Hooks: https://react.dev/reference/react/hooks
- Medical inventory FIFO: https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)

---

## ✅ CONCLUSION

This debugging exercise demonstrates the importance of:

1. **Understanding the problem** - What data should flow where?
2. **Checking fundamentals** - What model actually stores this data?
3. **Testing independently** - Is the API working? Is the frontend working?
4. **Following best practices** - Proper architecture, error handling, documentation
5. **Thinking systematically** - Trace the data, find the break, fix at source

By following this methodology, you can debug any similar issue in a full-stack application.

