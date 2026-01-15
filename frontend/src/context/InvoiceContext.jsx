import React, { createContext, useContext, useState, useCallback } from 'react';
import { invoiceService } from '../services/medicineService';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all invoices
  const fetchInvoices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAll(params);
      setInvoices(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single invoice
  const fetchInvoice = useCallback(async (id) => {
    try {
      const invoice = await invoiceService.getById(id);
      setCurrentInvoice(invoice);
      return invoice;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, []);

  // Create invoice
  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const newInvoice = await invoiceService.create(invoiceData);
      setInvoices([newInvoice, ...invoices]);
      setCurrentInvoice(newInvoice);
      return newInvoice;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [invoices]);

  // Update invoice
  const updateInvoice = useCallback(async (id, invoiceData) => {
    try {
      const updated = await invoiceService.update(id, invoiceData);
      setInvoices(invoices.map(inv => inv.id === id ? updated : inv));
      if (currentInvoice?.id === id) {
        setCurrentInvoice(updated);
      }
      return updated;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    }
  }, [invoices, currentInvoice]);

  // Delete invoice
  const deleteInvoice = useCallback(async (id) => {
    try {
      await invoiceService.delete(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
      if (currentInvoice?.id === id) {
        setCurrentInvoice(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
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
