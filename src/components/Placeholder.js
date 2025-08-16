"use client";
import { useRouter } from "next/navigation";

export default function Placeholder({ pageName }) {
  const router = useRouter();
  return (
    <div className="text-center mt-20 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">{pageName}</h1>
      <div className="max-w-md mx-auto p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <p className="text-gray-300 mb-4">This feature is coming soon! First, you must set up your categories.</p>
        <button
          onClick={() => router.push('/category-editing')}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Go to Category Setup
        </button>
      </div>
    </div>
  );
}