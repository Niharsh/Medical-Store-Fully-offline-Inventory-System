# Before/After Comparison of Critical Fixes

## 1. API Service Token Key Fix

### ❌ BEFORE (Broken)
```javascript
// frontend/src/services/api.js
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken"); // ❌ WRONG KEY
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

**Problem**: AuthContext stores tokens as `access_token` and `refresh_token`, not `authToken`
→ `localStorage.getItem("authToken")` returns `null`
→ No Authorization header added to requests
→ Server returns 401 Unauthorized

### ✅ AFTER (Fixed)
```javascript
// frontend/src/services/api.js
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token"); // ✅ CORRECT KEY
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

---

## 2. API Service 401 Redirect Loop Fix

### ❌ BEFORE (Broken)
```javascript
// frontend/src/services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"; // ❌ AUTO-REDIRECT CAUSES LOOP
    }
    return Promise.reject(error);
  },
);
```

**Problem**:
1. Get 401 response (because no auth header)
2. Interceptor redirects to /login
3. Navigation causes App to re-render
4. Data contexts remount
5. Try to fetch data
6. Get 401 again (still no auth header due to token key bug)
7. Redirect again
8. INFINITE LOOP

### ✅ AFTER (Fixed)
```javascript
// frontend/src/services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status,
      message: error.response?.data?.detail || "Something went wrong",
      raw: error,
    };
    
    // ✅ IMPORTANT: Do NOT redirect on 401
    // AppContent handles routing based on auth state
    // This prevents infinite redirect loops
    
    return Promise.reject(normalizedError);
  },
);
```

**Solution**: Let AppContent/ProtectedRoute handle the routing instead of the interceptor

---

## 3. Data Context Auth Guard Fix

### ❌ BEFORE (Broken) - WholesalersContext
```javascript
export const WholesalersProvider = ({ children }) => {
  const [wholesalers, setWholesalers] = useState([]);

  // ❌ BROKEN: Fetches on mount without checking auth
  useEffect(() => {
    api.get('/wholesalers/')
      .then(res => {
        setWholesalers(res.data.results ?? res.data);
      })
      .catch(err => {
        console.error('Failed to load wholesalers', err);
      });
  }, []); // ❌ EMPTY DEPENDENCY - RUNS ON MOUNT
  
  // ...rest of code
};
```

**Problem**:
- useEffect with empty dependencies runs immediately on mount
- At this point, AuthContext might still be checking auth (loading=true)
- API call has no auth header (fixed in step 1) OR token exists but app is redirecting (loop from step 2)
- Gets 401 response

### ✅ AFTER (Fixed)
```javascript
import { useAuth } from './AuthContext'; // ✅ IMPORT AUTH HOOK

export const WholesalersProvider = ({ children }) => {
  const [wholesalers, setWholesalers] = useState([]);
  
  // ✅ FIXED: Check auth state before fetching
  const { isAuthenticated, loading: authLoading } = useAuth();

  // ✅ FIXED: Only fetch when authenticated and auth is not loading
  useEffect(() => {
    if (authLoading || !isAuthenticated) { // ✅ AUTH GUARD
      return; // Skip fetch if auth not ready
    }
    
    api.get('/wholesalers/')
      .then(res => {
        setWholesalers(res.data.results ?? res.data);
      })
      .catch(err => {
        console.error('Failed to load wholesalers', err);
      });
  }, [isAuthenticated, authLoading]); // ✅ DEPEND ON AUTH STATE
  
  // ...rest of code
};
```

**Solution**: 
- Import useAuth hook to check authentication state
- Add early return if auth is still loading or not authenticated
- Add auth state to dependency array so effect re-runs when auth status changes

---

## 4. Context Using Multiple Axios Instances Fix

### ❌ BEFORE (Broken) - SalesBillsContext
```javascript
import axios from 'axios'; // ❌ DIRECT AXIOS IMPORT (BYPASSES INTERCEPTOR)
import { API_URL } from '../constants';

export const SalesBillsProvider = ({ children }) => {
  const fetchSalesBills = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      // ❌ USING DIRECT AXIOS - NO AUTH INTERCEPTOR
      const response = await axios.get(`${API_URL}/sales-bills/`, { params });
      setSalesBills(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales bills');
    } finally {
      setLoading(false);
    }
  }, []);
```

**Problems**:
1. Uses direct axios import instead of shared api service
2. Bypasses the auth interceptor that adds Authorization header
3. Even if api.js was fixed, this still doesn't benefit from it
4. Has wrong token key issue AND 401 loop issue

### ✅ AFTER (Fixed)
```javascript
import api from '../services/api'; // ✅ USE SHARED API SERVICE
import { useAuth } from './AuthContext'; // ✅ IMPORT AUTH

export const SalesBillsProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // ✅ GET AUTH STATE

  const fetchSalesBills = useCallback(async (params = {}) => {
    // ✅ FIXED: Guard against unauthenticated requests
    if (authLoading || !isAuthenticated) {
      return;
    }
    
    setLoading(true);
    try {
      // ✅ USE SHARED API SERVICE WITH INTERCEPTOR
      const response = await api.get(`/sales-bills/`, { params });
      setSalesBills(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales bills');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]); // ✅ ADD AUTH DEPENDENCIES
```

**Solution**:
- Use shared api service instead of direct axios
- Automatically gets auth interceptor with correct token key
- Add auth guard to prevent premature fetches

---

## 5. Component Using Hardcoded URLs Fix

### ❌ BEFORE (Broken) - ShopDetails.jsx
```javascript
import axios from "axios"; // ❌ DIRECT AXIOS
import "http://127.0.0.1:8000/api/shop-profile/"; // ❌ HARDCODED URL
import "http://127.0.0.1:8000/api/shop-profile/"; // ❌ HARDCODED URL

const ShopDetails = () => {
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        // ❌ DIRECT AXIOS WITH HARDCODED URL - MULTIPLE PROBLEMS
        const res = await axios.get("http://127.0.0.1:8000/api/shop-profile/");
        // ...handle response
      } catch (err) {
        // ...handle error
      }
    };
    fetchShopDetails();
  }, []);

  const handleSubmit = async (e) => {
    try {
      // ❌ HARDCODED URL, DIRECT AXIOS, NO AUTH
      const response = await axios.post(
        "http://127.0.0.1:8000/api/shop-profile/",
        payload
      );
```

**Problems**:
1. Uses direct axios instead of shared api service
2. Hardcoded localhost URL (doesn't work in production)
3. Bypasses auth interceptor
4. No error handling for auth failures

### ✅ AFTER (Fixed)
```javascript
import api from "../../services/api"; // ✅ USE SHARED API SERVICE

const ShopDetails = () => {
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        // ✅ USE SHARED API SERVICE WITH RELATIVE URL
        const res = await api.get("/shop-profile/");
        // ...handle response
      } catch (err) {
        // ...handle error
      }
    };
    fetchShopDetails();
  }, []);

  const handleSubmit = async (e) => {
    try {
      // ✅ USE SHARED API, RELATIVE URL, HAS AUTH
      const response = await api.post(
        "/shop-profile/",
        payload
      );
```

**Solution**:
- Import shared api service
- Use relative URLs (relies on baseURL in api.js config)
- Automatically uses auth interceptor
- Works with environment variables for different deployments

---

## Summary of Changes

| Issue | Fix | Files | Impact |
|-------|-----|-------|--------|
| Token key mismatch | Changed `authToken` → `access_token` | `api.js` | ✅ Auth header now added to requests |
| 401 redirect loop | Removed auto-redirect, let AppContent route | `api.js` | ✅ Breaks infinite loop cycle |
| Context auto-fetching | Added auth guard to fetch functions | `WholesalersContext`, `SalesBillsContext`, `PurchaseBillsContext`, `ShopDetailsContext` | ✅ Prevents premature 401 responses |
| Multiple axios instances | Changed to shared api service | `SalesBillsContext`, `PurchaseBillsContext`, `ShopDetails.jsx` | ✅ All requests use auth interceptor |
| Hardcoded URLs | Changed to relative URLs | `ShopDetails.jsx` | ✅ Works in all environments |

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER OPENS APP                            │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  AuthProvider.useEffect runs                                │
│  - Calls /auth/check_owner/                                 │
│  - Calls /auth/me/ if token exists                          │
│  - Sets: loading=true                                       │
│  - Uses api.js with correct token key ✅                    │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  AppContent renders                                          │
│  - Sees: loading=true                                       │
│  - Shows: Loading spinner                                   │
│  - Mounts: AuthProvider ONLY                                │
│  - Does NOT mount: Data contexts yet ✅                     │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│  Auth check completes                                        │
│  - Sets: loading=false                                      │
│  - Sets: isAuthenticated = true/false                       │
└────────────────────────────┬────────────────────────────────┘
                ┌────────────┴────────────┐
                ↓                         ↓
         ┌────────────────┐      ┌──────────────────┐
         │ NOT AUTH       │      │ AUTHENTICATED    │
         │                │      │                  │
         │ Shows:         │      │ Mounts:          │
         │ LoginPage      │      │ ProductProvider  │
         │                │      │ InvoiceProvider  │
         │ User logs in   │      │ SalesBillsProvider
         │ ✅            │      │ etc.             │
         │                │      │                  │
         │ Redirects ─────┼─────→│ Each context:    │
         │ back to auth   │      │ - Checks auth ✅ │
         │ check          │      │ - Sees: ready    │
         └────────────────┘      │ - Fetches data   │
                                 │ - Gets 200 ✅   │
                                 │                  │
                                 │ Dashboard loads  │
                                 │ with data ✅    │
                                 └──────────────────┘
```

---

## How It Prevents the Loop

**OLD (Broken)**:
```
Try fetch (no auth header) → 401 → Redirect to /login → App rerenders 
→ Contexts remount → Try fetch again → 401 → Redirect again → LOOP ∞
```

**NEW (Fixed)**:
```
Auth check starts (loading=true)
  ↓
Contexts not mounted yet
  ↓
Auth check completes (loading=false, isAuthenticated=true)
  ↓
Contexts mount
  ↓
Contexts check auth guard (passes)
  ↓
Fetch with correct auth header (in Authorization header) ✅
  ↓
Gets 200 response ✅
  ↓
Dashboard shows data ✅
```

The key differences:
1. **Sequential, not concurrent**: Auth completes BEFORE contexts mount
2. **Guard pattern**: Contexts check auth before fetching
3. **Correct headers**: api.js uses correct token key ✅
4. **No auto-redirect**: 401 responses don't trigger navigation ✅
