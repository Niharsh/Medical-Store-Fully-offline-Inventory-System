import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const ProductSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query && query.trim().length >= 1) {
      searchProducts();
    }
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Searching products with query:', query);
      // Backend search includes name, generic_name, manufacturer, salt_composition
      const response = await api.get(`/products/?search=${encodeURIComponent(query)}`);
      
      // Handle paginated or direct response
      const data = response.data.results || response.data || [];
      console.log('✅ Search results:', data);
      
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Failed to search products');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price || 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { text: '-', color: 'text-gray-500' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-700 bg-red-100 px-2 py-1 rounded' };
    if (daysLeft <= 30) return { text: `${daysLeft}d`, color: 'text-orange-700 bg-orange-100 px-2 py-1 rounded' };
    if (daysLeft <= 90) return { text: `${daysLeft}d`, color: 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded' };
    return { text: `${daysLeft}d`, color: 'text-green-700 bg-green-100 px-2 py-1 rounded' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Search Results</h1>
          <p className="text-gray-600 mt-2">
            Search query: <span className="font-semibold text-sky-600">"{query}"</span>
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-3">Searching products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          <strong>No results.</strong> Try searching with different keywords or check the product name and salt/composition.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
            <p className="text-gray-700">
              Found <span className="font-bold text-lg text-sky-600">{results.length}</span> product{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Product Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Salt / Composition</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Cost Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Selling Price</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Nearest Expiry</th>
                </tr>
              </thead>
              <tbody>
                {results.map((product, index) => {
                  const expiryStatus = getExpiryStatus(product.nearest_expiry);
                  const totalStock = product.total_stock || 0;
                  const costPrice = product.cost_price || 0;
                  const sellingPrice = product.selling_price || 0;
                  
                  return (
                    <tr 
                      key={product.id || index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {product.generic_name || product.salt_composition || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {product.product_type || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        <span className={totalStock <= 10 ? 'text-red-600' : 'text-green-600'}>
                          {totalStock} {product.unit || ''}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        ₹{formatPrice(costPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        ₹{formatPrice(sellingPrice)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className={expiryStatus.color}>
                          {expiryStatus.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
