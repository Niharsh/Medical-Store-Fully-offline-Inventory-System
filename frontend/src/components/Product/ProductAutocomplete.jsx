import React, { useState, useEffect, useRef } from 'react';

/**
 * ProductAutocomplete - Local filtering for product search
 * 
 * Features:
 * - Receives products from props (ProductContext) - no local loading
 * - Real-time local filtering as user types
 * - Case-insensitive startsWith() search on product name
 * - NO backend calls on keypress
 * - Select from dropdown to trigger edit
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - Click outside to close dropdown
 */
const ProductAutocomplete = ({ products = [], onSelectProduct, isLoading, resultsCount }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter products locally when input changes OR when products prop changes
  useEffect(() => {
    // If input is empty, close dropdown
    if (!inputValue || inputValue.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    // Perform local filtering using startsWith (case-insensitive)
    const searchTerm = inputValue.trim().toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().startsWith(searchTerm)
    );

    console.log(`🔍 Local filter: "${inputValue}" → ${filtered.length} results`);
    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [inputValue, products]);

  // Handle input change - NEVER clears automatically
  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(`⌨️  User typed: "${value}"`);
    setInputValue(value);  // Always update, never prevent
  };

  // Prevent form submission and handle keyboard navigation
  const handleInputKeyDown = (e) => {
    try {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log('⏎ Enter pressed');
        // If suggestion is highlighted, select it
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelectProduct(suggestions[highlightedIndex]);
          return;
        }
        // Close dropdown
        setIsOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        console.log('❌ Escape pressed');
        setIsOpen(false);
        setHighlightedIndex(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        console.log('⬇️  Arrow Down');
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        console.log('⬆️  Arrow Up');
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
      }
    } catch (error) {
      console.error('❌ Error handling keyboard event:', error);
    }
  };

  // Select a product from dropdown
  const handleSelectProduct = (product) => {
    try {
      console.log(`✅ Product selected: ${product.name}`);
      
      // Update input with selected product name (don't clear)
      setInputValue(product.name);
      
      // Close dropdown
      setIsOpen(false);
      setSuggestions([]);
      setHighlightedIndex(-1);
      
      // Trigger edit callback
      if (onSelectProduct) {
        onSelectProduct(product);
      }
    } catch (error) {
      console.error('❌ Error selecting product:', error);
      // Don't clear input on error
    }
  };

  // Clear search input
  const handleClear = (e) => {
    try {
      e.preventDefault();
      console.log('🗑️  Clearing search');
      setInputValue('');
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    } catch (error) {
      console.error('❌ Error clearing input:', error);
      // Fail gracefully - don't let error propagate
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 relative" ref={dropdownRef}>
      <div className="flex items-center gap-3">
        {/* Search Icon */}
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Search Input - NOT in a form, so no auto-submit */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Type any letter to search... (e.g., 'a', 'as', 'asp')"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => {
            if (inputValue.trim().length > 0 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          autoComplete="off"
        />

        {/* Clear Button */}
        {inputValue && (
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
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && inputValue && suggestions.length > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {suggestions.length} match{suggestions.length !== 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        💡 Tip: Type one or more letters to see suggestions. Use ↑↓ arrows to navigate, Enter to select, Esc to close.
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className={`px-4 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                index === highlightedIndex
                  ? 'bg-sky-100 text-sky-900'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-gray-500">
                  {product.generic_name && <span>{product.generic_name} • </span>}
                  {product.manufacturer}
                </div>
              </div>
              <div className="text-xs text-gray-400 ml-2">
                {product.product_type?.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && inputValue && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50 px-4 py-3 text-sm text-gray-500">
          No products found matching "{inputValue}"
        </div>
      )}
    </div>
  );
};

export default ProductAutocomplete;
