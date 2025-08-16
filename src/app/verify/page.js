"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // Get email from URL

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Verification failed.');
        return;
      }

      setSuccess('Verification successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError('An error occurred during verification.');
      console.error(err);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Verify Your Email</h1>
        <p className='text-center text-gray-300'>A verification code has been sent to {email}.</p>
        
        <form onSubmit={handleVerifySubmit} className='space-y-4'>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          {success && <p className='text-green-500 text-center'>{success}</p>}
          <div>
            <label htmlFor='code'>Verification Code</label>
            <input
              type='text'
              id='code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button type='submit' className='w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700'>Verify Account</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;