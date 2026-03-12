import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/Common/ErrorAlert';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPasswordWithRecoveryCode, loading } = useAuth();
  
  const [username, setUsername] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter username+recovery code, Step 2: Enter new password

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = 'Username is required';
    }
    
    if (!recoveryCode) {
      newErrors.recoveryCode = 'Recovery code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') setUsername(value);
    else if (name === 'recoveryCode') setRecoveryCode(value);
    else if (name === 'newPassword') setNewPassword(value);
    else if (name === 'confirmPassword') setConfirmPassword(value);
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateStep1()) {
      return;
    }

    try {
      setIsSubmitting(true);
      // Verify recovery code (this calls the context method)
      // For now, we'll proceed to step 2 - actual verification happens on step 2 submit
      setStep(2);
    } catch (err) {
      setGeneralError(err.message || 'Failed to verify recovery code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateStep2()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordWithRecoveryCode(username, recoveryCode, newPassword);
      
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setGeneralError(
        err.response?.data?.detail || 
        err.message ||
        'Invalid recovery code or failed to reset password'
      );
      setStep(1); // Go back to step 1
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💊 Medical Shop</h1>
          <p className="text-blue-100">Inventory Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter your username and recovery code to reset your password.
          </p>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold mb-2">✓ Password Reset!</p>
              <p className="text-green-700 text-sm mb-4">
                Your password has been reset successfully.
              </p>
              <p className="text-gray-600 text-sm">
                Redirecting to login in a few seconds...
              </p>
            </div>
          ) : (
            <>
              {generalError && (
                <ErrorAlert error={generalError} onDismiss={() => setGeneralError('')} />
              )}

              {step === 1 ? (
                // Step 1: Username + Recovery Code
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.username && (
                      <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                    )}
                  </div>

                  {/* Recovery Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recovery Code
                    </label>
                    <input
                      type="password"
                      name="recoveryCode"
                      value={recoveryCode}
                      onChange={handleChange}
                      placeholder="Enter your recovery code"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.recoveryCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.recoveryCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.recoveryCode}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Verifying...' : 'Next'}
                  </button>
                </form>
              ) : (
                // Step 2: New Password
                <form onSubmit={handleStep2Submit} className="space-y-4">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-400"
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ Recovery Code:</strong> This was provided by your administrator during setup.
            </p>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          Secure. Local. Offline-First Medical Billing
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
