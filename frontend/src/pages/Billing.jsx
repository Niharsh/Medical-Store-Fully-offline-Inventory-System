import React from 'react';
import BillingForm from '../components/Billing/BillingForm';
import InvoiceHistory from '../components/Billing/InvoiceHistory';

const Billing = () => {
  const handleBillingComplete = () => {
    // Refresh invoice list is handled by context
  };

  return (
    <div className="space-y-8">
      <BillingForm onBillingComplete={handleBillingComplete} />
      <InvoiceHistory />
    </div>
  );
};

export default Billing;
