import React, { useState } from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import { useProducts } from '../../context/ProductContext';
import ErrorAlert from '../Common/ErrorAlert';

const BillingForm = ({ onBillingComplete }) => {
  const { createInvoice, error: invoiceError } = useInvoices();
  const { products } = useProducts();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [billItems, setBillItems] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    notes: '',
  });

  const handleAddItem = () => {
    setBillItems([...billItems, { product: '', quantity: '', unit_price: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = value;

    // Auto-fill unit_price if product is selected
    if (field === 'product' && value) {
      const selectedProduct = products.find(p => p.id === parseInt(value));
      if (selectedProduct) {
        updatedItems[index].unit_price = selectedProduct.price;
      }
    }

    setBillItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      if (!formData.customer_name) {
        throw new Error('Customer name is required');
      }

      if (billItems.length === 0) {
        throw new Error('Add at least one item to the bill');
      }

      // Validate all items have required fields
      for (let i = 0; i < billItems.length; i++) {
        const item = billItems[i];
        if (!item.product || !item.quantity || !item.unit_price) {
          throw new Error(`Item ${i + 1} is missing required fields`);
        }
      }

      // Prepare invoice data - pass raw user input to backend
      // Backend will:
      // - Validate product IDs exist
      // - Validate quantities are positive
      // - Check stock (if applicable)
      // - Calculate total_amount
      // - Create invoice atomically
      const invoiceData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone || null,
        notes: formData.notes,
        items: billItems.map(item => ({
          product: parseInt(item.product),
          quantity: parseInt(item.quantity),
          unit_price: item.unit_price,
        })),
      };

      const newInvoice = await createInvoice(invoiceData);

      // Reset form
      setBillItems([]);
      setFormData({
        customer_name: '',
        customer_phone: '',
        notes: '',
      });

      if (onBillingComplete) {
        onBillingComplete(newInvoice);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>

      {(formError || invoiceError) && (
        <ErrorAlert error={formError || invoiceError} onDismiss={() => setFormError('')} />
      )}

      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-2">Customer Name *</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="input-field"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.customer_phone}
            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field resize-none"
            rows="2"
            placeholder="Add any notes for this bill"
          />
        </div>
      </div>

      {/* Bill Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Bill Items (Products)</h3>
        
        {billItems.length === 0 ? (
          <p className="text-gray-600 mb-4">No items added. Click "Add Item" to start.</p>
        ) : (
          <div className="space-y-4 mb-4">
            {billItems.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Product *</label>
                  <select
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">Select product</option>
                    {products.map(p => {
                      const typeDisplay = p.product_type
                        .split('_')
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ');
                      return (
                        <option key={p.id} value={p.id}>
                          {p.name} ({typeDisplay}) - ₹{p.price}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <input
                    type="text"
                    value={item.product ? (products.find(p => p.id === parseInt(item.product))?.product_type || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''}
                    className="input-field text-sm bg-gray-200 cursor-not-allowed"
                    disabled
                    placeholder="Type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="input-field text-sm"
                    min="1"
                    placeholder="Qty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Unit Price *</label>
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="input-field text-sm"
                    step="0.01"
                    placeholder="Price"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="btn-danger w-full text-sm py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn-secondary mb-4"
        >
          + Add Item
        </button>
      </div>

      <div className="bg-sky-50 p-4 rounded-lg mb-6">
        <p className="text-gray-600 text-sm">
          Total amount will be calculated by the system when you create the invoice.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || billItems.length === 0}
        className="btn-primary w-full md:w-auto"
      >
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  );
};

export default BillingForm;
