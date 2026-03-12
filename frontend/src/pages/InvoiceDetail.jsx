import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorAlert from '../components/Common/ErrorAlert';
import InvoicePrint from '../components/Billing/InvoicePrint';
import { useShopDetails } from '../context/ShopDetailsContext';

/**
 * InvoiceDetail Page - Full Invoice View
 * 
 * Architecture (Refactored):
 * 1. Fetch invoice data ONCE when page loads using IPC
 * 2. Render the FULL medical invoice as the main content
 * 3. Add Print and Back buttons in a control bar (screen only)
 * 4. CSS handles showing/hiding interactive elements based on @media print
 * 
 * Why this works:
 * - DOM renders full invoice for both screen and print
 * - window.print() captures the complete invoice layout
 * - Control bar hidden during print (@media print)
 * - Print CSS just hides the control bar, shows the full invoice
 * - No API refetch, no state changes, no conditional rendering of invoice
 * - Single invoice layout used for both screen and print
 */
const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shop } = useShopDetails();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =========================
     FETCH INVOICE (ONCE) - VIA IPC
     ========================= */
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!window?.api?.getInvoiceById) {
          throw new Error('window.api.getInvoiceById not available');
        }

        const response = await window.api.getInvoiceById(parseInt(id));
        if (response && response.success === false) {
          throw new Error(response.message || 'Failed to load invoice');
        }

        setInvoice(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  /* =========================
     PRINT HANDLER (native browser print - works best)
     ========================= */
  const handlePrint = () => {
    console.log('[invoice] Print button clicked');
    // Use native browser print dialog which shows all browser printing capabilities
    // including "Print to PDF" option in most browsers
    window.print();
  };


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (!invoice) return <ErrorAlert error="Invoice not found" />;

  // Prepare shop data for print view
  const shopData = shop || {
    shop_name: 'Medical Store',
    address: 'Not configured',
    phone: 'N/A',
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          CONTROL BAR - Buttons and navigation (hidden during print)
          ═══════════════════════════════════════════════════════════ */}
      <div className="invoice-control-bar">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Invoice #{invoice.id}</h2>
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              ← Back
            </button>
            <button onClick={handlePrint} className="btn-primary">
              🖨 Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FULL INVOICE LAYOUT - Visible on both screen and print
          
          This is now the MAIN invoice view:
          1. Data fetched once from API
          2. Full medical invoice layout displayed on screen
          3. Control bar hidden during print (CSS @media print)
          4. window.print() captures complete invoice
          5. Print preview shows professional invoice format
          ═══════════════════════════════════════════════════════════ */}
      <InvoicePrint invoice={invoice} shop={shopData} />
    </>
  );
};

export default InvoiceDetail;
