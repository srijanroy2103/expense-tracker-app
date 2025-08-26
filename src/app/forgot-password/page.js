"use client";

import { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Forgot Password</h1>
        <p className='text-center text-gray-300'>Enter your email to receive a password reset link.</p>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          {message && <p className='text-center text-green-400'>{message}</p>}
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md'
            />
          </div>
          <button type='submit' disabled={isLoading} className='w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50'>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className='text-sm text-center text-gray-400'>
          Remember your password?{' '}
          <Link href='/login' className='font-medium text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;