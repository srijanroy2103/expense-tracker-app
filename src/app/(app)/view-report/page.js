import { Suspense } from 'react';
import ViewReportPageClient from './ViewReportPageClient';

const LoadingFallback = () => (
  <div className="text-center mt-20">
    <p>Loading Report...</p>
  </div>
);

export default function ViewReportPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ViewReportPageClient />
    </Suspense>
  );
}