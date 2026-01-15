import React, { useState } from 'react';
import ErrorAlert from '../Common/ErrorAlert';

/**
 * ProductTypeManager - Allows owner to add and manage custom product types
 * 
 * Features:
 * - Add new custom product types
 * - View default and custom types
 * - Cannot delete default types
 * - Shows indication of which types are defaults
 */
const ProductTypeManager = ({ productTypes = [], onTypeAdded, onTypeDeleted, loading = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeLabel, setNewTypeLabel] = useState('');
  const [error, setError] = useState('');
  const [addingType, setAddingType] = useState(false);

  const handleAddType = (e) => {
    e.preventDefault();
    setError('');

    if (!newTypeName.trim()) {
      setError('Type name is required');
      return;
    }

    if (!newTypeLabel.trim()) {
      setError('Label is required');
      return;
    }

    // Check for duplicates
    if (productTypes.find(t => t.id === newTypeName.toLowerCase() || t.label.toLowerCase() === newTypeLabel.toLowerCase())) {
      setError('This product type already exists');
      return;
    }

    setAddingType(true);
    if (onTypeAdded) {
      onTypeAdded({
        name: newTypeName.toLowerCase().replace(/\s+/g, '_'),
        label: newTypeLabel,
      }).then(() => {
        setNewTypeName('');
        setNewTypeLabel('');
        setShowAddForm(false);
        setAddingType(false);
      }).catch(err => {
        setError(err.message || 'Failed to add product type');
        setAddingType(false);
      });
    }
  };

  const handleDeleteType = (typeId) => {
    if (confirm(`Are you sure you want to delete "${typeId}"?`)) {
      if (onTypeDeleted) {
        onTypeDeleted(typeId);
      }
    }
  };

  const customTypes = productTypes.filter(t => !t.is_default);
  const defaultTypes = productTypes.filter(t => t.is_default);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Product Types Management</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            + Add Custom Type
          </button>
        )}
      </div>

      {error && <ErrorAlert error={error} onDismiss={() => setError('')} />}

      {/* Add Type Form */}
      {showAddForm && (
        <div className="card bg-blue-50 border border-blue-200">
          <h4 className="font-semibold mb-4">Add New Custom Product Type</h4>
          <form onSubmit={handleAddType} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Type Name (ID) *</label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., gel, spray, patch"
                  disabled={addingType}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will be converted to: {newTypeName.toLowerCase().replace(/\s+/g, '_')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Display Label *</label>
                <input
                  type="text"
                  value={newTypeLabel}
                  onChange={(e) => setNewTypeLabel(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., Gel, Spray, Patch"
                  disabled={addingType}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addingType || loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition text-sm"
              >
                {addingType ? 'Adding...' : 'Add Type'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTypeName('');
                  setNewTypeLabel('');
                  setError('');
                }}
                disabled={addingType}
                className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400 text-white px-4 py-2 rounded transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Types Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Types */}
        {defaultTypes.length > 0 && (
          <div className="card bg-green-50 border border-green-200">
            <h4 className="font-semibold mb-4 text-green-700">Default Types ({defaultTypes.length})</h4>
            <div className="space-y-2">
              {defaultTypes.map(type => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 bg-white rounded border border-green-100"
                >
                  <div>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-gray-500 ml-2">({type.id})</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Types */}
        {customTypes.length > 0 && (
          <div className="card bg-blue-50 border border-blue-200">
            <h4 className="font-semibold mb-4 text-blue-700">Custom Types ({customTypes.length})</h4>
            <div className="space-y-2">
              {customTypes.map(type => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 bg-white rounded border border-blue-100"
                >
                  <div>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-gray-500 ml-2">({type.id})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteType(type.id)}
                    disabled={loading}
                    className="text-xs bg-red-100 hover:bg-red-200 disabled:bg-gray-200 text-red-700 px-2 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {customTypes.length === 0 && (
          <div className="card bg-gray-50 border border-gray-200">
            <p className="text-gray-600 text-center py-4">
              No custom product types yet. Add one to get started!
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Once you add a custom product type, it will be available
          in the product form for all future products. Default types cannot be removed.
        </p>
      </div>
    </div>
  );
};

export default ProductTypeManager;
