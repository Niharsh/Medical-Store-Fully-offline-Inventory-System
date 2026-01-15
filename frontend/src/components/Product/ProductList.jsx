import React, { useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const ProductList = ({ onEdit, onDelete }) => {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Format product type for display
  const formatProductType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days until expiry
  const daysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Get expiry status color
  const getExpiryStatusColor = (expiryDate) => {
    const days = daysUntilExpiry(expiryDate);
    if (!days) return '';
    if (days < 0) return 'text-red-700 bg-red-100';
    if (days <= 30) return 'text-orange-700 bg-orange-100';
    if (days <= 90) return 'text-yellow-700 bg-yellow-100';
    return 'text-green-700 bg-green-100';
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Product Inventory</h2>

      {error && <ErrorAlert error={error} />}

      {products.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No products found. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Type</th>
                <th className="text-left py-3">Generic</th>
                <th className="text-right py-3">Price</th>
                <th className="text-right py-3">Quantity</th>
                <th className="text-center py-3">Unit</th>
                <th className="text-center py-3">Expiry</th>
                <th className="text-center py-3">Stock Status</th>
                <th className="text-center py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="table-row">
                  <td className="py-4">
                    <div className="font-semibold">{product.name}</div>
                    {product.salt_composition && (
                      <div className="text-xs text-gray-500 mt-1">
                        Salt: {product.salt_composition}
                      </div>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {formatProductType(product.product_type)}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{product.generic_name || '-'}</td>
                  <td className="py-4 text-right">₹{parseFloat(product.price).toFixed(2)}</td>
                  <td className="py-4 text-right">{product.quantity}</td>
                  <td className="py-4 text-center text-gray-600">{product.unit}</td>
                  <td className="py-4 text-center">
                    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getExpiryStatusColor(product.expiry_date)}`}>
                      {formatDate(product.expiry_date)}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    {product.quantity < 10 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit?.(product)}
                      className="btn-secondary text-sm px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(product.id)}
                      className="btn-danger text-sm px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
