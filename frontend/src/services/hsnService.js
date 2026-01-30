import api from "./api";

/**
 * HSN Service - Manages HSN (Harmonized System Nomenclature) codes for GST classification
 *
 * Handles:
 * - Fetching all available HSN codes
 * - Creating new HSN codes
 * - Updating HSN codes
 * - Deleting HSN codes
 * - Caching HSN codes in localStorage for offline support
 */

const CACHE_KEY = "hsn_cache";

const hsnService = {
  /**
   * Get all HSN codes
   * Falls back to cache if API unavailable
   * @returns {Promise<Array>} Array of HSN objects
   */
  async getAll() {
    try {
      const response = await api.get("/hsn/");
      const hsns = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      this._cacheHSNs(hsns);
      return hsns;
    } catch (error) {
      console.warn("Could not fetch HSN codes from API, using cache", error);
      const cached = this._getCachedHSNs();
      return cached || [];
    }
  },

  /**
   * Get a single HSN code by code
   * @param {string} hsnCode - HSN code (e.g., '3004')
   * @returns {Promise<Object>} HSN object
   */
  async getByCode(hsnCode) {
    try {
      const response = await api.get(`/hsn/${hsnCode}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch HSN code ${hsnCode}:`, error);
      throw error;
    }
  },

  /**
   * Create a new HSN code
   * @param {Object} hsnData - { hsn_code, description, gst_rate }
   * @returns {Promise<Object>} Created HSN object
   */
  async create(hsnData) {
    try {
      const response = await api.post("/hsn/", {
        hsn_code: hsnData.hsn_code,
        description: hsnData.description || "",
        gst_rate: hsnData.gst_rate,
        is_active: true,
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.hsn_code?.[0] || "HSN code already exists",
        );
      }
      throw error;
    }
  },

  /**
   * Update an HSN code
   * @param {string} hsnCode - HSN code to update
   * @param {Object} hsnData - Fields to update
   * @returns {Promise<Object>} Updated HSN object
   */
  async update(hsnCode, hsnData) {
    try {
      const response = await api.patch(`/hsn/${hsnCode}/`, hsnData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update HSN code ${hsnCode}:`, error);
      throw error;
    }
  },

  /**
   * Delete an HSN code
   * @param {string} hsnCode - HSN code to delete
   * @returns {Promise<void>}
   */
  async delete(hsnCode) {
    try {
      await api.delete(`/hsn/${hsnCode}/`);
    } catch (error) {
      console.error(`Failed to delete HSN code ${hsnCode}:`, error);
      throw error;
    }
  },

  /**
   * Cache HSN codes in localStorage
   * @private
   */
  _cacheHSNs(hsns) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(hsns));
    } catch (e) {
      console.warn("Could not cache HSN codes", e);
    }
  },

  /**
   * Get cached HSN codes from localStorage
   * @private
   */
  _getCachedHSNs() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      console.warn("Could not retrieve cached HSN codes", e);
      return null;
    }
  },
};

export default hsnService;
