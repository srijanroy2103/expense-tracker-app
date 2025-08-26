import { Suspense } from 'react';
import dbConnect from '@/lib/dbConnect';
import CategorySetup from '@/models/CategorySetup';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ViewReportPageClient from './ViewReportPageClient';

// This is the Server Component. It fetches initial data.
async function getCategoryData() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { customCategories: [], creditCardCategories: [] };
  }
  
  await dbConnect();
  const setup = await CategorySetup.findOne({ userId: session.user.id }).lean();
  
  if (!setup) {
    return { customCategories: [], creditCardCategories: [] };
  }
  
  // We need to convert MongoDB documents to plain objects for the client
  const customCategories = setup.customCategories.map(cat => ({
    ...cat,
    _id: cat._id.toString(),
    subcategories: cat.subcategories.map(sub => ({ ...sub, _id: sub._id.toString() }))
  }));

  const creditCardCategories = setup.creditCards.map(card => ({
    ...card,
    _id: card._id.toString(),
    subcategories: card.subcategories.map(sub => ({ ...sub, _id: sub._id.toString() }))
  }));

  return { customCategories, creditCardCategories };
}

// A simple loading component for Suspense
const Loading = () => <p className="text-center mt-20">Loading Report...</p>;

export default async function ViewReportPage() {
  // Fetch the data on the server
  const categoryData = await getCategoryData();

  return (
    // The Suspense boundary is still needed for useSearchParams on the client
    <Suspense fallback={<Loading />}>
      <ViewReportPageClient
        initialCustomCategories={categoryData.customCategories}
        initialCreditCardCategories={categoryData.creditCardCategories}
      />
    </Suspense>
  );
}