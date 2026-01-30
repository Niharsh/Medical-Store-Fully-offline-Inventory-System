import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper: SHA-256 hash -> hex
async function hashPasswordHex(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const AdminPasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_verified') !== 'true') {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // Offline-first approach: store a local override so the user can log in immediately
      const hash = await hashPasswordHex(password);
      const key = 'offline_passwords';
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing[email.trim().toLowerCase()] = { hash, updated_at: Date.now() };
      localStorage.setItem(key, JSON.stringify(existing));

      // Clear the admin verification flag and redirect to login (linear flow)
      sessionStorage.removeItem('admin_verified');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Set New Password</h2>

          {error && <div className="text-red-600 mb-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Account Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? 'Saving...' : 'Set Password Locally'}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            This sets a local password override so you can sign in immediately from this device even without internet. It does not change the server password.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordReset;
