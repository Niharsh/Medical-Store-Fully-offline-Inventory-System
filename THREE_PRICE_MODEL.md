# Three-Price Model Implementation Guide

## Overview

The Medical Store Inventory System now supports **three distinct price points per product batch**:

1. **MRP (Maximum Retail Price)** - Display/reference only
2. **Selling Rate** - EXCLUSIVE use for billing calculations  
3. **Cost Price** - Internal reference for profit analysis

This document serves as the authoritative reference for implementing, using, and understanding the three-price model across the entire stack.

---

## Price Definitions & Usage

### MRP (Maximum Retail Price)

**What**: The official/maximum retail price printed on packaging

**Purpose**: Reference point for customers, display on invoices

**Used For**:
- ✓ Invoice display (shown as reference)
- ✓ Comparison (showing discounts, e.g., "MRP ₹100 vs Selling ₹90")
- ✓ Regulatory compliance (if required)

**Used For (NOT)**:
- ✗ Billing calculations
- ✗ Invoice subtotal/total calculations
- ✗ Any customer-facing totals

**Example**:
```
Product: Aspirin 500mg
MRP: ₹100.00
Selling Rate: ₹90.00
Quantity: 5

Invoice Total = 5 × ₹90.00 = ₹450.00 (NOT 5 × ₹100)
```

---

### Selling Rate

**What**: The actual price charged to the customer for this batch

**Purpose**: PRIMARY BILLING PRICE - used for all monetary calculations

**Used For**:
- ✓ Invoice subtotal calculation (quantity × selling_rate)
- ✓ Invoice total calculation
- ✓ Billing screens (auto-filled from batch)
- ✓ Profit margin calculation: (Selling Rate - Cost Price) × Qty
- ✓ Cost analysis

**Used For (NOT)**:
- ✗ (Selling Rate is used for everything monetary)

**Example**:
```
Product: Aspirin 500mg
MRP: ₹100.00
Selling Rate: ₹90.00  ← USED HERE
Quantity: 5
Invoice Total = 5 × ₹90.00 = ₹450.00 ✓
```

---

### Cost Price

**What**: Internal acquisition/manufacturing cost

**Purpose**: Profit analysis and cost tracking

**Used For**:
- ✓ Profit margin analysis (internal reports)
- ✓ Inventory cost valuation
- ✓ Business intelligence dashboards
- ✓ Profitability reports (feature to be added)

**Used For (NOT)**:
- ✗ Billing calculations
- ✗ Invoice totals
- ✗ Customer-facing screens
- ✗ Invoice API responses (never shown to customers)

**Example**:
```
Product: Aspirin 500mg
Cost Price: ₹70.00
Selling Rate: ₹90.00
Profit per unit = ₹90 - ₹70 = ₹20
Profit margin = (₹20 / ₹90) × 100 = 22.2%

NOT visible in billing or customer invoices
```

---

## Critical Implementation Rules

### ⚠️ RULE 1: Selling Rate ONLY for Billing

**REQUIREMENT**: All invoice calculations must use ONLY `selling_rate`, NEVER `mrp`

**Code Pattern**:
```python
# ✓ CORRECT
def get_subtotal(self):
    return self.quantity * self.selling_rate

# ✗ WRONG
def get_subtotal(self):
    return self.quantity * self.mrp
```

**Why**: Allows bulk discounts (Selling Rate < MRP) while maintaining audit trail

**Enforcement**:
- Backend: InvoiceItem.get_subtotal() uses selling_rate
- Frontend: BillingForm calculates total = quantity × selling_rate
- API: Invoice responses show selling_rate for calculations

---

### ⚠️ RULE 2: Cost Price NEVER in Billing

**REQUIREMENT**: Cost price must NOT appear in any billing-related responses or screens

**Visibility**:
- ✓ ProductList (inventory view) - shows cost price for profit analysis
- ✗ BillingForm (billing) - cost price NOT visible
- ✗ Invoice API response - cost price NOT included
- ✗ Invoice PDF/print - cost price NOT printed

**Code Pattern**:
```python
# InvoiceItem model: cost_price field NOT included
class InvoiceItem(models.Model):
    selling_rate = DecimalField()  # ✓ Included
    mrp = DecimalField()            # ✓ Included
    cost_price = DecimalField()     # ✗ NOT in invoice context

# InvoiceItemSerializer: cost_price NOT in fields
fields = ['id', 'product_id', 'batch_number', 'quantity', 'selling_rate', 'mrp']
# Note: cost_price deliberately omitted
```

**Why**: Cost price is confidential business information, not for customers

---

### ⚠️ RULE 3: MRP is Reference Only

**REQUIREMENT**: MRP shown on invoices for reference/comparison but NOT used in calculations

**Presentation**:
```
Selling Rate: ₹90.00 (Primary)
MRP: ₹100.00 (Reference)
↑ Only this used for billing
```

**Code Pattern**:
```javascript
// Frontend BillingForm
<div className="mt-2">
  <label>Selling Rate (used for billing)</label>
  <input value={item.selling_rate} disabled />
</div>

<div className="mt-2">
  <label>MRP (reference only)</label>
  <input value={item.mrp} disabled className="text-gray-500" />
</div>
```

**Why**: Transparency - shows list price while recording actual selling price

---

### ⚠️ RULE 4: Each Batch Has Independent Prices

**REQUIREMENT**: Adding a new batch does NOT overwrite prices of existing batches

**Implementation**:
```python
# ✓ CORRECT: Each batch maintains independent prices
batch1 = Batch.objects.create(
    product=product,
    batch_number="LOT-2024-001",
    mrp=100.00,
    selling_rate=90.00,
    cost_price=70.00,
    quantity=100
)

batch2 = Batch.objects.create(
    product=product,
    batch_number="LOT-2024-002",
    mrp=105.00,          # Different MRP
    selling_rate=95.00,  # Different selling rate
    cost_price=72.00,    # Different cost
    quantity=50
)

# Both batches coexist with different prices
assert batch1.mrp != batch2.mrp  # ✓ Independent
```

**Why**: Reflects real-world pricing changes - later batches may be more expensive

---

## Data Model

### Batch Model

```python
class Batch(models.Model):
    product = ForeignKey(Product, on_delete=models.CASCADE)
    
    # Identifiers
    batch_number = CharField(max_length=100)  # LOT-2024-001
    
    # Three prices
    mrp = DecimalField(max_digits=10, decimal_places=2, help_text="Maximum Retail Price")
    selling_rate = DecimalField(max_digits=10, decimal_places=2, help_text="Actual selling price - USED FOR BILLING")
    cost_price = DecimalField(max_digits=10, decimal_places=2, help_text="Internal cost - for profit analysis")
    
    # Inventory
    quantity = PositiveIntegerField()
    expiry_date = DateField()
    
    # Metadata
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'batch_number')
```

### InvoiceItem Model

```python
class InvoiceItem(models.Model):
    invoice = ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = ForeignKey(Product, on_delete=models.PROTECT)
    
    # Batch reference
    batch_number = CharField(max_length=100)
    
    # Quantity sold
    quantity = PositiveIntegerField()
    
    # Prices from batch (at time of invoice)
    selling_rate = DecimalField(max_digits=10, decimal_places=2)  # ✓ USED FOR CALCULATION
    mrp = DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # ✓ FOR REFERENCE
    
    # ✗ cost_price deliberately NOT included (confidential)
    
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    def get_subtotal(self):
        """Calculate subtotal using ONLY selling_rate"""
        return self.quantity * self.selling_rate
```

---

## API Contracts

### Creating a Product with Three Prices

**Request**:
```json
POST /api/products/
{
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "generic_name": "Acetylsalicylic Acid",
  "manufacturer": "Pharma Ltd",
  "batches": [
    {
      "batch_number": "LOT-2024-001",
      "mrp": "100.00",
      "selling_rate": "90.00",
      "cost_price": "70.00",
      "quantity": 100,
      "expiry_date": "2026-12-31"
    }
  ]
}
```

### Getting Product with All Prices

**Response**:
```json
GET /api/products/1/
{
  "id": 1,
  "name": "Aspirin 500mg",
  "product_type": "tablet",
  "batches": [
    {
      "batch_number": "LOT-2024-001",
      "mrp": "100.00",
      "selling_rate": "90.00",
      "cost_price": "70.00",
      "quantity": 100,
      "expiry_date": "2026-12-31"
    }
  ]
}
```

### Creating an Invoice (Billing)

**Request** - Client sends selling_rate:
```json
POST /api/invoices/
{
  "customer_name": "John's Pharmacy",
  "items": [
    {
      "product_id": 1,
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "selling_rate": "90.00"
    }
  ]
}
```

**Response** - Includes both selling_rate (calculation) and mrp (reference):
```json
{
  "id": 123,
  "customer_name": "John's Pharmacy",
  "total_amount": "450.00",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "Aspirin 500mg",
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "selling_rate": "90.00",
      "mrp": "100.00",
      "subtotal": "450.00"
    }
  ]
}
```

**Important**: 
- ✓ Subtotal = 5 × 90.00 = 450.00 (using selling_rate)
- ✗ cost_price NOT included
- ✓ mrp included for reference only

---

## Frontend Implementation

### AddProductForm

**Three Price Fields**:
```jsx
<div className="lg:grid-cols-3">
  <input
    label="MRP (Maximum Retail Price)"
    value={batchForm.mrp}
    onChange={(e) => setBatchForm({...batchForm, mrp: e.target.value})}
    placeholder="100.00"
    required
  />
  
  <input
    label="Selling Rate (Billing Price)"
    value={batchForm.selling_rate}
    onChange={(e) => setBatchForm({...batchForm, selling_rate: e.target.value})}
    placeholder="90.00"
    required
  />
  
  <input
    label="Cost Price (Internal Reference)"
    value={batchForm.cost_price}
    onChange={(e) => setBatchForm({...batchForm, cost_price: e.target.value})}
    placeholder="70.00"
    required
  />
</div>
```

**Batch Display**:
```jsx
Batch: {batch.batch_number} - MRP ₹{batch.mrp} | Selling ₹{batch.selling_rate} | Cost ₹{batch.cost_price}
Qty: {batch.quantity} | Expires: {batch.expiry_date}
```

### ProductList

**Batch Details** (Expandable):
```jsx
{batch.batch_number}: MRP ₹{batch.mrp} | Selling ₹{batch.selling_rate} | Cost ₹{batch.cost_price}
Qty: {batch.quantity} | Expires: {batch.expiry_date}
```

### BillingForm

**Three Price Display**:
```jsx
<div>
  <label>Selling Rate (used for billing)</label>
  <input value={item.selling_rate} disabled className="bg-green-50" />
</div>

<div>
  <label>MRP (reference only)</label>
  <input value={item.mrp} disabled className="bg-gray-50 text-gray-500" />
</div>

{/* Cost price deliberately NOT shown */}
```

**Total Calculation**:
```jsx
// ✓ CORRECT
const subtotal = parseInt(item.quantity) * parseFloat(item.selling_rate);

// ✗ WRONG (removed)
const subtotal = parseInt(item.quantity) * parseFloat(item.mrp);
```

**Info Box**:
```jsx
<div className="bg-blue-50 p-4 rounded">
  ℹ️ Selling Rate (₹{item.selling_rate}) is used for all billing calculations.
     MRP (₹{item.mrp}) is shown for reference only.
     Cost Price is internal reference only.
</div>
```

---

## Backend Implementation

### Models

```python
# models.py

class Batch(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='batches')
    batch_number = models.CharField(max_length=100)
    
    mrp = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Maximum Retail Price (display only)"
    )
    selling_rate = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Selling Rate (USED FOR BILLING CALCULATIONS)"
    )
    cost_price = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Cost Price (internal reference only)"
    )
    
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'batch_number')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.batch_number} - {self.product.name} (MRP: ₹{self.mrp} | Selling: ₹{self.selling_rate})"


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    batch_number = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    
    selling_rate = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Selling Rate at time of invoice (USED FOR CALCULATIONS)"
    )
    mrp = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="MRP at time of invoice (for display only)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity} @ ₹{self.selling_rate}"
    
    def get_subtotal(self):
        """Calculate subtotal using ONLY selling_rate (not mrp)"""
        return self.quantity * self.selling_rate
```

### Serializers

```python
# serializers.py

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['batch_number', 'mrp', 'selling_rate', 'cost_price', 'quantity', 'expiry_date']


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'product_id', 'product_name', 'batch_number', 'quantity', 
                  'selling_rate', 'mrp', 'subtotal']
        read_only_fields = ['product_id', 'product_name']
    
    def get_subtotal(self, obj):
        """Calculate and return subtotal using ONLY selling_rate"""
        return str(obj.get_subtotal())


class InvoiceItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['product', 'batch_number', 'quantity', 'selling_rate', 'mrp']
    
    def validate(self, data):
        """Auto-fill prices from batch, validate batch exists"""
        product = data['product']
        batch_number = data['batch_number']
        quantity = data['quantity']
        
        try:
            batch = Batch.objects.get(product=product, batch_number=batch_number)
        except Batch.DoesNotExist:
            raise serializers.ValidationError(f"Batch {batch_number} not found")
        
        if batch.quantity < quantity:
            raise serializers.ValidationError(f"Insufficient quantity in batch")
        
        # Auto-fill selling_rate and mrp from batch
        data['selling_rate'] = batch.selling_rate
        data['mrp'] = batch.mrp
        
        return data
```

---

## Testing Checklist

### Unit Tests

- [ ] `test_batch_has_three_prices()` - Batch model stores all three prices independently
- [ ] `test_batch_prices_independent()` - Different batches don't overwrite each other's prices
- [ ] `test_invoice_item_subtotal_uses_selling_rate()` - Subtotal = quantity × selling_rate (NOT mrp)
- [ ] `test_invoice_item_cost_price_not_stored()` - InvoiceItem doesn't have cost_price field
- [ ] `test_invoice_total_calculation()` - Invoice total = sum of subtotals using selling_rate

### Integration Tests

- [ ] `test_product_creation_with_three_prices()` - CreateProductSerializer accepts all three prices
- [ ] `test_product_list_shows_all_prices()` - ProductSerializer includes all three prices
- [ ] `test_billing_auto_fills_both_prices()` - BillingForm auto-fills selling_rate AND mrp from batch
- [ ] `test_invoice_creation_saves_both_prices()` - InvoiceItem stores selling_rate and mrp
- [ ] `test_invoice_response_excludes_cost_price()` - API response doesn't include cost_price
- [ ] `test_invoice_subtotal_correct()` - Invoice response shows correct subtotal (using selling_rate)

### End-to-End Tests

- [ ] Create product with three prices ✓
- [ ] View product in inventory (all prices visible) ✓
- [ ] Create invoice selecting batch (prices auto-filled) ✓
- [ ] Verify invoice total calculated correctly ✓
- [ ] Download/view invoice PDF (shows only MRP and Selling Rate, not Cost Price)
- [ ] Verify cost price not visible in billing screens

### Frontend Tests

- [ ] AddProductForm accepts three price fields ✓
- [ ] AddProductForm validates all three prices required ✓
- [ ] ProductList displays all three prices in batch details ✓
- [ ] BillingForm shows Selling Rate (disabled) ✓
- [ ] BillingForm shows MRP (lighter, disabled) ✓
- [ ] BillingForm hides Cost Price ✓
- [ ] BillingForm total calculated using selling_rate ✓
- [ ] Invoice data includes both selling_rate and mrp ✓

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using MRP in Billing Calculations
```python
# WRONG - This will be incorrect if MRP ≠ Selling Rate
subtotal = quantity * mrp

# CORRECT
subtotal = quantity * selling_rate
```

### ❌ Mistake 2: Showing Cost Price in Invoice
```python
# WRONG - Cost price is confidential
{
  "items": [{
    "quantity": 5,
    "selling_rate": 90,
    "mrp": 100,
    "cost_price": 70  # ✗ NEVER SHOW
  }]
}

# CORRECT
{
  "items": [{
    "quantity": 5,
    "selling_rate": 90,
    "mrp": 100
    # cost_price omitted
  }]
}
```

### ❌ Mistake 3: Overwriting Batch Prices
```python
# WRONG - This overwrites existing batch prices
product.batches.all().update(mrp=new_price)

# CORRECT - Each batch keeps independent prices
batch = Batch.objects.get(id=batch_id)
batch.mrp = new_price
batch.save()
```

### ❌ Mistake 4: Not Storing Prices at Invoice Time
```python
# WRONG - Prices change over time, invoice should record prices at creation time
class InvoiceItem(models.Model):
    batch = ForeignKey(Batch)  # If batch price changes, invoice is wrong!

# CORRECT - Store prices as they were when invoice created
class InvoiceItem(models.Model):
    batch_number = CharField()  # Reference only
    selling_rate = DecimalField()  # Actual price used
    mrp = DecimalField()  # Reference price shown
```

---

## Profit Analysis (Future Feature)

Once the three-price model is fully implemented, the following profit analysis features become possible:

```python
# Per-batch profit analysis
profit_per_unit = selling_rate - cost_price
total_profit = profit_per_unit * quantity
profit_margin = (profit_per_unit / selling_rate) * 100

# Example
batch = Batch.objects.get(batch_number="LOT-2024-001")
profit_per_unit = 90.00 - 70.00  # ₹20
total_profit = 20 * 100  # ₹2000 for 100 units
profit_margin = (20 / 90) * 100  # 22.2%
```

Profit analysis dashboard features:
- Profit by batch
- Profit by product
- Profit by date range
- Top-profit products
- Margin trends over time
- Cost vs. selling rate comparison

---

## Summary

The three-price model provides:

| Aspect | Benefit |
|--------|---------|
| **MRP** | Transparency in retail pricing, allows discounts |
| **Selling Rate** | Flexibility in pricing, audit trail of actual prices charged |
| **Cost Price** | Profit analysis, business intelligence, confidential pricing |
| **Independent Prices per Batch** | Realistic inventory (costs change over time) |
| **Price at Invoice Time** | Accurate audit trail even if prices later change |

This model supports both simple fixed-price retail and complex pricing strategies with bulk discounts, seasonal pricing, and cost analysis.

---

## References

- [BATCH_MANAGEMENT.md](BATCH_MANAGEMENT.md) - Batch management UI behavior
- [API_CONTRACTS.md](frontend/API_CONTRACTS.md) - API endpoint specifications  
- [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) - Backend implementation details
- [AddProductForm.jsx](frontend/src/components/Product/AddProductForm.jsx) - Product creation UI
- [BillingForm.jsx](frontend/src/components/Billing/BillingForm.jsx) - Invoice creation UI
- [ProductList.jsx](frontend/src/components/Product/ProductList.jsx) - Product inventory UI
