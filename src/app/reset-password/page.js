"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message + ' Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Reset Your Password</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          {message && <p className='text-green-500 text-center'>{message}</p>}
          <div>
            <label htmlFor='password'>New Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md'
            />
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirm New Password</label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md'
            />
          </div>
          <button type='submit' disabled={isLoading} className='w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50'>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;