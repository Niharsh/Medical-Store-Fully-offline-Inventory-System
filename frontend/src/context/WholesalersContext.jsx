import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api'; // or wherever axios instance is
import { useAuth } from './AuthContext';

const WholesalersContext = createContext();


const PURCHASE_HISTORY_STORAGE_KEY = 'inventory_purchase_history';

export const WholesalersProvider = ({ children }) => {
  const [wholesalers, setWholesalers] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [selectedWholesalerId, setSelectedWholesalerId] = useState(null);

  // ✅ FIXED: Check auth state before fetching
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ✅ FIXED: Only fetch when authenticated and auth is not loading
  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }
    
    api.get('/wholesalers/')
      .then(res => {
        setWholesalers(res.data.results ?? res.data);
      })
      .catch(err => {
        console.error('Failed to load wholesalers', err);
        // Don't crash if 401 - auth guard will redirect
      });
  }, [isAuthenticated, authLoading]);
  
  

  // Save purchase history to local storage
  const savePurchaseHistory = (data) => {
    localStorage.setItem(PURCHASE_HISTORY_STORAGE_KEY, JSON.stringify(data));
    setPurchaseHistory(data);
  };

  // Add new wholesaler
  const addWholesaler = async ({ name, phone, gstNumber }) => {
          const payload = {
            name: name.trim(),
            contact_number: phone?.trim() || '',
            gst_number: gstNumber?.trim() || '',
          };
        
          const res = await api.post('/wholesalers/', payload);
          setWholesalers(prev => [...prev, res.data]);
          return res.data;
        };  


  // Update wholesaler
  const updateWholesaler = (id, name, contactNumber = '', gstNumber = '') => {
    const updated = wholesalers.map(w => 
      w.id === id 
        ? { ...w, name: name.trim(), contactNumber: contactNumber.trim(), gstNumber: gstNumber.trim() }
        : w
    );
    saveWholesalers(updated);
  };

  // Delete wholesaler
  const deleteWholesaler = (id) => {
    const updated = wholesalers.filter(w => w.id !== id);
    saveWholesalers(updated);
    if (selectedWholesalerId === id) {
      setSelectedWholesalerId(null);
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
