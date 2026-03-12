import React, { createContext, useContext, useState, useCallback } from 'react';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all invoices from SQLite
  const fetchInvoices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (!window?.api?.getInvoices) {
        throw new Error('window.api.getInvoices not available');
      }

      const response = await window.api.getInvoices();
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch invoices');
      }

      const data = response.data?.results || response.data || [];
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err.message || 'Failed to fetch invoices';
      setError(message);
      console.error('[InvoiceContext] fetchInvoices error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single invoice from SQLite
  const fetchInvoice = useCallback(async (id) => {
    try {
      if (!window?.api?.getInvoiceById) {
        throw new Error('window.api.getInvoiceById not available');
      }

      const response = await window.api.getInvoiceById(id);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to fetch invoice');
      }

      const invoice = response.data;
      setCurrentInvoice(invoice);
      return invoice;
    } catch (err) {
      const message = err.message || 'Failed to fetch invoice';
      setError(message);
      throw err;
    }
  }, []);

  // Create invoice via SQLite
  const createInvoice = useCallback(async (invoiceData) => {
    try {
      if (!window?.api?.createInvoice) {
        throw new Error('window.api.createInvoice not available');
      }

      const response = await window.api.createInvoice(invoiceData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to create invoice');
      }

      const newInvoice = response.data;
      setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
      setCurrentInvoice(newInvoice);
      return newInvoice;
    } catch (err) {
      const message = err.message || 'Failed to create invoice';
      setError(message);
      throw err;
    }
  }, []);

  // Update invoice metadata
  const updateInvoice = useCallback(async (id, invoiceData) => {
    try {
      if (!window?.api?.updateInvoice) {
        throw new Error('window.api.updateInvoice not available');
      }

      const response = await window.api.updateInvoice(id, invoiceData);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to update invoice');
      }

      const updated = response.data;
      setInvoices(invoices.map(inv => inv.id === id ? updated : inv));
      if (currentInvoice?.id === id) {
        setCurrentInvoice(updated);
      }
      return updated;
    } catch (err) {
      const message = err.message || 'Failed to update invoice';
      setError(message);
      throw err;
    }
  }, [invoices, currentInvoice]);

  // Delete invoice
  const deleteInvoice = useCallback(async (id) => {
    try {
      if (!window?.api?.deleteInvoice) {
        throw new Error('window.api.deleteInvoice not available');
      }

      const response = await window.api.deleteInvoice(id);
      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to delete invoice');
      }

      setInvoices(invoices.filter(inv => inv.id !== id));
      if (currentInvoice?.id === id) {
        setCurrentInvoice(null);
      }
    } catch (err) {
      const message = err.message || 'Failed to delete invoice';
      setError(message);
      throw err;
    }
  }, [invoices, currentInvoice]);

  const value = {
    invoices,
    currentInvoice,
    loading,
    error,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};
