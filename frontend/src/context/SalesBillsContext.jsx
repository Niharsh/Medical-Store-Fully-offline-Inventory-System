import React, { createContext, useContext, useState, useCallback } from 'react';

const SalesBillsContext = createContext();

export const SalesBillsProvider = ({ children }) => {
  const [salesBills, setSalesBills] = useState([]);
  const [summary, setSummary] = useState({ total_sales: 0, total_paid: 0, total_due: 0, bill_count: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all sales bills from SQLite
  const fetchSalesBills = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (!window?.api?.getInvoices) {
        throw new Error('window.api.getInvoices not available');
      }

      const response = await window.api.getInvoices();
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch sales bills');
      }

      const data = response.data?.results || response.data || [];
      setSalesBills(Array.isArray(data) ? data : []);

      // Calculate summary from bills
      const total_sales = data.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);
      setSummary({
        total_sales,
        total_paid: 0,
        total_due: 0,
        bill_count: data.length,
      });
    } catch (err) {
      const message = err.message || 'Failed to fetch sales bills';
      setError(message);
      console.error('[SalesBillsContext] fetchSalesBills error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sales summary from SQLite via IPC
  const fetchSummary = useCallback(async (period = 'month', date = null) => {
    setLoading(true);
    setError(null);
    try {
      if (!window?.api?.getSalesOverview) {
        throw new Error('window.api.getSalesOverview not available');
      }

      const response = await window.api.getSalesOverview(period);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch sales summary');
      }

      setSummary({
        total_sales: response.data?.total_sales || 0,
        total_paid: response.data?.total_paid || 0,
        total_due: response.data?.total_due || 0,
        bill_count: response.data?.bill_count || 0,
      });
    } catch (err) {
      const message = err.message || 'Failed to fetch sales summary';
      setError(message);
      console.error('[SalesBillsContext] fetchSummary error:', err);
      // Set safe defaults on error
      setSummary({
        total_sales: 0,
        total_paid: 0,
        total_due: 0,
        bill_count: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update amount paid (note: not persisted in local SQLite yet)
  const updateAmountPaid = useCallback(async (billId, amountPaid) => {
    try {
      // For now, this updates local state only
      // Full implementation would persist to SQLite
      setSalesBills(salesBills.map(bill =>
        bill.id === billId ? { ...bill, amount_paid: amountPaid } : bill
      ));
      return { id: billId, amount_paid: amountPaid };
    } catch (err) {
      const message = err.message || 'Failed to update amount paid';
      setError(message);
      throw err;
    }
  }, [salesBills]);

  // Search sales bills (local filtering)
  const searchSalesBills = useCallback(async (searchTerm) => {
    try {
      return await fetchSalesBills({ search: searchTerm });
    } catch (err) {
      const message = err.message || 'Failed to search bills';
      setError(message);
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
