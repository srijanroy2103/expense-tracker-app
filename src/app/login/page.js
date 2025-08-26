// Add the functional LoginPage code from the previous response.
// The code connects to NextAuth's signIn function for both credentials and Google.
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Login</h1>
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <form onSubmit={handleCredentialsLogin} className='space-y-4'>
          <div>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div className='text-right'>
            <Link href='/forgot-password' className='text-sm text-blue-400 hover:underline'>
            Forgot Password?
            </Link>
          </div>
          <button type='submit' className='w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Login</button>
        </form>
        <div className='flex items-center justify-center space-x-2'><hr className='w-full border-gray-600' /><span className='text-gray-400'>OR</span><hr className='w-full border-gray-600' /></div>
        <button onClick={handleGoogleLogin} className='w-full py-2 flex items-center justify-center gap-x-2 text-white bg-red-600 rounded-md hover:bg-red-700'>Sign in with Google</button>
        <p className='text-sm text-center text-gray-400'>
          Dont have an account?{' '}
          <Link href='/register' className='font-medium text-blue-500 hover:underline'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;