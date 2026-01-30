import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'

import { ProductProvider } from './context/ProductContext'
import { WholesalersProvider } from './context/WholesalersContext'
import { ShopDetailsProvider } from './context/ShopDetailsContext'
import { AuthProvider } from './context/AuthContext'
import { SalesBillsProvider } from './context/SalesBillsContext'
import { PurchaseBillsProvider } from './context/PurchaseBillsContext'

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ShopDetailsProvider>
      <WholesalersProvider>
        <SalesBillsProvider>
          <PurchaseBillsProvider>
            <App />
          </PurchaseBillsProvider>
        </SalesBillsProvider>
      </WholesalersProvider>
    </ShopDetailsProvider>
  </AuthProvider>
);


