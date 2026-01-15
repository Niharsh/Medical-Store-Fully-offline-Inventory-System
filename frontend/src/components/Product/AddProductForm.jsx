import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import ErrorAlert from '../Common/ErrorAlert';

const AddProductForm = ({ onProductAdded }) => {
  const { addProduct, error, productTypes, fetchProductTypes } = useProducts();
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [typesLoading, setTypesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    product_type: 'tablet',
    generic_name: '',
    manufacturer: '',
    salt_composition: '',
    price: '',
    quantity: '',
    unit: 'pc',
    expiry_date: '',
    description: '',
  });

  // Load product types on component mount
  useEffect(() => {
    const loadTypes = async () => {
      try {
        setTypesLoading(true);
        await fetchProductTypes();
      } catch (err) {
        console.error('Failed to load product types:', err);
      } finally {
        setTypesLoading(false);
      }
    };
    loadTypes();
  }, [fetchProductTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.product_type || !formData.price || !formData.quantity || !formData.expiry_date) {
        throw new Error('Name, product type, price, quantity, and expiry date are required');
      }

      // Convert numeric fields
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      const newProduct = await addProduct(payload);
      
      // Reset form
      setFormData({
        name: '',
        product_type: 'tablet',
        generic_name: '',
        manufacturer: '',
        salt_composition: '',
        price: '',
        quantity: '',
        unit: 'pc',
        expiry_date: '',
        description: '',
      });

      if (onProductAdded) {
        onProductAdded(newProduct);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {(formError || error) && (
        <ErrorAlert error={formError || error} onDismiss={() => setFormError('')} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Aspirin 500mg"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Product Type *</label>
          {typesLoading ? (
            <div className="input-field bg-gray-100 text-gray-500">Loading types...</div>
          ) : (
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">-- Select Product Type --</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">Generic Name</label>
          <input
            type="text"
            name="generic_name"
            value={formData.generic_name}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Acetylsalicylic Acid"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Manufacturer</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Pharma Ltd"
          />
        </div>

        {(formData.product_type === 'tablet' || formData.product_type === 'capsule') && (
          <div>
            <label className="block font-semibold mb-2">Salt/Composition (Optional)</label>
            <input
              type="text"
              name="salt_composition"
              value={formData.salt_composition}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Paracetamol 500mg, Amoxicillin 500mg + Clavulanic Acid 125mg"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-2">Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
            min="0"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Unit</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., pc, bottle, gm, ml"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Expiry Date *</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="input-field"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field resize-none"
            rows="3"
            placeholder="Add notes about the product"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary mt-6 w-full md:w-auto"
      >
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProductForm;
