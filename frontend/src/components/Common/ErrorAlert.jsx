import React from 'react';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex justify-between items-center">
      <div className="text-red-700">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
