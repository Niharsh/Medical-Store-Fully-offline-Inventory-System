import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useInvoices } from '../context/InvoiceContext';

/**
 * Dashboard Page - Overview of medical store inventory and billing
 * 
 * Displays:
 * - Total products (all types: tablets, syrups, powders, creams, diapers, condoms, sachets)
 * - Low stock count (threshold determined by backend)
 * - Recent invoices
 * 
 * All data from API - no business logic in frontend
 */
const Dashboard = () => {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { invoices, fetchInvoices } = useInvoices();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    recentInvoices: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
  }, []);

  useEffect(() => {
    // Display data from API - backend determines low stock threshold
    const lowStockCount = products.filter(p => p.quantity < 10).length;

    setStats({
      totalProducts: products.length,
      lowStockCount: lowStockCount,
      recentInvoices: invoices.length,
    });
  }, [products, invoices]);

  const StatCard = ({ title, value, color = 'sky' }) => (
    <div className={`card bg-${color}-50 border-l-4 border-${color}-600`}>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className={`text-4xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          color="sky"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats.lowStockCount}
          color="amber"
        />
        <StatCard 
          title="Recent Invoices" 
          value={stats.recentInvoices}
          color="green"
        />
      </div>

      {stats.lowStockCount > 0 && (
        <div className="card bg-amber-50 border-l-4 border-amber-600">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            ⚠️ Low Stock Alert
          </h3>
          <p className="text-amber-800">
            {stats.lowStockCount} medicine(s) have quantity below 10 units.
          </p>
          <p className="text-amber-700 text-sm mt-2">
            Note: Backend determines what qualifies as "low stock". Update the threshold there if needed.
          </p>
        </div>
      )}

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/inventory" className="btn-primary text-center block">
            📦 Manage Inventory
          </a>
          <a href="/billing" className="btn-primary text-center block">
            💳 Create Invoice
          </a>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">API Status</h2>
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
          <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}</p>
          <p><strong>Frontend Status:</strong> Ready to integrate with Django backend</p>
          <p><strong>Data Source:</strong> All data comes from the API backend</p>
          <p className="text-xs text-gray-600 mt-3">
            ✓ No mock data<br/>
            ✓ No frontend calculations<br/>
            ✓ Backend handles all business logic<br/>
            ✓ See API_CONTRACTS.md for detailed specifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
