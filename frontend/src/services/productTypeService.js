import api from './api';

/**
 * Product Type Service - Manages custom and default product types
 * 
 * Handles:
 * - Fetching all available product types (defaults + custom)
 * - Creating new custom product types
 * - Deleting custom product types
 * - Caching product types in localStorage for offline support
 */

const CACHE_KEY = 'productTypes_cache';
const DEFAULT_PRODUCT_TYPES = [
  { id: 'tablet', label: 'Tablet', is_default: true },
  { id: 'syrup', label: 'Syrup', is_default: true },
  { id: 'powder', label: 'Powder', is_default: true },
  { id: 'cream', label: 'Cream', is_default: true },
  { id: 'diaper', label: 'Diaper', is_default: true },
  { id: 'condom', label: 'Condom', is_default: true },
  { id: 'sachet', label: 'Sachet', is_default: true },
];

const productTypeService = {
  /**
   * Get all product types (defaults + custom)
   * Falls back to cache if API unavailable
   * @returns {Promise<Array>} Array of product type objects
   */
  async getAll() {
    try {
      const response = await api.get('/product-types/');
      // Ensure response includes defaults
      const types = Array.isArray(response.data) ? response.data : response.data.results || [];
      const allTypes = this._mergeWithDefaults(types);
      this._cacheTypes(allTypes);
      return allTypes;
    } catch (error) {
      console.warn('Could not fetch product types from API, using cache or defaults', error);
      const cached = this._getCachedTypes();
      return cached || DEFAULT_PRODUCT_TYPES;
    }
  },

  /**
   * Create a new custom product type
   * @param {Object} typeData - { name: string, label: string }
   * @returns {Promise<Object>} Created product type
   */
  async create(typeData) {
    try {
      const response = await api.post('/product-types/', {
        name: typeData.name || typeData.id, // Backend uses 'name' field
        label: typeData.label,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.name?.[0] || 
          'Product type already exists'
        );
      }
      throw error;
    }
  },

  /**
   * Delete a custom product type (cannot delete defaults)
   * @param {string} typeId - Product type ID/name
   * @returns {Promise<void>}
   */
  async delete(typeId) {
    if (DEFAULT_PRODUCT_TYPES.find(t => t.id === typeId)) {
      throw new Error('Cannot delete default product types');
    }
    await api.delete(`/product-types/${typeId}/`);
  },

  /**
   * Check if a product type is a default type
   * @param {string} typeId - Product type ID
   * @returns {boolean}
   */
  isDefault(typeId) {
    return DEFAULT_PRODUCT_TYPES.some(t => t.id === typeId);
  },

  /**
   * Get default product types
   * @returns {Array} Default product types
   */
  getDefaults() {
    return DEFAULT_PRODUCT_TYPES;
  },

  /**
   * Merge API response with defaults
   * @private
   */
  _mergeWithDefaults(apiTypes) {
    const apiMap = {};
    apiTypes.forEach(t => {
      apiMap[t.id || t.name] = t;
    });

    // Ensure defaults are included
    const merged = [...DEFAULT_PRODUCT_TYPES];
    apiTypes.forEach(t => {
      const id = t.id || t.name;
      if (!DEFAULT_PRODUCT_TYPES.find(d => d.id === id)) {
        merged.push({
          id: id,
          label: t.label || t.name,
          is_default: false,
        });
      }
    });

    return merged;
  },

  /**
   * Cache product types in localStorage
   * @private
   */
  _cacheTypes(types) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(types));
    } catch (e) {
      console.warn('Could not cache product types', e);
    }
  },

  /**
   * Get cached product types from localStorage
   * @private
   */
  _getCachedTypes() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.warn('Could not retrieve cached product types', e);
      return null;
    }
  },
};

export default productTypeService;
