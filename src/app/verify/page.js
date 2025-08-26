import { Suspense } from 'react';
import VerifyPageClient from './VerifyPageClient';

// A simple loading component to show while the client component loads
const LoadingFallback = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyPageClient />
    </Suspense>
  );
}