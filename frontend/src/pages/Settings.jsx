import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductTypeManager from '../components/Product/ProductTypeManager';
import ErrorAlert from '../components/Common/ErrorAlert';

/**
 * Settings Page - Allows owner to manage product types and other system settings
 */
const Settings = () => {
  const { 
    productTypes, 
    fetchProductTypes, 
    addProductType, 
    deleteProductType,
    loading,
    error 
  } = useProducts();
  const [localError, setLocalError] = useState('');

  // Load product types on mount
  useEffect(() => {
    loadProductTypes();
  }, []);

  const loadProductTypes = async () => {
    try {
      await fetchProductTypes();
    } catch (err) {
      setLocalError('Failed to load product types');
      console.error(err);
    }
  };

  const handleAddType = async (typeData) => {
    try {
      setLocalError('');
      await addProductType(typeData);
      return Promise.resolve();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteType = async (typeId) => {
    try {
      setLocalError('');
      await deleteProductType(typeId);
    } catch (err) {
      setLocalError(err.message || 'Failed to delete product type');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings & Management</h1>
        <p className="text-gray-600 mt-2">
          Customize your inventory system and manage product types
        </p>
      </div>

      {/* Error Display */}
      {(localError || error) && (
        <ErrorAlert 
          error={localError || error} 
          onDismiss={() => setLocalError('')} 
        />
      )}

      {/* Product Type Manager */}
      <div className="card">
        <ProductTypeManager
          productTypes={productTypes}
          onTypeAdded={handleAddType}
          onTypeDeleted={handleDeleteType}
          loading={loading}
        />
      </div>

      {/* Additional Settings Sections - Placeholder for Future */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Other Settings</h3>
        <p className="text-gray-600 text-sm">
          More settings and customization options coming soon...
        </p>
      </div>
    </div>
  );
};

export default Settings;
