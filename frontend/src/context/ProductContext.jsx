import React, { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/medicineService';

// Default product types (hardcoded, always available)
const DEFAULT_PRODUCT_TYPES = [
  { id: 'tablet', label: 'Tablet', is_default: true },
  { id: 'syrup', label: 'Syrup', is_default: true },
  { id: 'powder', label: 'Powder', is_default: true },
  { id: 'cream', label: 'Cream', is_default: true },
  { id: 'diaper', label: 'Diaper', is_default: true },
  { id: 'condom', label: 'Condom', is_default: true },
  { id: 'sachet', label: 'Sachet', is_default: true },
];

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
 * - Calls IPC to fetch/create/update/delete products and product types
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
      // Use IPC to fetch products from SQLite
      if (window?.api?.getProducts) {
        const response = await window.api.getProducts();
        const productList = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log('📥 ProductContext.fetchProducts: Fetched', productList.length, 'products with batches:', productList);
        setProducts(productList);
      } else {
        throw new Error('window.api.getProducts is not available');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add product (requires product_type field)
  const addProduct = useCallback(async (productData) => {
    try {
      setError(null);
      if (window?.api?.addProduct) {
        const response = await window.api.addProduct(productData);
        
        if (!response || !response.data) {
          throw new Error('Invalid response: missing product data');
        }
        
        const newProduct = response.data;
        
        // Validate product has required fields
        if (!newProduct || !newProduct.id || !newProduct.name) {
          console.error('INVALID PRODUCT:', newProduct);
          throw new Error('Incomplete product data returned from server');
        }
        
        // Ensure batches and gst_rate exist
        if (!Array.isArray(newProduct.batches)) {
          newProduct.batches = [];
        }
        if (newProduct.gst_rate === undefined) {
          newProduct.gst_rate = null;
        }
        
        console.log('Adding product to state:', { id: newProduct.id, name: newProduct.name, batches: newProduct.batches.length });
        
        setProducts(prevProducts => {
          const filtered = prevProducts.filter(p => p && p.id && p.name);
          return [...filtered, newProduct];
        });
        
        return newProduct;
      } else {
        throw new Error('window.api.addProduct is not available');
      }
    } catch (err) {
      console.error('ProductContext.addProduct error:', err);
      setError(err.message || 'Failed to add product');
      throw err;
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, payload) => {
    try {
      setError(null);
      
      if (!window?.api?.updateProduct) {
        throw new Error('window.api.updateProduct not available');
      }

      const response = await window.api.updateProduct(id, payload);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update product');
      }

      const updatedProduct = response.data;
      setProducts(prev =>
        prev.map(p => (p.id === id ? updatedProduct : p))
      );
    
      console.log('✅ ProductContext.updateProduct: updated', updatedProduct);
    
      return updatedProduct;
    } catch (err) {
      const message = err.message || 'Failed to update product';
      setError(message);
      console.error('❌ ProductContext.updateProduct error:', err);
      throw err;
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      setError(null);
      
      if (!window?.api?.deleteProduct) {
        throw new Error('window.api.deleteProduct not available');
      }

      const response = await window.api.deleteProduct(id);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to delete product');
      }

      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      console.log('✅ ProductContext.deleteProduct: Product', id, 'deleted successfully');
    } catch (err) {
      const message = err.message || 'Failed to delete product';
      setError(message);
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

  // Fetch all available product types (defaults + custom from SQLite)
  const fetchProductTypes = useCallback(async () => {
    try {
      if (!window?.api?.getProductTypes) {
        throw new Error('window.api.getProductTypes not available');
      }

      const response = await window.api.getProductTypes();
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch product types');
      }

      const customTypes = response.data || [];
      // Merge defaults with custom types
      const allTypes = [...DEFAULT_PRODUCT_TYPES, ...customTypes];
      setProductTypes(allTypes);
      return allTypes;
    } catch (err) {
      console.error('[ProductContext] Failed to fetch product types:', err);
      setError(err.message);
      // Return defaults on error
      return DEFAULT_PRODUCT_TYPES;
    }
  }, []);

  // Add a new custom product type
  const addProductType = useCallback(async (typeData) => {
    try {
      if (!window?.api?.addProductType) {
        throw new Error('window.api.addProductType not available');
      }

      const response = await window.api.addProductType(typeData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to add product type');
      }

      const newType = response.data;
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
      if (!window?.api?.deleteProductType) {
        throw new Error('window.api.deleteProductType not available');
      }

      const response = await window.api.deleteProductType(typeId);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to delete product type');
      }

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
      if (!window?.api?.getHSNCodes) {
        throw new Error('window.api.getHSNCodes not available');
      }

      const response = await window.api.getHSNCodes();
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch HSN codes');
      }

      const codes = response.data || [];
      setHSNs(codes);
      return codes;
    } catch (err) {
      console.error('[ProductContext] Failed to fetch HSN codes:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Add a new HSN code
  const addHSN = useCallback(async (hsnData) => {
    try {
      if (!window?.api?.addHSNCode) {
        throw new Error('window.api.addHSNCode not available');
      }

      const response = await window.api.addHSNCode(hsnData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to add HSN code');
      }

      const newHSN = response.data;
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
      if (!window?.api?.updateHSNCode) {
        throw new Error('window.api.updateHSNCode not available');
      }

      const response = await window.api.updateHSNCode(hsnCode, hsnData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update HSN code');
      }

      const updatedHSN = response.data;
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
      if (!window?.api?.deleteHSNCode) {
        throw new Error('window.api.deleteHSNCode not available');
      }

      const response = await window.api.deleteHSNCode(hsnCode);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to delete HSN code');
      }

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
