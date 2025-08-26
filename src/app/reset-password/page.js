import { Suspense } from 'react';
import ResetPasswordPageClient from './ResetPasswordPageClient';

const LoadingFallback = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}