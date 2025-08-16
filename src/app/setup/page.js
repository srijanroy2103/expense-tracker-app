"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react'; // A nice icon library

const SetupPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 -mt-16">
      <div className="w-full max-w-lg text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Welcome to ExpenseTracker
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {`Let's get your finances organized. The first step is to set up the categories for your expenses and income.`}
        </p>
        <button
          onClick={() => router.push('/category-editing')}
          className="group inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          Setup Categories
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default SetupPage;