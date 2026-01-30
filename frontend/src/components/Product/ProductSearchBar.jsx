import React, { useState, useCallback, useEffect } from 'react';

/**
 * ProductSearchBar - Search input component for finding products quickly
 * 
 * Features:
 * - Real-time search as user types (debounced)
 * - Search by: product name, generic name, manufacturer
 * - Case-insensitive search (handled by backend)
 * - Clear button to reset search
 * - Displays search results count
 */
const ProductSearchBar = ({ onSearch, resultsCount, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Call onSearch only when debounced query actually changes
  // Skip initial empty string to prevent unnecessary fetch on mount
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  // Handle clear search
  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  // Handle input change
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center gap-3">
        {/* Search Icon */}
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by product name, generic name, or manufacturer..."
          value={searchQuery}
          onChange={handleChange}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Clear search"
          >
            ✕ Clear
          </button>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500">Searching...</span>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && searchQuery && (
          <span className="text-sm font-medium text-gray-600">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        💡 Tip: Search is case-insensitive. Type product name, generic name, or manufacturer to find items quickly.
      </div>
    </div>
  );
};

export default ProductSearchBar;
