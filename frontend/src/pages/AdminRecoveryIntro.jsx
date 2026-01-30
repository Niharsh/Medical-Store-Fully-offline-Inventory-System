import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRecoveryIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Code Recovery (Offline)</h1>
          <p className="text-blue-100">This method is intended for shop owners and administrators.</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Offline Admin Code</h2>
          <p className="text-gray-600 mb-4">
            If your shop has an Admin Recovery Code configured, you can use it to verify your identity without internet access. This method does not use email.
          </p>

          <div className="mb-4">
            <button
              onClick={() => navigate('/forgot-password/admin/verify')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Proceed to Admin Code Verification
            </button>
          </div>

          <div className="mb-2 text-sm text-gray-600">
            <strong>Note:</strong> If your system doesn't have an Admin Recovery Code configured, this option will not work. You can choose Email Reset instead.
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

        <p className="text-center text-blue-100 text-sm mt-6">
          Admin Code recovery is ideal for installed desktop (.exe) systems where email may not be available.
        </p>
      </div>
    </div>
  );
};

export default AdminRecoveryIntro;
