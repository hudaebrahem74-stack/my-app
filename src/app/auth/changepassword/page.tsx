'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ChangePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e =
      searchParams.get('email') ||
      sessionStorage.getItem('resetEmail') ||
      '';
    setEmail(e);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        'https://ecommerce.routemisr.com/api/v1/auth/resetPassword',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword, resetCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      alert('Password changed successfully ✅');
      router.push('/login');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
          Change Password
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="text"
          placeholder="Reset Code"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>

        <Link
          href="/login"
          className="block text-center mt-4 text-sm text-green-600 hover:underline"
        >
          Back to Login
        </Link>
      </form>
    </div>
  );
}