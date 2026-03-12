import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const WholesalersContext = createContext();

const PURCHASE_HISTORY_STORAGE_KEY = 'inventory_purchase_history';

export const WholesalersProvider = ({ children }) => {
  const [wholesalers, setWholesalers] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState(null);

  // Fetch wholesalers from SQLite on mount
  useEffect(() => {
    const fetchWholesalers = async () => {
      try {
        if (window?.api?.getWholesalers) {
          const response = await window.api.getWholesalers();
          // Support both old and new structured responses
          let wholesalerList = [];
          if (!response) {
            console.warn('[WholesalersContext] getWholesalers returned empty response');
          } else if (response.success === false) {
            console.error('[WholesalersContext] getWholesalers error:', response.message);
          } else if (Array.isArray(response.data)) {
            wholesalerList = response.data;
          } else if (response.data && Array.isArray(response.data.results)) {
            wholesalerList = response.data.results;
          }
          console.log('[WholesalersContext] Fetched wholesalers:', wholesalerList);
          setWholesalers(wholesalerList || []);
        } else {
          console.warn('[WholesalersContext] window.api.getWholesalers not available');
        }
      } catch (err) {
        console.error('[WholesalersContext] Failed to fetch wholesalers:', err);
      }
    };

    fetchWholesalers();

    // Restore purchase history from localStorage
    const saved = localStorage.getItem(PURCHASE_HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        setPurchaseHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to restore purchase history:', e);
      }
    }
  }, []);
  
  

  // Save purchase history to local storage
  const savePurchaseHistory = (data) => {
    localStorage.setItem(PURCHASE_HISTORY_STORAGE_KEY, JSON.stringify(data));
    setPurchaseHistory(data);
  };

  // Add new wholesaler using IPC to SQLite
  const addWholesaler = async ({ name, phone, gstNumber }) => {
    const payload = {
      name: name.trim(),
      contactNumber: phone?.trim() || '',
      gstNumber: gstNumber?.trim() || '',
    };

    if (window?.api?.addWholesaler) {
      try {
        const response = await window.api.addWholesaler(payload);
        if (!response || response.success === false) {
          throw new Error(response?.message || 'addWholesaler failed');
        }
        const newWholesaler = response.data;
        setWholesalers(prev => [...prev, newWholesaler]);
        return newWholesaler;
      } catch (err) {
        console.error('[WholesalersContext] addWholesaler error:', err);
        throw err;
      }
    } else {
      throw new Error('window.api.addWholesaler is not available');
    }
  };

  // Update wholesaler using IPC to SQLite
  const updateWholesaler = async (id, name, contactNumber = '', gstNumber = '') => {
    const payload = {
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      gstNumber: gstNumber.trim(),
    };

    if (window?.api?.updateWholesaler) {
      try {
        const response = await window.api.updateWholesaler(id, payload);
        if (!response || response.success === false) {
          throw new Error(response?.message || 'updateWholesaler failed');
        }
        const updated = response.data;
        setWholesalers(prev => prev.map(w => (w.id === id ? updated : w)));
        return updated;
      } catch (err) {
        console.error('[WholesalersContext] updateWholesaler error:', err);
        throw err;
      }
    } else {
      throw new Error('window.api.updateWholesaler is not available');
    }
  };

  // Delete wholesaler using IPC to SQLite
  const deleteWholesaler = async (id) => {
    if (window?.api?.deleteWholesaler) {
      try {
        const response = await window.api.deleteWholesaler(id);
        if (!response || response.success === false) {
          throw new Error(response?.message || 'deleteWholesaler failed');
        }
        setWholesalers(prev => prev.filter(w => w.id !== id));
        if (selectedWholesalerId === id) {
          setSelectedWholesalerId(null);
        }
        return true;
      } catch (err) {
        console.error('[WholesalersContext] deleteWholesaler error:', err);
        throw err;
      }
    } else {
      throw new Error('window.api.deleteWholesaler is not available');
    }
  };

  // Record a purchase (product batch from wholesaler at specific cost price)
  const recordPurchase = (wholesalerId, productName, costPrice, date = new Date().toISOString()) => {
    const record = {
      id: Date.now().toString(),
      wholesalerId,
      productName: productName.trim(),
      costPrice: parseFloat(costPrice),
      purchaseDate: date,
      recordedAt: new Date().toISOString()
    };
    const updated = [...purchaseHistory, record];
    savePurchaseHistory(updated);
    return record;
  };

  // Get last purchase record for a product from a specific wholesaler
  const getLastPurchasePrice = (wholesalerId, productName) => {
    const records = purchaseHistory
      .filter(h => h.wholesalerId === wholesalerId && h.productName.toLowerCase() === productName.toLowerCase())
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    
    return records.length > 0 ? records[0] : null;
  };

  // Get all purchase records for a product
  const getProductPurchaseHistory = (productName) => {
    return purchaseHistory
      .filter(h => h.productName.toLowerCase() === productName.toLowerCase())
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  };

  // Get all purchase records from a specific wholesaler
  const getWholesalerPurchaseHistory = (wholesalerId) => {
    return purchaseHistory
      .filter(h => h.wholesalerId === wholesalerId)
      .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  };

  // Get wholesaler by ID
  const getWholesaler = (id) => {
    return wholesalers.find(w => w.id === id);
  };

  // Get selected wholesaler
  const getSelectedWholesaler = () => {
    return selectedWholesalerId ? getWholesaler(selectedWholesalerId) : null;
  };

  // Log whenever context value changes
  console.log('🔄 WholesalersContext provider rendering with:', {
    wholesalesCount: wholesalers.length,
    wholesalers: wholesalers.map(w => ({ id: w.id, name: w.name })),
    selectedWholesalerId
  });

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    wholesalers,
    purchaseHistory,
    selectedWholesalerId,
    setSelectedWholesalerId,
    addWholesaler,
    updateWholesaler,
    deleteWholesaler,
    recordPurchase,
    getLastPurchasePrice,
    getProductPurchaseHistory,
    getWholesalerPurchaseHistory,
    getWholesaler,
    getSelectedWholesaler
  }), [wholesalers, purchaseHistory, selectedWholesalerId]);

  return (
    <WholesalersContext.Provider value={contextValue}>
      {children}
    </WholesalersContext.Provider>
  );
};

export const useWholesalers = () => {
  const context = useContext(WholesalersContext);
  if (!context) {
    throw new Error('useWholesalers must be used within WholesalersProvider');
  }
  return context;
};
