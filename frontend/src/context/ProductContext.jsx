import React, { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/medicineService';
import productTypeService from '../services/productTypeService';
import hsnService from '../services/hsnService';

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
  const [hsns, setHSNs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (supports filtering by product_type, search, etc.)
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll(params);
      const productList = Array.isArray(data) ? data : data.results || [];
      console.log('📥 ProductContext.fetchProducts: Fetched', productList.length, 'products with batches:', productList);
      setProducts(productList);
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
      setError(null);
      const newProduct = await productService.create(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, payload) => {
    try {
      setError(null);
    
      const updatedProduct = await productService.update(id, payload);
    
      setProducts(prev =>
        prev.map(p => (p.id === id ? updatedProduct : p))
      );
    
      console.log('✅ ProductContext.updateProduct: updated', updatedProduct);
    
      return updatedProduct;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('❌ Failed to update product:', err);
      throw err;
    }
  }, []);



  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      setError(null);
      await productService.delete(id);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      console.log('✅ ProductContext.deleteProduct: Product', id, 'deleted successfully');
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('❌ ProductContext.deleteProduct: Failed to delete product', id, err);
      throw err;
    }
  }, []);

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
      setProductTypes(prevTypes => [...prevTypes, newType]);
      return newType;
    } catch (err) {
      const message = err.message || 'Failed to add product type';
      setError(message);
      throw err;
    }
  }, []);

  // Delete a custom product type
  const deleteProductType = useCallback(async (typeId) => {
    try {
      await productTypeService.delete(typeId);
      setProductTypes(prevTypes => prevTypes.filter(t => t.id !== typeId));
    } catch (err) {
      const message = err.message || 'Failed to delete product type';
      setError(message);
      throw err;
    }
  }, []);

  // Fetch all HSN codes
  const fetchHSNs = useCallback(async () => {
    try {
      const codes = await hsnService.getAll();
      setHSNs(codes);
      return codes;
    } catch (err) {
      console.error('Failed to fetch HSN codes:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Add a new HSN code
  const addHSN = useCallback(async (hsnData) => {
    try {
      const newHSN = await hsnService.create(hsnData);
      setHSNs(prevHSNs => [...prevHSNs, newHSN]);
      return newHSN;
    } catch (err) {
      const message = err.message || 'Failed to add HSN code';
      setError(message);
      throw err;
    }
  }, []);

  // Update an HSN code
  const updateHSN = useCallback(async (hsnCode, hsnData) => {
    try {
      const updatedHSN = await hsnService.update(hsnCode, hsnData);
      setHSNs(prevHSNs => 
        prevHSNs.map(h => h.hsn_code === hsnCode ? updatedHSN : h)
      );
      return updatedHSN;
    } catch (err) {
      const message = err.message || 'Failed to update HSN code';
      setError(message);
      throw err;
    }
  }, []);

  // Delete an HSN code
  const deleteHSN = useCallback(async (hsnCode) => {
    try {
      await hsnService.delete(hsnCode);
      setHSNs(prevHSNs => prevHSNs.filter(h => h.hsn_code !== hsnCode));
    } catch (err) {
      const message = err.message || 'Failed to delete HSN code';
      setError(message);
      throw err;
    }
  }, []);

  const value = {
    products,
    productTypes,
    hsns,
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
    fetchHSNs,
    addHSN,
    updateHSN,
    deleteHSN,
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
