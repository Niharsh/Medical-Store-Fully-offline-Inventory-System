import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { InvoiceProvider } from './context/InvoiceContext';
import InvoiceDetail from './pages/InvoiceDetail';
import { SalesBillsProvider } from './context/SalesBillsContext';
import { PurchaseBillsProvider } from './context/PurchaseBillsContext';
import { WholesalersProvider } from './context/WholesalersContext';
import Header from './components/Common/Header';
import Navigation from './components/Common/Navigation';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import ProductSearch from './pages/ProductSearch';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ActivationPage from './pages/ActivationPage';
import './App.css';
import ErrorBoundary from './components/Common/ErrorBoundary';
import ShopDetails from './components/Settings/ShopDetails';


// Inner app component that uses auth context
function AppContent() {
  const { auth, ownerExists, loading } = useAuth();

  // check if we're in activation window (hash #activate) - if so, show activation page regardless of auth state
  const isActivationWindow = window.location.hash === '#activate' || window.location.hash === '#/activate';

  // if activation window, show activation page only
  if (isActivationWindow) {
    return (
      <Router>
        <Routes>
          <Route path="/activate" element={<ActivationPage />} />
          <Route path="*" element={<Navigate to="/activate" replace />} />
        </Routes>
      </Router>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If owner not yet created, show signup
  if (ownerExists === false) {
    return (
      <Router>
        <Routes>
          <Route path="/activate" element={<ActivationPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </Router>
    );
  }

  // If owner exists but not authenticated, show login/password recovery pages
  if (!auth) {
    return (
      <Router>
        <Routes>
          <Route path="/activate" element={<ActivationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // User is authenticated - show main app
  return (
    <Router>
      <ProductProvider>
        <InvoiceProvider>
          <SalesBillsProvider>
            <PurchaseBillsProvider>
              <WholesalersProvider>
                <div className="min-h-screen bg-gray-50">
                  <div className="print-hidden">
                    <Header />
                    <Navigation />
                  </div>
                  <Routes>
                    {/* License Activation - accessible anytime while logged in */}
                    <Route path="/activate" element={<ActivationPage />} />
                    
                    {/* Dashboard */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <Dashboard />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Inventory */}
                    <Route 
                      path="/inventory" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <Inventory />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Billing */}
                    <Route 
                      path="/billing" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <Billing />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Invoice Detail */}
                    <Route 
                      path="/billing/invoices/:id" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <InvoiceDetail />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Settings */}
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <Settings />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Search */}
                    <Route 
                      path="/search" 
                      element={
                        <ProtectedRoute>
                          <main className="w-full px-6 py-8 lg:px-8">
                            <ProductSearch />
                          </main>
                        </ProtectedRoute>
                      } 
                    />
                    {/* Default redirect to dashboard */}
                    <Route 
                      path="/" 
                      element={<Navigate to="/dashboard" replace />} 
                    />
                  </Routes>
                </div>
              </WholesalersProvider>
            </PurchaseBillsProvider>
          </SalesBillsProvider>
        </InvoiceProvider>
      </ProductProvider>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
