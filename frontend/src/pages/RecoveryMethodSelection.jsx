import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ title, description, badge, onClick }) => (
  <button
    onClick={onClick}
    className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition"
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div>
        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-md">
          {badge}
        </span>
      </div>
    </div>
  </button>
);

const RecoveryMethodSelection = () => {
  const navigate = useNavigate();
  const [offlineWarning, setOfflineWarning] = useState('');

  const handleEmailClick = () => {
    if (!navigator.onLine) {
      setOfflineWarning('Internet connection required for email recovery');
      return;
    }
    // Go to existing email reset flow
    navigate('/forgot-password/email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Choose a recovery method</h1>
          <p className="text-blue-100">Select how you want to reset your password</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          {offlineWarning && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
              {offlineWarning}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Reset using Admin Code"
              description="Use a locally-configured Admin Recovery Code. Works without internet access."
              badge="Offline"
              onClick={() => navigate('/forgot-password/admin')}
            />

            <Card
              title="Reset using Email"
              description="Sends a reset link to your email. Requires an active internet connection."
              badge="Internet required"
              onClick={handleEmailClick}
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          Choose an option that best fits your situation. <strong>Admin Code</strong> works offline without email.
        </p>
      </div>
    </div>
  );
};

export default RecoveryMethodSelection;
