import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerExists, setOwnerExists] = useState(null);

  // ✅ Check auth on app startup via IPC
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if owner account exists
        if (!window?.api?.checkOwnerExists) {
          console.error('IPC API not available');
          setOwnerExists(false);
          setLoading(false);
          return;
        }

        const checkResponse = await window.api.checkOwnerExists();
        setOwnerExists(checkResponse.data?.exists ?? false);

        // If owner exists, try to restore session from localStorage
        if (checkResponse.data?.exists) {
          const offlineSession = JSON.parse(localStorage.getItem('offline_session') || 'null');
          if (offlineSession && offlineSession.username) {
            // Verify the owner still exists in SQLite before restoring session
            if (!window?.api?.verifyOwnerExists) {
              console.warn('Verification API not available, skipping session restoration');
              setLoading(false);
              return;
            }

            const verifyResponse = await window.api.verifyOwnerExists(offlineSession.username);
            
            if (verifyResponse.success && verifyResponse.data?.exists && verifyResponse.data?.owner) {
              // Owner verified - restore offline session
              setOwner({ 
                username: verifyResponse.data.owner.username, 
                email: verifyResponse.data.owner.email,
                first_name: verifyResponse.data.owner.first_name,
                last_name: verifyResponse.data.owner.last_name,
                offline: true 
              });
              console.log('[auth] Restored verified offline session:', offlineSession.username);
            } else {
              // Owner not found - remove invalid session
              console.warn('[auth] Session owner not found in database, clearing offline_session');
              localStorage.removeItem('offline_session');
              setOwner(null);
            }
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Auth check failed:', err);
        setOwnerExists(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register (one-time)
  const register = async (username, email, password, firstName = '', lastName = '') => {
    try {
      setError(null);

      if (!window?.api?.registerOwner) {
        throw new Error('IPC API not available');
      }

      const response = await window.api.registerOwner(
        username,
        email,
        password,
        firstName,
        lastName
      );

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      // Store owner info in local state
      localStorage.setItem('offline_session', JSON.stringify({ 
        username: response.data.username, 
        created_at: Date.now() 
      }));

      setOwner(response.data);
      setOwnerExists(true);

      return response.data;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  };

  // Login with username + password
  const login = async (username, password) => {
    setError(null);

    try {
      if (!window?.api?.loginOwner) {
        throw new Error('IPC API not available');
      }

      const response = await window.api.loginOwner(username, password);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      // Store owner info in local state and localStorage for offline access
      localStorage.setItem('offline_session', JSON.stringify({ 
        username: response.data.username, 
        created_at: Date.now() 
      }));

      setOwner(response.data);
      console.log('[auth] Login successful:', response.data.username);

      return response.data;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('offline_session');
    setOwner(null);
    setError(null);
    console.log('[auth] Logged out');
  };

  // Reset password with recovery code (offline-friendly)
  const resetPasswordWithRecoveryCode = async (username, recoveryCode, newPassword) => {
    try {
      setError(null);

      if (!window?.api?.resetPasswordRecovery) {
        throw new Error('IPC API not available');
      }

      const response = await window.api.resetPasswordRecovery(
        username,
        recoveryCode,
        newPassword
      );

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }


      // Auto-login after successful reset
      localStorage.setItem('offline_session', JSON.stringify({ 
        username: response.data.username, 
        created_at: Date.now() 
      }));

      setOwner(response.data);
      console.log('[auth] Password reset successful');

      return response.data;
    } catch (err) {
      const errorMsg = err.message || 'Password reset failed';
      setError(errorMsg);
      throw err;
    }
  };

  const value = {
    owner,
    loading,
    error,
    ownerExists,
    auth: owner,
    setError,
    register,
    login,
    logout,
    resetPasswordWithRecoveryCode,
    isAuthenticated: !!owner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
