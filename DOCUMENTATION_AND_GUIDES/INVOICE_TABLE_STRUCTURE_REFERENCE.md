# Invoice Layout - Exact Table Structure Reference

## Complete Visual Reference

This document shows the exact table layouts used in the redesigned invoice.

---

## SECTION 1: HEADER TABLE (3-Column Layout)

### HTML Structure
```jsx
<table className="header-table">
  <tbody>
    <tr>
      {/* LEFT COLUMN - 40% */}
      <td className="header-left">
        <div className="shop-name">{shop.shop_name}</div>
        <div className="shop-address">
          {shop.address && <div>{shop.address}</div>}
          {shop.phone && <div>Ph: {shop.phone}</div>}
          {shop.dl_number && <div>DL: {shop.dl_number}</div>}
          {shop.gst_number && <div>GSTIN: {shop.gst_number}</div>}
        </div>
      </td>

      {/* CENTER COLUMN - 20% */}
      <td className="header-center">
        <div className="tax-invoice-title">TAX INVOICE</div>
      </td>

      {/* RIGHT COLUMN - 40% */}
      <td className="header-right">
        <table className="invoice-meta-table">
          <tbody>
            <tr>
              <td className="meta-label">Invoice No:</td>
              <td className="meta-value">{invoice.id}</td>
            </tr>
            <tr>
              <td className="meta-label">Date:</td>
              <td className="meta-value">{dateStr}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
```

### Visual Rendering
```
┌─────────────────────────────────────────────────────────┐
│ (40%)                    (20%)           (40%)          │
│                                                         │
│ MEDICAL STORE INC      TAX INVOICE     Invoice No: 1   │
│ 123 Main Street                        Date: 26/01/26  │
│ Ph: +91-9876543210                                      │
│ DL: DL-123-456                                          │
│ GSTIN: 27AABBS1234A1Z0                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### CSS Styling
```css
.header-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}

.header-table td {
  border: 1px solid #333;
  padding: 6px 8px;
  vertical-align: top;
}

.header-left {
  width: 40%;
}

.header-center {
  width: 20%;
  text-align: center;
}

.header-right {
  width: 40%;
  text-align: right;
}

.shop-name {
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 3px;
}

.tax-invoice-title {
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 1px;
}
```

---

## SECTION 2: CUSTOMER DETAILS TABLE

### HTML Structure
```jsx
<table className="customer-table">
  <tbody>
    <tr>
      <td className="customer-label">Bill To:</td>
      <td className="customer-name">{invoice.customer_name}</td>
    </tr>
    {invoice.customer_phone && (
      <tr>
        <td className="customer-label">Phone:</td>
        <td className="customer-value">{invoice.customer_phone}</td>
      </tr>
    )}
    {invoice.buyer_gstin && (
      <tr>
        <td className="customer-label">GSTIN:</td>
        <td className="customer-value">{invoice.buyer_gstin}</td>
      </tr>
    )}
  </tbody>
</table>
```

### Visual Rendering
```
┌──────────────┬───────────────────────────────┐
│ Bill To:     │ John Doe                      │
├──────────────┼───────────────────────────────┤
│ Phone:       │ +91-9876543210                │
├──────────────┼───────────────────────────────┤
│ GSTIN:       │ 27AABBS1234A1Z0               │
└──────────────┴───────────────────────────────┘
```

### CSS Styling
```css
.customer-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #333;
  margin-bottom: 8px;
}

.customer-table td {
  padding: 4px 6px;
  border-right: 1px solid #ccc;
}

.customer-table td:last-child {
  border-right: none;
}

.customer-table tbody tr {
  border-bottom: 1px solid #333;
}

.customer-label {
  font-weight: bold;
  width: 20%;
}

.customer-name {
  font-weight: bold;
  width: 80%;
}

.customer-value {
  width: 80%;
}
```

---

## SECTION 3: ITEMS TABLE (Medical Standard - 9 Columns)

### HTML Structure
```jsx
<table className="items-table">
  <thead>
    <tr className="items-header">
      <th className="col-sno">S.No</th>
      <th className="col-product">Product Name</th>
      <th className="col-batch">Batch #</th>
      <th className="col-expiry">Expiry</th>
      <th className="col-hsn">HSN</th>
      <th className="col-qty">Qty</th>
      <th className="col-mrp">MRP</th>
      <th className="col-rate">Rate</th>
      <th className="col-amount">Amount</th>
    </tr>
  </thead>
  <tbody>
    {invoice.items.map((item, i) => (
      <tr key={i} className="items-row">
        <td className="col-sno">{i + 1}</td>
        <td className="col-product">{item.product_name}</td>
        <td className="col-batch">{item.batch_number || '—'}</td>
        <td className="col-expiry">
          {item.expiry_date ? 
            new Date(item.expiry_date).toLocaleDateString('en-IN', 
              { month: '2-digit', year: '2-digit' }) 
            : '—'
          }
        </td>
        <td className="col-hsn">{item.hsn_code || '—'}</td>
        <td className="col-qty text-right">{item.quantity}</td>
        <td className="col-mrp text-right">₹{parseFloat(item.mrp).toFixed(2)}</td>
        <td className="col-rate text-right">₹{parseFloat(item.selling_rate).toFixed(2)}</td>
        <td className="col-amount text-right">₹{parseFloat(item.subtotal).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Visual Rendering
```
┌─────┬──────────────┬───────┬────────┬──────┬─────┬─────────┬────────┬─────────┐
│S.No │ Product Name │ Batch │ Expiry │ HSN  │ Qty │   MRP   │  Rate  │ Amount  │
├─────┼──────────────┼───────┼────────┼──────┼─────┼─────────┼────────┼─────────┤
│  1  │Aspirin 500mg │ B001  │ 03/26  │3001  │ 10  │ ₹10.00  │ ₹8.00  │ ₹80.00  │
├─────┼──────────────┼───────┼────────┼──────┼─────┼─────────┼────────┼─────────┤
│  2  │Paracetamol   │ B002  │ 06/26  │3001  │ 20  │ ₹12.00  │₹10.00  │₹200.00  │
├─────┼──────────────┼───────┼────────┼──────┼─────┼─────────┼────────┼─────────┤
│  3  │Ibuprofen 200 │ B003  │ 05/26  │3002  │  5  │ ₹25.00  │₹20.00  │₹100.00  │
└─────┴──────────────┴───────┴────────┴──────┴─────┴─────────┴────────┴─────────┘
```

### Column Width Distribution
```
Total usable width for Half-A4 (148mm) = 132mm (148mm - 16mm padding)

Widths (percentage-based, responsive):
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  5%      │   25%    │   10%    │   10%    │   8%     │   7%     │   10%    │   10%    │   10%    │
│ S.No     │ Product  │ Batch    │ Expiry   │ HSN      │ Qty      │ MRP      │ Rate     │ Amount   │
│ (5-7mm)  │ (30-40mm)│ (12-15mm)│ (12-15mm)│ (10-12mm)│ (8-10mm) │ (12-15mm)│ (12-15mm)│ (12-15mm)│
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### CSS Styling
```css
.items-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  margin-bottom: 8px;
}

.items-header {
  background: #f5f5f5;
  border-bottom: 2px solid #000;
}

.items-header th {
  padding: 4px 3px;
  text-align: center;
  border: 1px solid #000;
  font-weight: bold;
  font-size: 10px;
}

.items-table td {
  padding: 3px 4px;
  border: 1px solid #000;
  text-align: center;
  font-size: 10px;
}

.items-table tbody tr:last-child {
  border-bottom: 2px solid #000;
}

/* Column-specific widths */
.col-sno { width: 5%; }
.col-product { width: 25%; text-align: left; }
.col-batch { width: 10%; }
.col-expiry { width: 10%; font-size: 9px; }
.col-hsn { width: 8%; }
.col-qty { width: 7%; }
.col-mrp { width: 10%; }
.col-rate { width: 10%; }
.col-amount { width: 10%; font-weight: bold; }

.text-right {
  text-align: right !important;
}
```

---

## SECTION 4: SUMMARY TABLE (Right-Aligned)

### HTML Structure
```jsx
<div className="summary-wrapper">
  <table className="summary-table">
    <tbody>
      <tr className="summary-row">
        <td className="summary-label">Subtotal:</td>
        <td className="summary-value">₹{subtotal.toFixed(2)}</td>
      </tr>

      {discountAmount > 0 && (
        <tr className="summary-row">
          <td className="summary-label">Discount:</td>
          <td className="summary-value discount-value">-₹{discountAmount.toFixed(2)}</td>
        </tr>
      )}

      <tr className="summary-row">
        <td className="summary-label">Taxable Amount:</td>
        <td className="summary-value">₹{taxableAmount.toFixed(2)}</td>
      </tr>

      {cgstAmount > 0 && (
        <tr className="summary-row">
          <td className="summary-label">CGST (9%):</td>
          <td className="summary-value">₹{cgstAmount.toFixed(2)}</td>
        </tr>
      )}

      {sgstAmount > 0 && (
        <tr className="summary-row">
          <td className="summary-label">SGST (9%):</td>
          <td className="summary-value">₹{sgstAmount.toFixed(2)}</td>
        </tr>
      )}

      <tr className="summary-total">
        <td className="summary-label-total">GRAND TOTAL:</td>
        <td className="summary-value-total">₹{grandTotal.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Visual Rendering (Right-aligned on page)
```
                              ┌──────────────┬─────────────┐
                              │ Subtotal:    │   ₹380.00   │
                              ├──────────────┼─────────────┤
                              │ Discount:    │   -₹38.00   │
                              ├──────────────┼─────────────┤
                              │ Taxable Amt: │   ₹342.00   │
                              ├──────────────┼─────────────┤
                              │ CGST (9%):   │   ₹30.78    │
                              ├──────────────┼─────────────┤
                              │ SGST (9%):   │   ₹30.78    │
                              ├══════════════╪═════════════┤
                              │GRAND TOTAL:  │   ₹403.56   │
                              └──────────────┴─────────────┘
```

### CSS Styling
```css
.summary-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.summary-table {
  width: 280px;
  border-collapse: collapse;
  border: 1px solid #000;
}

.summary-row {
  border-bottom: 1px solid #ccc;
}

.summary-total {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
  background: #f9f9f9;
}

.summary-table td {
  padding: 4px 6px;
  font-size: 10px;
}

.summary-label {
  font-weight: normal;
  text-align: left;
  width: 60%;
}

.summary-value {
  text-align: right;
  width: 40%;
  font-family: 'Courier New', monospace;
}

.discount-value {
  color: #d32f2f;
}

.summary-label-total {
  font-weight: bold;
  text-align: left;
  width: 60%;
  font-size: 11px;
}

.summary-value-total {
  text-align: right;
  width: 40%;
  font-weight: bold;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}
```

---

## SECTION 5: AMOUNT IN WORDS

### HTML Structure
```jsx
<div className="amount-in-words">
  <strong>Amount in Words:</strong> {amountInWords}
</div>
```

### Visual Rendering
```
┌────────────────────────────────────────────────────────┐
│ Amount in Words: Three Hundred Eighty-Three Rupees     │
│                 Fifty-Six Paise Only                   │
└────────────────────────────────────────────────────────┘
```

### CSS Styling
```css
.amount-in-words {
  border: 1px solid #000;
  padding: 4px 6px;
  margin-bottom: 8px;
  font-size: 10px;
  line-height: 1.4;
}
```

---

## SECTION 6: FOOTER DECLARATIONS

### HTML Structure
```jsx
<div className="footer-declarations">
  <p>• Goods once sold will not be taken back or exchanged.</p>
  <p>• Please check product carefully before leaving store.</p>
</div>
```

### Visual Rendering
```
• Goods once sold will not be taken back or exchanged.
• Please check product carefully before leaving store.
```

### CSS Styling
```css
.footer-declarations {
  font-size: 9px;
  line-height: 1.4;
  margin-bottom: 6px;
  padding: 0 4px;
}

.footer-declarations p {
  margin: 2px 0;
}
```

---

## SECTION 7: SIGNATURE TABLE

### HTML Structure
```jsx
<table className="signature-table">
  <tbody>
    <tr>
      <td className="sig-cell">
        <div className="sig-space"></div>
        <div className="sig-label">For {shop.shop_name || shop.name}</div>
        <div className="sig-label">Authorized Signatory</div>
      </td>
      <td className="sig-cell">
        <div className="sig-space"></div>
        <div className="sig-label">Customer Signature</div>
      </td>
    </tr>
  </tbody>
</table>
```

### Visual Rendering
```
┌────────────────────────┬────────────────────────┐
│                        │                        │
│  ─────────────────────  ─────────────────────── │
│  For Medical Store Inc  Customer Signature      │
│  Authorized Signatory   │                        │
└────────────────────────┴────────────────────────┘
```

### CSS Styling
```css
.signature-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 4px;
}

.sig-cell {
  width: 50%;
  text-align: center;
  padding: 2px 4px;
  font-size: 10px;
  vertical-align: top;
}

.sig-space {
  height: 30px;
  border-bottom: 1px solid #000;
  margin-bottom: 2px;
}

.sig-label {
  font-size: 9px;
  margin: 2px 0;
}
```

---

## FOOTER TEXT

### HTML Structure
```jsx
<p className="footer-text">Thank you for your business!</p>
```

### Visual Rendering
```
                Thank you for your business!
```

### CSS Styling
```css
.footer-text {
  text-align: center;
  font-size: 10px;
  margin-top: 4px;
  margin-bottom: 0;
}
```

---

## Complete Page Layout (Combined View)

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  MEDICAL STORE INC             TAX INVOICE        Invoice #1  │
│  123 Main Street, City                            Date:26/01  │
│  Ph: +91-9876543210                                           │
│  DL: DL-123-456                                                │
│  GSTIN: 27AABBS1234A1Z0                                        │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ Bill To: John Doe                                            │
│ Phone: +91-9876543210                                         │
│ GSTIN: 27AABBS1234A1Z0                                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌──┬─────────────────┬───────┬────────┬──────┬─────┬───┬───┬──┐
│ │S#│ Product         │ Batch │ Expiry │ HSN  │ Qty │MRP│Rt │Am│
│ ├──┼─────────────────┼───────┼────────┼──────┼─────┼───┼───┼──┤
│ │1 │ Aspirin 500mg   │ B001  │ 03/26  │3001  │ 10  │10 │ 8 │80│
│ │2 │ Paracetamol     │ B002  │ 06/26  │3001  │ 20  │12 │10 │20│
│ │3 │ Ibuprofen 200   │ B003  │ 05/26  │3002  │  5  │25 │20 │10│
│ └──┴─────────────────┴───────┴────────┴──────┴─────┴───┴───┴──┘
│                                        Subtotal    ₹380.00
│                                        Discount    -₹38.00
│                                        Taxable     ₹342.00
│                                        CGST(9%)    ₹30.78
│                                        SGST(9%)    ₹30.78
│                                        TOTAL       ₹403.56
│
│ Amount in Words: Three Hundred Eighty-Three Rupees Fifty-Six Only
│
│ • Goods once sold will not be taken back or exchanged.
│ • Please check product carefully before leaving store.
│
│                    (space)                     (space)
│             ─────────────────────       ──────────────────
│          For Medical Store Inc          Customer Signature
│          Authorized Signatory
│
│          Thank you for your business!
│
└──────────────────────────────────────────────────────────────┘
```

---

## Print View Specifications

### Paper Size
- **Format**: Half-A4 (Landscape)
- **Width**: 148mm
- **Height**: 210mm
- **Margins**: 8mm on all sides
- **Usable Area**: 132mm × 194mm

### Font Sizes (Print)
- **Shop Name**: 13px (bold)
- **Section Headers**: 11-12px
- **Table Headers**: 10px (bold)
- **Table Data**: 10px (body), 9px (small text)
- **Labels**: 9-10px
- **Grand Total**: 12px (bold)
- **Footer**: 9-10px

### Spacing (Print)
- **Between Sections**: 8px
- **Cell Padding**: 3-4px
- **Row Height**: Auto (minimum 12px for visibility)
- **Signature Space**: 30px (height with bottom border)

---

## Media Query Breakpoints

```css
/* SCREEN VIEW */
@media screen {
  .invoice-print {
    width: 148mm;
    margin: 20px auto;
    font-size: 11px;
  }
}

/* PRINT VIEW */
@media print {
  .invoice-print {
    width: 148mm;
    margin: 0;
    padding: 8mm;
    font-size: 8-10px;
  }

  .invoice-control-bar {
    display: none !important;
  }

  @page {
    size: 148mm 210mm;
    margin: 4mm;
  }
}
```

---

## Testing the Layout

### Visual Checklist
- ✅ Header table: 3 columns aligned
- ✅ Customer table: 2 columns with labels
- ✅ Items table: 9 columns with borders
- ✅ Summary table: Right-aligned, bold total
- ✅ All text readable (not too small)
- ✅ All borders visible
- ✅ No overflow or text wrapping

### Alignment Checklist
- ✅ Shop name left-aligned
- ✅ TAX INVOICE centered
- ✅ Invoice # date right-aligned
- ✅ Product names left-aligned
- ✅ Numbers right-aligned
- ✅ Summary table right edge aligned
- ✅ Signature boxes centered

### Print Checklist
- ✅ Control bar hidden
- ✅ Invoice full-width
- ✅ No blank pages
- ✅ All content visible
- ✅ Borders print correctly
- ✅ Black text visible
- ✅ No color/shadow issues

---

## Quick Reference

| Element | Width | Height | Font Size |
|---------|-------|--------|-----------|
| Shop Name | 40% | auto | 13px bold |
| Tax Invoice | 20% | auto | 16px bold |
| Invoice Meta | 40% | auto | 10px |
| Items Table | 100% | auto | 10px |
| Summary Table | 280px | auto | 10px |
| Signature Space | 50% | 30px | 9px |
| Footer Text | 100% | auto | 10px |

---

## Export to PDF (Future)

If you need to generate PDFs from this invoice:

```javascript
// Using html2pdf library
const element = document.querySelector('.invoice-print');
const opt = {
  margin: 8,
  filename: `invoice_${invoiceId}.pdf`,
  image: { type: 'png', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { format: 'a4', orientation: 'portrait' }
};
html2pdf().set(opt).save();
```

The professional table structure makes PDF generation straightforward and produces professional documents.

