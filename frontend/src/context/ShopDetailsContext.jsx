import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ShopDetailsContext = createContext();

export const ShopDetailsProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ FIXED: Check auth state before fetching
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // ✅ FIXED: Only fetch when authenticated
    if (authLoading || !isAuthenticated) {
      return;
    }

    const fetchShopDetails = async () => {
      try {
        const res = await api.get('/shop-profile/');
        setShop(res.data);
      } catch (err) {
        setError('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [isAuthenticated, authLoading]);

  return (
    <ShopDetailsContext.Provider value={{ shop, loading, error }}>
      {children}
    </ShopDetailsContext.Provider>
  );
};

export const useShopDetails = () => useContext(ShopDetailsContext);
