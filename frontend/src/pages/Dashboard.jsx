import React, { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useInvoices } from '../context/InvoiceContext';
import { useSalesBills } from '../context/SalesBillsContext';
import { usePurchaseBills } from '../context/PurchaseBillsContext';
import api from '../services/api';
import PurchasesTable from '../components/SalesAndPurchases/PurchasesTable';
import PurchasesForm from '../components/SalesAndPurchases/PurchasesForm';

/**
 * Dashboard Page - Overview of medical store inventory and billing
 * 
 * Displays:
 * - Total products (all types: tablets, syrups, powders, creams, diapers, condoms, sachets)
 * - Low stock items (fetched from backend with product-specific thresholds)
 * - Expiry overview with filtering (6/3/1 month)
 * - Sales & Purchases Overview with paid/due tracking
 * 
 * All data from API - no business logic in frontend
 */
const Dashboard = () => {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { invoices, fetchInvoices } = useInvoices();
  const { summary: salesSummary, fetchSummary: fetchSalesSummary } = useSalesBills();
  const { summary: purchaseSummary, fetchSummary: fetchPurchasesSummary } = usePurchaseBills();
  const [stats, setStats] = useState({
    totalProducts: 0,
    recentInvoices: 0,
  });
  // Low stock state - fetched from API
  const [lowStockItems, setLowStockItems] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lowStockLoading, setLowStockLoading] = useState(false);
  const [lowStockError, setLowStockError] = useState('');
  
  const [selectedExpiryRange, setSelectedExpiryRange] = useState(null);
  const [expiringBatches, setExpiringBatches] = useState([]);
  const [expiryLoading, setExpiryLoading] = useState(false);
  const [expiryError, setExpiryError] = useState('');
  const [salesPurchasesPeriod, setSalesPurchasesPeriod] = useState('month');

  // Fetch low stock items from API
  const fetchLowStockItems = async () => {
    setLowStockLoading(true);
    setLowStockError('');
    try {
      const response = await api.get('/products/low_stock/');
      console.log('✅ Low stock items fetched:', response.data);
      setLowStockItems(response.data.low_stock_items || []);
      setLowStockCount(response.data.count || 0);
    } catch (error) {
      console.error('❌ Error fetching low stock items:', error);
      setLowStockError('Failed to fetch low stock information');
      setLowStockItems([]);
      setLowStockCount(0);
    } finally {
      setLowStockLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
    fetchLowStockItems();
    fetchSalesSummary(salesPurchasesPeriod);
    fetchPurchasesSummary(salesPurchasesPeriod);
  }, [salesPurchasesPeriod]);

  // Fetch expiring batches from API
  const fetchExpiringBatches = async (months) => {
    setExpiryLoading(true);
    setExpiryError('');
    try {
      const response = await api.get(`/batches/expiring/?months=${months}`);
      console.log('✅ Expiring batches fetched:', response.data);
      setExpiringBatches(response.data.batches || []);
    } catch (error) {
      console.error('❌ Error fetching expiring batches:', error);
      setExpiryError('Failed to fetch expiring products');
      setExpiringBatches([]);
    } finally {
      setExpiryLoading(false);
    }
  };

  // Handle expiry filter click
  const handleExpiryFilter = (months) => {
    if (selectedExpiryRange === months) {
      setSelectedExpiryRange(null);
      setExpiringBatches([]);
    } else {
      setSelectedExpiryRange(months);
      fetchExpiringBatches(months);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get expiry status
  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-700 bg-red-100' };
    if (daysLeft <= 30) return { text: `Expires in ${daysLeft}d`, color: 'text-orange-700 bg-orange-100' };
    if (daysLeft <= 90) return { text: `Expires in ${daysLeft}d`, color: 'text-yellow-700 bg-yellow-100' };
    return { text: `Expires in ${daysLeft}d`, color: 'text-green-700 bg-green-100' };
  };

  useEffect(() => {
    // Update stats from fetched data
    setStats({
      totalProducts: products.length,
      recentInvoices: invoices.length,
    });
  }, [products, invoices]);

  const StatCard = ({ title, value, color = 'sky' }) => (
    <div className={`card bg-${color}-50 border-l-4 border-${color}-600`}>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className={`text-4xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );

  // Get severity color for low stock
  const getSeverityColor = (severity) => {
    if (severity === 'critical') {
      return 'bg-red-100 border-red-300 text-red-900';
    }
    return 'bg-yellow-100 border-yellow-300 text-yellow-900';
  };

  // Get severity badge
  const getSeverityBadge = (severity) => {
    if (severity === 'critical') {
      return <span className="inline-block px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">CRITICAL</span>;
    }
    return <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-600 text-white rounded">WARNING</span>;
  };

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
          value={lowStockCount}
          color="amber"
        />
        <StatCard 
          title="Recent Invoices" 
          value={stats.recentInvoices}
          color="green"
        />
      </div>

      {/* Low Stock Alert Section */}
      {lowStockCount > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">⚠️ Low Stock Alert</h2>
          <p className="text-gray-600 mb-4">
            {lowStockCount} medicine{lowStockCount !== 1 ? 's have' : ' has'} fallen below minimum stock level. Please reorder immediately.
          </p>
          
          {lowStockError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
              {lowStockError}
            </div>
          )}

          {lowStockLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading low stock information...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2">Medicine Name</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-center px-4 py-2">Current Stock</th>
                    <th className="text-center px-4 py-2">Minimum Required</th>
                    <th className="text-center px-4 py-2">Units Below</th>
                    <th className="text-center px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item.product_id} className={`border-b ${getSeverityColor(item.severity)}`}>
                      <td className="px-4 py-3 font-semibold">{item.product_name}</td>
                      <td className="px-4 py-3">{item.product_type}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold">{item.current_stock}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold">{item.min_stock_level}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-red-600">-{item.units_below}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getSeverityBadge(item.severity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* No low stock items message */}
      {lowStockCount === 0 && !lowStockLoading && (
        <div className="card bg-green-50 border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ All Stock Levels Normal
          </h3>
          <p className="text-green-800">
            All medicines are currently above their minimum stock levels. No reordering needed at this time.
          </p>
        </div>
      )}

      {/* Expiry Overview Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">📅 Expiry Overview</h2>
        <p className="text-gray-600 mb-4">Click on a timeframe to see batches expiring within that period:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleExpiryFilter(6)}
            className={`p-4 rounded-lg font-semibold transition ${
              selectedExpiryRange === 6
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            📆 Expiring in 6 Months
          </button>
          <button
            onClick={() => handleExpiryFilter(3)}
            className={`p-4 rounded-lg font-semibold transition ${
              selectedExpiryRange === 3
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            ⏰ Expiring in 3 Months
          </button>
          <button
            onClick={() => handleExpiryFilter(1)}
            className={`p-4 rounded-lg font-semibold transition ${
              selectedExpiryRange === 1
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🔴 Expiring in 1 Month
          </button>
        </div>

        {/* Expiring Batches List */}
        {selectedExpiryRange && (
          <div>
            <h3 className="font-semibold mb-4 text-lg">
              Batches expiring in {selectedExpiryRange} month{selectedExpiryRange > 1 ? 's' : ''}:
              <span className="ml-2 text-2xl font-bold text-blue-600">{expiringBatches.length}</span>
            </h3>

            {expiryError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
                {expiryError}
              </div>
            )}

            {expiryLoading ? (
              <p className="text-gray-600 text-center py-8">Loading expiring batches...</p>
            ) : expiringBatches.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No batches expiring in this timeframe. Great!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3">Product Name</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-center py-3">Batch No</th>
                      <th className="text-center py-3">Quantity</th>
                      <th className="text-center py-3">Expiry Date</th>
                      <th className="text-center py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringBatches.map(batch => {
                      const expiryStatus = getExpiryStatus(batch.expiry_date);
                      return (
                        <tr key={batch.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 font-semibold">{batch.product_name}</td>
                          <td className="py-3 text-gray-600 text-sm">
                            {batch.product_type.charAt(0).toUpperCase() + batch.product_type.slice(1)}
                          </td>
                          <td className="py-3 text-center text-sm">{batch.batch_number}</td>
                          <td className="py-3 text-center">{batch.quantity}</td>
                          <td className="py-3 text-center">{formatDate(batch.expiry_date)}</td>
                          <td className="py-3 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${expiryStatus.color}`}>
                              {expiryStatus.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sales & Purchases Overview Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">💰 Sales & Purchases Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSalesPurchasesPeriod('month')}
              className={`px-4 py-2 rounded font-semibold transition ${
                salesPurchasesPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 Monthly
            </button>
            <button
              onClick={() => setSalesPurchasesPeriod('year')}
              className={`px-4 py-2 rounded font-semibold transition ${
                salesPurchasesPeriod === 'year'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 Annually
            </button>
          </div>
        </div>

        {/* 4-Card Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Sales</p>
                <p className="text-4xl font-bold text-green-600">₹{parseFloat(salesSummary.total_sales || 0).toFixed(2)}</p>
              </div>
              <div className="text-5xl opacity-20">💳</div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Purchases</p>
                <p className="text-4xl font-bold text-blue-600">₹{parseFloat(purchaseSummary.total_purchases || 0).toFixed(2)}</p>
              </div>
              <div className="text-5xl opacity-20">📦</div>
            </div>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Amount Paid</p>
                <p className="text-4xl font-bold text-emerald-600">₹{(parseFloat(salesSummary.total_paid || 0) + parseFloat(purchaseSummary.total_paid || 0)).toFixed(2)}</p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Amount Due</p>
                <p className="text-4xl font-bold text-orange-600">₹{(parseFloat(salesSummary.total_due || 0) + parseFloat(purchaseSummary.total_due || 0)).toFixed(2)}</p>
              </div>
              <div className="text-5xl opacity-20">📋</div>
            </div>
          </div>
        </div>

        {/* Purchase Management Section */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Purchase Management</h3>
            <PurchasesForm onSuccess={() => {}} />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Purchase Bills</h3>
            <PurchasesTable period={salesPurchasesPeriod} />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;

