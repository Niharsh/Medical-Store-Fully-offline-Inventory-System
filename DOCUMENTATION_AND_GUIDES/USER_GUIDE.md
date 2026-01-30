# 📚 USER GUIDE - Medical Store Inventory & Billing System

**For**: Store Owner/Operator  
**Status**: ✅ Ready to Use  
**Version**: 1.0

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Inventory Management](#inventory-management)
3. [Creating Invoices (Bills)](#creating-invoices-bills)
4. [Managing Your Business](#managing-your-business)
5. [Tips & Best Practices](#tips--best-practices)
6. [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### Starting the System

You need to start two things:

**Step 1: Open Terminal / Command Prompt**

**Step 2: Start Backend** (Open one terminal)
```
cd Desktop/Inventory/backend
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

Leave this running.

**Step 3: Start Frontend** (Open another terminal)
```
cd Desktop/Inventory/frontend
npm run dev
```

You should see:
```
VITE v7.3.1 ready in 195 ms
Local: http://localhost:5173
```

**Step 4: Open in Browser**

Click this link: [http://localhost:5173](http://localhost:5173)

**Or**:
1. Open any web browser (Chrome, Firefox, Safari, Edge)
2. Type in address bar: `http://localhost:5173`
3. Press Enter

### First Time Setup

The system comes with **5 sample products** pre-loaded:
- Aspirin 500mg (Tablets)
- Cough Syrup
- Vitamin C Powder (Sachets)
- Antiseptic Cream
- Baby Diapers (Size M)

You can:
- Delete these and add your own products
- Or keep them as examples while adding more

---

## Inventory Management

### Tab 1: INVENTORY (Manage Your Products)

#### View Products

When you click the **Inventory** tab, you see a table of all your products:

```
┌─────────────────────────────────────┬──────────┬────────┬───────────────┐
│ Product Name                         │ Type     │ Qty    │ Price Range   │
├─────────────────────────────────────┼──────────┼────────┼───────────────┤
│ Aspirin 500mg                        │ Tablet   │ 250    │ ₹25-26        │
├─────────────────────────────────────┼──────────┼────────┼───────────────┤
│ Cough Syrup                          │ Syrup    │ 80     │ ₹145-150      │
└─────────────────────────────────────┴──────────┴────────┴───────────────┘
```

**What Each Column Means**:
- **Product Name**: Name of the product in your store
- **Type**: Category (Tablet, Syrup, Powder, Cream, Diaper, Condom, Sachet, or custom)
- **Qty**: Total quantity in stock (sum of all batches)
- **Price Range**: Lowest to highest MRP (for display/reference)

**View Batch Details**:
- Click the **arrow icon** (▼) next to a product name
- See all batches of that product:
  ```
  ┌──────────────┬────────┬───────┬──────────┬────────┐
  │ Batch Number │ MRP    │ Qty   │ Cost     │ Expiry │
  ├──────────────┼────────┼───────┼──────────┼────────┤
  │ LOT-2024-001 │ ₹30.00 │ 100   │ ₹18.00   │ 2026-  │
  ├──────────────┼────────┼───────┼──────────┼────────┤
  │ LOT-2024-002 │ ₹30.00 │ 150   │ ₹20.00   │ 2027-  │
  └──────────────┴────────┴───────┴──────────┴────────┘
  ```

#### Add a New Product

**Step 1**: Click the **"Add Product"** button (top of Inventory page)

**Step 2**: Fill in the product details:

| Field | What to Enter | Example |
|-------|---------------|---------|
| Product Name | Name of the medicine/product | "Aspirin 500mg" |
| Product Type | Category (use dropdown) | Tablet, Syrup, Powder, etc. |
| Generic Name | Generic/chemical name | "Acetylsalicylic Acid" |
| Manufacturer | Company name | "Pharma Ltd" |
| Salt Composition | Active ingredient + dose | "Paracetamol 500mg" |
| Description | Additional info | "Pain reliever and fever reducer" |

**Step 3**: Add batch details:

Click **"Add Batch"** for each batch of this product

| Field | What to Enter | Example | Why? |
|-------|---------------|---------|------|
| Batch Number | Manufacturer's lot number | "LOT-2024-001" | Track inventory per batch |
| MRP | Price printed on product | "₹30.00" | For display/reference only |
| Selling Rate | Price you sell at | "₹25.00" | **Used for billing** |
| Cost Price | Price you bought at | "₹18.00" | Internal reference only |
| Quantity | How many units | "100" | Stock available |
| Expiry Date | When it expires | "2026-12-31" | FIFO tracking |

**Example - Adding Aspirin**:

```
Product Name: Aspirin 500mg
Type: Tablet
Generic: Acetylsalicylic Acid
Manufacturer: Pharma Ltd
Salt: Paracetamol 500mg
Description: Pain reliever

Batch 1:
  Number: LOT-2024-001
  MRP: ₹30.00
  Selling: ₹25.00
  Cost: ₹18.00
  Qty: 100
  Expiry: 2026-12-31

Batch 2:
  Number: LOT-2024-002
  MRP: ₹30.00
  Selling: ₹25.00
  Cost: ₹18.00
  Qty: 150
  Expiry: 2027-06-30
```

**Step 4**: Click **"Save Product"**

✅ Product added! It appears in the table.

#### Edit a Product

Click the **Edit button** (pencil icon) on any product row.

⚠️ **Note**: Full edit UI may not be visible yet. You can edit via:
1. Django Admin: http://localhost:8000/admin/
   - Login: `admin` / `admin123`
   - Navigate to Products
2. Or add a new batch instead of editing existing ones

#### Delete a Product

Click the **Delete button** (trash icon) on any product row.

A confirmation dialog will ask:
```
Delete product "Aspirin 500mg"?
This action cannot be undone.

[Cancel] [Delete]
```

⚠️ **Warning**: Deletion is permanent! It removes:
- The product
- All its batches
- All inventory records

✅ **Tip**: Consider deleting only test data. For real products, it's better to:
- Set quantity to 0 (mark as out of stock)
- Keep the record for history

---

## Creating Invoices (Bills)

### Tab 2: BILLING (Create & View Invoices)

#### Create an Invoice (Bill)

**Step 1**: Click the **Billing** tab

**Step 2**: Fill in customer details:

| Field | What to Enter | Example | Required? |
|-------|---------------|---------|-----------|
| Customer Name | Who is buying | "Mr. John Doe" | ✅ YES |
| Phone | Customer's phone | "9876543210" | ❌ Optional |
| Notes | Any special info | "Regular customer" | ❌ Optional |

**Step 3**: Click **"Add Item"** to add products to the bill

**Step 4**: For each item:

1. **Select Product** from dropdown
   - List shows all products in stock
   - Auto-fills: first batch, prices, MRP

2. **Select Batch** (if multiple batches)
   - Shows: Batch number, expiry date
   - Auto-fills: selling price for that batch

3. **Enter Quantity**
   - How many units to sell
   - Must be ≤ available quantity

4. **Selling Rate** (Optional)
   - Pre-filled with batch selling rate
   - You can override for that sale
   - Default: Batch selling rate

5. **Review Auto-Filled Fields**:
   - MRP: Reference price (for customer reference)
   - Selling Rate: Price used for calculation
   - Subtotal: Qty × Selling Rate (calculated)

**Example Invoice**:

```
Customer: Mr. John Doe
Phone: 9876543210
Notes: Regular customer

Item 1:
  Product: Aspirin 500mg
  Batch: LOT-2024-001
  Quantity: 5
  Selling Rate: ₹25.00 (or override to ₹24.00)
  Subtotal: ₹125.00

Item 2:
  Product: Cough Syrup
  Batch: SYR-2024-001
  Quantity: 2
  Selling Rate: ₹145.00
  Subtotal: ₹290.00

─────────────────────────────────
INVOICE TOTAL: ₹415.00
```

**Step 5**: Review the bill and click **"Create Invoice"**

**Result**:
- ✅ Invoice created and saved
- ✅ Inventory automatically reduced:
  - Aspirin batch: 100 - 5 = 95 units left
  - Cough Syrup batch: 80 - 2 = 78 units left
- ✅ Form clears for next invoice
- ✅ Invoice appears in history below

#### View Invoice History

Scroll down on Billing tab to see **"Invoice History"** table:

```
┌─────┬────────┬──────────────┬────────┬───────────┐
│ #   │ Date   │ Customer     │ Amount │ Status    │
├─────┼────────┼──────────────┼────────┼───────────┤
│ 1   │ 21-Jan │ John Doe     │ ₹415   │ Unpaid    │
├─────┼────────┼──────────────┼────────┼───────────┤
│ 2   │ 20-Jan │ Jane Smith   │ ₹892   │ Paid      │
└─────┴────────┴──────────────┴────────┴───────────┘
```

**Click on invoice** to see details:
```
Invoice #1
Date: 21-Jan-2026
Customer: John Doe
Phone: 9876543210
Notes: Regular customer

Items:
  - Aspirin 500mg (LOT-2024-001): 5 × ₹25.00 = ₹125.00
  - Cough Syrup (SYR-2024-001): 2 × ₹145.00 = ₹290.00

Total: ₹415.00
Status: Unpaid → Partial → Paid (track payment)
```

---

## Managing Your Business

### Understanding the Three Prices

Every product has **3 prices** to help you manage profit:

| Price | Full Name | Purpose | Who Sees? | Used For |
|-------|-----------|---------|-----------|----------|
| **MRP** | Maximum Retail Price | Reference / recommended price | Customer (displayed) | Display only |
| **Selling Rate** | Your selling price | Price customer pays | **Customer pays this** | ✅ Billing calculation |
| **Cost Price** | Your purchase cost | What you paid wholesaler | Internal only | Profit margin |

**Example**:
```
Product: Aspirin 500mg
MRP: ₹30.00 (What box says, for customer reference)
Selling Rate: ₹25.00 (What customer pays)
Cost Price: ₹18.00 (What you paid, internal tracking)

Profit per unit: ₹25.00 - ₹18.00 = ₹7.00
```

### Batch Management

A **batch** is a group of the same product from the same manufacturer lot.

**Why batches?**
- Different batches have different prices
- Different batches expire at different times
- Track which batch you sold (for recalls, complaints)

**Multiple batches of one product**:
```
Product: Aspirin 500mg (same product, 2 batches)

Batch 1: LOT-2024-001
  MRP: ₹30.00, Selling: ₹25.00, Cost: ₹18.00, Qty: 100, Expiry: 2026-12-31

Batch 2: LOT-2024-002
  MRP: ₹30.00, Selling: ₹25.00, Cost: ₹18.00, Qty: 150, Expiry: 2027-06-30

Total: 250 units available
```

**When billing**: You can pick which batch to sell from.

**Best practice**: Sell older batches first (FIFO = First In, First Out)

### Inventory Tracking

**After Each Invoice**:
- System automatically reduces inventory
- Sold units are removed from that batch
- You cannot sell more than available

**Example**:
```
Before: Aspirin batch has 100 units
Invoice: Sell 5 units
After: Aspirin batch has 95 units
```

**Stock Alert**:
- If a batch falls to 0 units, you can't sell it anymore
- To check low stock: Look at Qty column in Inventory tab

---

## Tips & Best Practices

### ✅ DO

1. **Organize by Batch**
   - Keep each physical batch separate
   - Use batch numbers consistently
   - Label shelves with batch numbers for quick reference

2. **Enter Correct Expiry Dates**
   - Check product packaging for manufacturing/expiry dates
   - Enter expiry dates in YYYY-MM-DD format
   - System helps track expiring stock

3. **Use Realistic Prices**
   - MRP: What's printed on product
   - Selling: Your actual selling price
   - Cost: What you paid to wholesaler
   - Helps calculate profit accurately

4. **Review Invoices Regularly**
   - Check daily/weekly sales
   - Identify best-selling products
   - Plan purchases based on sales trends

5. **Keep Information Updated**
   - Update product names if packaging changes
   - Add notes for special products
   - Remove products that are discontinued

6. **Use Customer Phone Numbers**
   - Helps you identify regular customers
   - Can follow up on feedback
   - Track customer preferences

### ❌ DON'T

1. **Don't delete old invoices**
   - Keep them for financial records
   - You cannot undo deletion
   - Better to use archive feature (if added)

2. **Don't change selling rates retroactively**
   - Once invoice created, those prices are locked
   - Future invoices use new rates
   - This is correct for business records

3. **Don't delete products without reason**
   - If product is out of stock, set quantity to 0
   - Keep old products for history
   - Only delete test data or mistakes

4. **Don't forget to check expiry dates**
   - System doesn't warn about expiring stock (yet)
   - Manually check "Expiry" column in batch details
   - Remove expired stock promptly

5. **Don't close the system without saving**
   - All data is saved immediately (auto-save)
   - You cannot lose data by closing browser
   - But always complete invoices before closing

---

## Frequently Asked Questions

### Q1: How do I start the system?

**A**: Open two terminals and run:
```
Terminal 1: cd backend && python manage.py runserver
Terminal 2: cd frontend && npm run dev
Open browser: http://localhost:5173
```

### Q2: I closed the terminal. How do I start again?

**A**: Same as above. You need to keep both terminals running while using the system.

### Q3: Can I use this on my phone/mobile?

**A**: Not yet. It's designed for desktop/laptop browser. Mobile support can be added in future.

### Q4: I accidentally deleted a product. Can I undo it?

**A**: Unfortunately, no. Deletion is permanent. To prevent this:
- Be careful with Delete button
- Consider "soft delete" in future (mark as inactive instead)
- Keep backups of database

### Q5: Why do I need to enter selling rate during billing if it's already in the batch?

**A**: Because you might want different prices for different customers:
- Bulk discounts: charge less for large quantities
- Special offers: reduce price for a customer
- Profit margins: sometimes override based on competition

### Q6: Can I edit an invoice after creating it?

**A**: Currently, no. To correct an invoice:
1. Delete it (reverts inventory)
2. Create a new invoice with correct details

Better approach: Be careful when creating invoices. Double-check before submitting.

### Q7: How do I track payment from customers?

**A**: Each invoice has a payment status:
- **Unpaid**: No payment received
- **Partial**: Part of amount received
- **Paid**: Full amount received

You can update this manually. Future version may add payment tracking details (amount paid, dates, etc.).

### Q8: The system shows old quantities. How do I refresh?

**A**: Click on the **Inventory** tab (or any other tab and back). This refreshes the product list from the server.

### Q9: Where is my data stored?

**A**: In a file called `db.sqlite3` in the `backend/` folder.

**Backup important data**:
```
Copy: backend/db.sqlite3
To: somewhere safe (external drive, cloud, etc.)
```

### Q10: Can I add custom product types?

**A**: Yes! The system supports any product type:
- Default types: Tablet, Syrup, Powder, Cream, Diaper, Condom, Sachet
- Custom types: Injection, Gel, Liquid, Oil, Spray, etc.

When adding a product, you can type any product type in the dropdown.

### Q11: What if I sell out of a product?

**A**: 
1. The Qty becomes 0
2. You cannot create an invoice with that product
3. To sell it again, add a new batch

### Q12: How do I manage payment status?

**A**: Each invoice can be marked as:
- Unpaid (default when created)
- Partial (some payment received)
- Paid (full payment received)

This is for tracking only. It doesn't affect inventory or calculations.

### Q13: Can I export invoices as PDF?

**A**: Not yet. Current version is digital-only. You can:
- Take screenshot
- Print using browser (Ctrl+P)
- View in browser history

PDF export can be added in future versions.

### Q14: How long does my data stay?

**A**: As long as you keep the `backend/db.sqlite3` file:
- If you delete the file: all data is lost
- If you backup the file: data is preserved
- Data persists across program restarts

### Q15: Is this secure? Can someone hack it?

**A**: 
- Current version: Not encrypted, runs locally
- Safe for: Single user, office network only
- If you want: Can add password protection, SSL, etc.

This is fine for small store use. For larger/public deployment, security upgrades needed.

---

## Need Help?

### Common Issues

**System won't start**:
- Both terminals running?
- Are you in the right folders?
- Check for error messages in terminal

**Products not showing**:
- Backend running? Check Terminal 1
- Try refreshing page (Ctrl+R or F5)
- Check DevTools Console for errors (F12)

**Invoice creation fails**:
- Enough quantity available?
- All fields filled in correctly?
- Check error message in red box

**Forgot customer name**:
- It's required! You must enter it
- Phone is optional, notes are optional

---

## Tips for Daily Use

1. **End of day**: Review total sales from Invoice History
2. **Weekly**: Check low-stock products
3. **Monthly**: Backup your database file
4. **Quarterly**: Review profit margins (selling rate vs cost price)
5. **Yearly**: Archive old invoices (if feature added)

---

**System Status**: ✅ Ready to Use  
**Version**: 1.0  
**Last Updated**: January 21, 2026

For technical issues, contact your system administrator.
