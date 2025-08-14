"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  if (status === "loading") {
    return <p className='text-center mt-10'>Loading...</p>;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen -mt-16'>
      <div className='p-8 bg-slate-800/50 rounded-lg shadow-lg text-center'>
        <h1 className='text-3xl font-bold mb-4'>Welcome, {session.user?.name}</h1>
        <p className='text-lg text-gray-300 mb-6'>Signed in as: {session.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className='px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700'
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default DashboardPage;