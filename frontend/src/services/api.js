// Placeholder API adapter for Electron migration (Step 1)
// Replaces axios-based backend calls with a thin IPC placeholder.
// All methods return a benign, non-throwing shape so the UI can render
// without a backend. Actual IPC handlers will be implemented later.

const DEFAULT_PLACEHOLDER_RESPONSE = {
  data: {
    tokens: { access: "", refresh: "" },
    owner: null,
    results: [],
    count: 0,
  },
};

const api = {
  get: async (url, opts) => {
    console.warn('api.get placeholder called for', url, opts);
    if (window?.api?.placeholderFunction) {
      try {
        const res = await window.api.placeholderFunction({ method: 'get', url, opts });
        return res ?? DEFAULT_PLACEHOLDER_RESPONSE;
      } catch (e) {
        return DEFAULT_PLACEHOLDER_RESPONSE;
      }
    }
    return DEFAULT_PLACEHOLDER_RESPONSE;
  },
  post: async (url, data, opts) => {
    console.warn('api.post placeholder called for', url, data);
    if (window?.api?.placeholderFunction) {
      try {
        const res = await window.api.placeholderFunction({ method: 'post', url, data, opts });
        return res ?? DEFAULT_PLACEHOLDER_RESPONSE;
      } catch (e) {
        return DEFAULT_PLACEHOLDER_RESPONSE;
      }
    }
    return DEFAULT_PLACEHOLDER_RESPONSE;
  },
  patch: async (url, data, opts) => {
    console.warn('api.patch placeholder called for', url, data);
    if (window?.api?.placeholderFunction) {
      try {
        const res = await window.api.placeholderFunction({ method: 'patch', url, data, opts });
        return res ?? DEFAULT_PLACEHOLDER_RESPONSE;
      } catch (e) {
        return DEFAULT_PLACEHOLDER_RESPONSE;
      }
    }
    return DEFAULT_PLACEHOLDER_RESPONSE;
  },
  delete: async (url, opts) => {
    console.warn('api.delete placeholder called for', url, opts);
    if (window?.api?.placeholderFunction) {
      try {
        const res = await window.api.placeholderFunction({ method: 'delete', url, opts });
        return res ?? DEFAULT_PLACEHOLDER_RESPONSE;
      } catch (e) {
        return DEFAULT_PLACEHOLDER_RESPONSE;
      }
    }
    return DEFAULT_PLACEHOLDER_RESPONSE;
  },
};

export default api;