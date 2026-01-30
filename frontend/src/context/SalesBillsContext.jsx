import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SalesBillsContext = createContext();

export const SalesBillsProvider = ({ children }) => {
  const [salesBills, setSalesBills] = useState([]);
  const [summary, setSummary] = useState({ total_sales: 0, total_paid: 0, total_due: 0, bill_count: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIXED: Check auth state before fetching
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Fetch all sales bills
  const fetchSalesBills = useCallback(async (params = {}) => {
    // ✅ FIXED: Guard against unauthenticated requests
    if (authLoading || !isAuthenticated) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/sales-bills/`, { params });
      setSalesBills(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales bills');
      console.error('Failed to fetch sales bills:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Fetch sales summary
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
      const response = await api.get(`/sales-bills/summary/`, { params });
      // Sanitize NaN values in summary
      const sanitizedData = {
        ...response.data,
        total_sales: response.data.total_sales || 0,
        total_paid: response.data.total_paid || 0,
        total_due: (response.data.total_due !== null && response.data.total_due !== undefined) 
          ? response.data.total_due 
          : 0
      };
      setSummary(sanitizedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales summary');
      console.error('Failed to fetch sales summary:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Update amount paid
  const updateAmountPaid = useCallback(async (billId, amountPaid) => {
    try {
      const response = await api.patch(`/sales-bills/${billId}/`, {
        amount_paid: parseFloat(amountPaid)
      });
      setSalesBills(salesBills.map(bill => bill.id === billId ? response.data : bill));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [salesBills]);

  // Search sales bills
  const searchSalesBills = useCallback(async (searchTerm) => {
    try {
      return await fetchSalesBills({ search: searchTerm });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchSalesBills]);

  return (
    <SalesBillsContext.Provider value={{
      salesBills,
      summary,
      loading,
      error,
      fetchSalesBills,
      fetchSummary,
      updateAmountPaid,
      searchSalesBills
    }}>
      {children}
    </SalesBillsContext.Provider>
  );
};

export const useSalesBills = () => {
  const context = useContext(SalesBillsContext);
  if (!context) {
    throw new Error('useSalesBills must be used within SalesBillsProvider');
  }
  return context;
};
