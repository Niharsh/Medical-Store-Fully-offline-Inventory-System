import React, { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/medicineService';
import productTypeService from '../services/productTypeService';

/**
 * ProductContext - Manages state for generic medical store products
 * 
 * Supports all product types: tablets, syrups, powders, creams, diapers, condoms, sachets, etc.
 * Each product includes a product_type field indicating its category.
 * 
 * Also manages custom product types that can be added by the owner.
 * 
 * Backend is responsible for:
 * - Product type validation
 * - Stock management
 * - Data persistence
 * - Custom product type storage
 * 
 * Frontend only:
 * - Displays product type
 * - Calls API to fetch/create/update/delete products and product types
 * - No type-specific logic in frontend
 */
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (supports filtering by product_type, search, etc.)
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll(params);
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add product (requires product_type field)
  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [products]);

  // Update product
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const updated = await productService.update(id, productData);
      setProducts(products.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [products]);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [products]);

  // Get low stock products
  const getLowStock = useCallback(async (threshold = 10) => {
    try {
      return await productService.getLowStock(threshold);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, []);

  // Fetch all available product types (defaults + custom)
  const fetchProductTypes = useCallback(async () => {
    try {
      const types = await productTypeService.getAll();
      setProductTypes(types);
      return types;
    } catch (err) {
      console.error('Failed to fetch product types:', err);
      setError(err.message);
      // Return defaults on error
      return productTypeService.getDefaults();
    }
  }, []);

  // Add a new custom product type
  const addProductType = useCallback(async (typeData) => {
    try {
      const newType = await productTypeService.create(typeData);
      setProductTypes([...productTypes, newType]);
      return newType;
    } catch (err) {
      const message = err.message || 'Failed to add product type';
      setError(message);
      throw err;
    }
  }, [productTypes]);

  // Delete a custom product type
  const deleteProductType = useCallback(async (typeId) => {
    try {
      await productTypeService.delete(typeId);
      setProductTypes(productTypes.filter(t => t.id !== typeId));
    } catch (err) {
      const message = err.message || 'Failed to delete product type';
      setError(message);
      throw err;
    }
  }, [productTypes]);

  const value = {
    products,
    productTypes,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStock,
    fetchProductTypes,
    addProductType,
    deleteProductType,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider (generic products, all types)');
  }
  return context;
};
