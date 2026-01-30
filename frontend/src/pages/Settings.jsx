import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductTypeManager from '../components/Product/ProductTypeManager';
import HSNManager from '../components/Product/HSNManager';
import ErrorAlert from '../components/Common/ErrorAlert';
import ShopDetails from "../components/Settings/ShopDetails";


/**
 * Settings Page - Allows owner to manage product types, HSN codes, and other system settings
 */
const Settings = () => {
  const { 
    productTypes, 
    hsns,
    fetchProductTypes,
    fetchHSNs,
    addProductType, 
    deleteProductType,
    addHSN,
    updateHSN,
    deleteHSN,
    loading,
    error 
  } = useProducts();
  const [localError, setLocalError] = useState('');

  // Load product types and HSN codes on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchProductTypes(),
        fetchHSNs(),
      ]);
    } catch (err) {
      setLocalError('Failed to load settings data');
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

  const handleAddHSN = async (hsnData) => {
    try {
      setLocalError('');
      await addHSN(hsnData);
      return Promise.resolve();
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateHSN = async (hsnCode, hsnData) => {
    try {
      setLocalError('');
      await updateHSN(hsnCode, hsnData);
      return Promise.resolve();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteHSN = async (hsnCode) => {
    try {
      setLocalError('');
      await deleteHSN(hsnCode);
    } catch (err) {
      setLocalError(err.message || 'Failed to delete HSN code');
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
      {/* Shop Details Section */}
      <div className="card">
        <ShopDetails />
      </div>

      {/* Product Type Manager */}
      <div className="card">
        <ProductTypeManager
          productTypes={productTypes}
          onTypeAdded={handleAddType}
          onTypeDeleted={handleDeleteType}
          loading={loading}
        />
      </div>

      {/* HSN Manager */}
      <div className="card">
        <HSNManager
          hsns={hsns}
          onHSNAdded={handleAddHSN}
          onHSNUpdated={handleUpdateHSN}
          onHSNDeleted={handleDeleteHSN}
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
