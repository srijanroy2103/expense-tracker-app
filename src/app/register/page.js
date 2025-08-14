"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState(''); // New state for password validation

  // Function to validate the password
  const validatePassword = () => {
    // Regex for password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (password && !passwordRegex.test(password)) {
      setPasswordError('Password must be 8+ characters and include an uppercase letter, a number, and a special character.');
    } else {
      setPasswordError(''); // Clear error if valid or empty
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Re-validate password on submit, just in case
    validatePassword();
    if (passwordError) {
      return; // Stop submission if there's a password error
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'An error occurred.');
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md p-8 space-y-6 bg-slate-800/50 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Create an Account</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && <p className='text-red-500 text-center'>{error}</p>}
          {success && <p className='text-green-500 text-center'>{success}</p>}
          <div>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword} //  <-- Event handler added here
              required
              className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {/* Display password error message here */}
            {passwordError && <p className='text-red-500 text-sm mt-1'>{passwordError}</p>}
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className='w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' />
          </div>
          <button type='submit' className='w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700'>Register</button>
        </form>
        <p className='text-sm text-center text-gray-400'>
          Already have an account?{' '}
          <Link href='/login' className='font-medium text-blue-500 hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;