import React from 'react';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  // Handle complex error messages that might contain details
  const renderErrorContent = () => {
    if (typeof error === 'string') {
      return error;
    }
    // If error is an object, try to extract message
    if (typeof error === 'object') {
      return error.message || JSON.stringify(error);
    }
    return String(error);
  };

  const errorContent = renderErrorContent();
  const lines = errorContent.split('\n');

  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold text-lg">⚠️</span>
            <p className="font-semibold text-red-800">Billing Error</p>
          </div>
          <div className="text-red-700 mt-2 text-sm space-y-1">
            {lines.map((line, idx) => (
              line.trim() && <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 text-xl font-bold flex-shrink-0"
            title="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
