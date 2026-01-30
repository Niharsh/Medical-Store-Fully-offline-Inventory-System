import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const PurchaseBillsContext = createContext();

export const PurchaseBillsProvider = ({ children }) => {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [summary, setSummary] = useState({ total_purchases: 0, total_paid: 0, total_due: 0, bill_count: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIXED: Check auth state before fetching
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch all purchase bills
  const fetchPurchaseBills = useCallback(async (params = {}) => {
    // ✅ FIXED: Guard against unauthenticated requests
    if (authLoading || !isAuthenticated) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/purchase-bills/`, { params });
      setPurchaseBills(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch purchase bills');
      console.error('Failed to fetch purchase bills:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Fetch purchase summary
  const fetchSummary = useCallback(async (period = 'month', date = null) => {
    // ✅ FIXED: Guard against unauthenticated requests
    if (authLoading || !isAuthenticated) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const params = { period };
      if (date) params.date = date;
      const response = await api.get(`/purchase-bills/summary/`, { params });
      // Sanitize NaN values in summary
      const sanitizedData = {
        ...response.data,
        total_purchases: response.data.total_purchases || 0,
        total_paid: response.data.total_paid || 0,
        total_due: (response.data.total_due !== null && response.data.total_due !== undefined) 
          ? response.data.total_due 
          : 0
      };
      setSummary(sanitizedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch purchase summary');
      console.error('Failed to fetch purchase summary:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Create purchase bill
  const createPurchaseBill = useCallback(async (billData) => {
    try {
      const response = await api.post(`/purchase-bills/`, billData);
      setPurchaseBills(prevPurchaseBills => [response.data, ...prevPurchaseBills]);
      // this line was changed to use functional update to avoid stale closure
      setPurchaseBills([response.data, ...purchaseBills]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [purchaseBills]);

  // Update purchase bill
  const updatePurchaseBill = useCallback(async (billId, billData) => {
    try {
      const response = await api.patch(`/purchase-bills/${billId}/`, billData);
      setPurchaseBills(purchaseBills.map(bill => bill.id === billId ? response.data : bill));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [purchaseBills]);

  // Delete purchase bill
  const deletePurchaseBill = useCallback(async (billId) => {
    try {
      await api.delete(`/purchase-bills/${billId}/`);
      setPurchaseBills(purchaseBills.filter(bill => bill.id !== billId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [purchaseBills]);

  // Search purchase bills
  const searchPurchaseBills = useCallback(async (searchTerm) => {
    try {
      return await fetchPurchaseBills({ search: searchTerm });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchPurchaseBills]);

  return (
    <PurchaseBillsContext.Provider value={{
      purchaseBills,
      summary,
      loading,
      error,
      fetchPurchaseBills,
      fetchSummary,
      createPurchaseBill,
      updatePurchaseBill,
      deletePurchaseBill,
      searchPurchaseBills
    }}>
      {children}
    </PurchaseBillsContext.Provider>
  );
};

export const usePurchaseBills = () => {
  const context = useContext(PurchaseBillsContext);
  if (!context) {
    throw new Error('usePurchaseBills must be used within PurchaseBillsProvider');
  }
  return context;
};
