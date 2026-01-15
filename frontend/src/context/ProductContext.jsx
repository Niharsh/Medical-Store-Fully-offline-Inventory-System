import React, { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/medicineService';

/**
 * ProductContext - Manages state for generic medical store products
 * 
 * Supports all product types: tablets, syrups, powders, creams, diapers, condoms, sachets, etc.
 * Each product includes a product_type field indicating its category.
 * 
 * Backend is responsible for:
 * - Product type validation
 * - Stock management
 * - Data persistence
 * 
 * Frontend only:
 * - Displays product type
 * - Calls API to fetch/create/update/delete products
 * - No type-specific logic in frontend
 */
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
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

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStock,
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
