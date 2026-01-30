import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCodeVerify = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    const stored = localStorage.getItem('admin_recovery_code');

    if (!stored) {
      setError('No Admin Recovery Code is configured. Open Settings to configure it.');
      return;
    }

    if (code.trim() === stored.trim()) {
      // Mark the admin flow as verified for a single-use session
      sessionStorage.setItem('admin_verified', 'true');
      // Proceed to set-new-password screen (linear flow)
      navigate('/forgot-password/admin/reset');
    } else {
      setError('Admin code does not match.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Enter Admin Recovery Code</h2>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Recovery Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Verify Code
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> This code is stored locally on this machine and is required to perform an offline password reset.
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCodeVerify;
