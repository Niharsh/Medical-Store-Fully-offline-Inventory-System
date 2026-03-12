import React, { createContext, useContext, useState, useCallback } from 'react';

const PurchaseBillsContext = createContext();

export const PurchaseBillsProvider = ({ children }) => {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [summary, setSummary] = useState({ total_purchases: 0, total_paid: 0, total_due: 0, bill_count: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all purchase bills from SQLite via IPC
  const fetchPurchaseBills = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (!window?.api?.getPurchaseBills) {
        throw new Error('window.api.getPurchaseBills not available');
      }

      const response = await window.api.getPurchaseBills();
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch purchase bills');
      }

      const bills = response.data?.results || response.data || [];
      setPurchaseBills(Array.isArray(bills) ? bills : []);
    } catch (err) {
      const message = err.message || 'Failed to fetch purchase bills';
      setError(message);
      console.error('[PurchaseBillsContext] fetchPurchaseBills error:', err);
      setPurchaseBills([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch purchase summary from SQLite via IPC
  const fetchSummary = useCallback(async (period = 'month', date = null) => {
    setLoading(true);
    setError(null);
    try {
      if (!window?.api?.getPurchaseOverview) {
        throw new Error('window.api.getPurchaseOverview not available');
      }

      const response = await window.api.getPurchaseOverview(period);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch purchase summary');
      }

      // Sanitize values in summary
      const sanitizedData = {
        total_purchases: response.data?.total_purchases || 0,
        total_paid: response.data?.total_paid || 0,
        total_due: (response.data?.total_due !== null && response.data?.total_due !== undefined) 
          ? response.data.total_due 
          : 0,
        bill_count: response.data?.bill_count || 0,
      };
      setSummary(sanitizedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch purchase summary');
      console.error('[PurchaseBillsContext] fetchSummary error:', err);
      // Set safe defaults on error
      setSummary({
        total_purchases: 0,
        total_paid: 0,
        total_due: 0,
        bill_count: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Create purchase bill via IPC
  const createPurchaseBill = useCallback(async (billData) => {
    try {
      if (!window?.api?.createPurchaseBill) {
        throw new Error('window.api.createPurchaseBill not available');
      }

      const response = await window.api.createPurchaseBill(billData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to create purchase bill');
      }

      const bill = response.data;
      setPurchaseBills(prevBills => [bill, ...prevBills]);
      return bill;
    } catch (err) {
      setError(err.message || 'Failed to create purchase bill');
      console.error('[PurchaseBillsContext] createPurchaseBill error:', err);
      throw err;
    }
  }, []);

  // Update purchase bill via IPC
  const updatePurchaseBill = useCallback(async (billId, billData) => {
    try {
      if (!window?.api?.updatePurchaseBill) {
        throw new Error('window.api.updatePurchaseBill not available');
      }

      const response = await window.api.updatePurchaseBill(billId, billData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update purchase bill');
      }

      const updatedBill = response.data;
      setPurchaseBills(prevBills => prevBills.map(bill => bill.id === billId ? updatedBill : bill));
      return updatedBill;
    } catch (err) {
      setError(err.message || 'Failed to update purchase bill');
      console.error('[PurchaseBillsContext] updatePurchaseBill error:', err);
      throw err;
    }
  }, []);

  // Delete purchase bill via IPC
  const deletePurchaseBill = useCallback(async (billId) => {
    try {
      if (!window?.api?.deletePurchaseBill) {
        throw new Error('window.api.deletePurchaseBill not available');
      }

      const response = await window.api.deletePurchaseBill(billId);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to delete purchase bill');
      }

      setPurchaseBills(prevBills => prevBills.filter(bill => bill.id !== billId));
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to delete purchase bill');
      console.error('[PurchaseBillsContext] deletePurchaseBill error:', err);
      throw err;
    }
  }, []);

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
