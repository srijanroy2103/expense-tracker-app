"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const DashboardPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // We will add logic here later to check if categories are already set up.
    // For now, we always redirect to the setup page.
    if (status === 'authenticated') {
      router.replace('/add-expense');
    }
  }, [status, router]);

  // Display a loading message while the redirect happens
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Loading your dashboard...</p>
    </div>
  );
};

export default DashboardPage;