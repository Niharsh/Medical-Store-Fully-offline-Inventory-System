import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: Use correct token key from AuthContext
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ FIXED: Don't redirect on 401 - let AppContent handle routing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status,
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Something went wrong",
      raw: error,
    };

    // ✅ IMPORTANT: Do NOT redirect on 401
    // AppContent handles routing based on auth state
    // This prevents infinite redirect loops

    return Promise.reject(normalizedError);
  },
);

export default api;
