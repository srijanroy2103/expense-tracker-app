"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className='w-full p-4 bg-transparent flex items-center justify-between'>
      <Link href='/' className='text-white text-2xl font-bold'>
        ExpenseTracker
      </Link>

      <div className='flex items-center gap-x-4'>
        {status === 'loading' ? (
          <div className='text-white'>Loading...</div>
        ) : session ? (
          <>
            <Link href='/dashboard' className='text-white hover:text-gray-300 transition-colors'>
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className='text-white bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-md'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href='/login' className='text-white hover:text-gray-300 transition-colors'>
              Login
            </Link>
            <Link href='/register' className='text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md'>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;