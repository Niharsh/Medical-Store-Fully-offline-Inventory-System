import React, { useState } from 'react';
import ErrorAlert from '../Common/ErrorAlert';

/**
 * HSNManager - Allows owner to add and manage HSN (Harmonized System Nomenclature) codes
 * 
 * Features:
 * - Add new HSN codes with GST rates
 * - View all HSN codes
 * - Edit existing HSN codes
 * - Delete HSN codes
 * - Shows GST rate for each HSN code
 */
const HSNManager = ({ hsns = [], onHSNAdded, onHSNUpdated, onHSNDeleted, loading = false }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [hsnCode, setHsnCode] = useState('');
  const [description, setDescription] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    setError('');

    if (!hsnCode.trim()) {
      setError('HSN Code is required');
      return;
    }

    if (gstRate === '' || isNaN(gstRate) || parseFloat(gstRate) < 0) {
      setError('GST Rate must be a valid non-negative number');
      return;
    }

    // Check for duplicates when adding (not when editing)
    if (!editingCode && hsns.find(h => h.hsn_code === hsnCode.trim())) {
      setError('This HSN code already exists');
      return;
    }

    const hsnData = {
      hsn_code: hsnCode.trim(),
      description: description.trim(),
      gst_rate: parseFloat(gstRate),
    };

    setSubmitting(true);
    
    if (editingCode) {
      // Update existing HSN
      if (onHSNUpdated) {
        onHSNUpdated(editingCode, hsnData)
          .then(() => {
            resetForm();
            setSubmitting(false);
          })
          .catch(err => {
            setError(err.message || 'Failed to update HSN code');
            setSubmitting(false);
          });
      }
    } else {
      // Add new HSN
      if (onHSNAdded) {
        onHSNAdded(hsnData)
          .then(() => {
            resetForm();
            setSubmitting(false);
          })
          .catch(err => {
            setError(err.message || 'Failed to add HSN code');
            setSubmitting(false);
          });
      }
    }
  };

  const resetForm = () => {
    setHsnCode('');
    setDescription('');
    setGstRate('');
    setShowAddForm(false);
    setEditingCode(null);
    setError('');
  };

  const handleEdit = (hsn) => {
    setHsnCode(hsn.hsn_code);
    setDescription(hsn.description || '');
    setGstRate(hsn.gst_rate.toString());
    setEditingCode(hsn.hsn_code);
    setShowAddForm(true);
    setError('');
  };

  const handleDeleteHSN = (code) => {
    if (confirm(`Are you sure you want to delete HSN code "${code}"? This cannot be undone.`)) {
      if (onHSNDeleted) {
        onHSNDeleted(code);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">HSN Code Management</h3>
        {!showAddForm && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            + Add HSN Code
          </button>
        )}
      </div>

      {error && <ErrorAlert error={error} onDismiss={() => setError('')} />}

      {/* Add/Edit HSN Form */}
      {showAddForm && (
        <div className="card bg-blue-50 border border-blue-200">
          <h4 className="font-semibold mb-4">
            {editingCode ? `Edit HSN Code: ${editingCode}` : 'Add New HSN Code'}
          </h4>
          <form onSubmit={handleAddOrUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">HSN Code *</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., 3004, 3003"
                  disabled={submitting || !!editingCode}
                  maxLength="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique HSN code for tax classification
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">GST Rate (%) *</label>
                <input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., 5, 12, 18"
                  disabled={submitting}
                  min="0"
                  max="100"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  GST rate for this HSN code
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g., Medicaments - Antibiotics"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional description
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting || loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition text-sm"
              >
                {submitting ? (editingCode ? 'Updating...' : 'Adding...') : (editingCode ? 'Update Code' : 'Add Code')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-400 text-white px-4 py-2 rounded transition text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HSN Codes Display */}
      <div>
        {hsns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">HSN Code</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 text-left font-semibold">GST Rate</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hsns.map(hsn => (
                  <tr key={hsn.hsn_code} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{hsn.hsn_code}</td>
                    <td className="px-4 py-3 text-gray-700">{hsn.description || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {hsn.gst_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        hsn.is_active 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {hsn.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(hsn)}
                        disabled={loading}
                        className="text-xs bg-blue-100 hover:bg-blue-200 disabled:bg-gray-200 text-blue-700 px-2 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHSN(hsn.hsn_code)}
                        disabled={loading}
                        className="text-xs bg-red-100 hover:bg-red-200 disabled:bg-gray-200 text-red-700 px-2 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card bg-gray-50 border border-gray-200 text-center py-8">
            <p className="text-gray-600 mb-4">
              No HSN codes defined yet. Add one to get started!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition inline-block"
            >
              + Add First HSN Code
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong>
        </p>
        <ul className="text-sm text-blue-700 list-disc list-inside mt-2 space-y-1">
          <li>HSN codes are used for tax classification of products</li>
          <li>Once you add an HSN code, you can link it to products during creation/editing</li>
          <li>Each product can have only one HSN code</li>
          <li>The GST rate defined here will be automatically used during billing</li>
        </ul>
      </div>
    </div>
  );
};

export default HSNManager;
