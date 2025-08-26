"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TransactionForm = ({ type, categories }) => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory(''); // Reset subcategory when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category: selectedCategory,
          subcategory: selectedSubcategory,
          date,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to add ${type}.`);
      
      setSuccess(data.message);
      // Reset form
      setAmount('');
      setSelectedCategory('');
      setSelectedSubcategory('');
      setComment('');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories.find(c => c.name === selectedCategory);

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-slate-800/50 rounded-xl shadow-lg border border-gray-700 space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" placeholder="0.00" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
          <option value="">-- Select a Category --</option>
          {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="animate-fade-in">
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300">Subcategory</label>
          <select id="subcategory" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
            <option value="">-- Select a Subcategory --</option>
            {currentCategory.subcategories.map(sub => <option key={sub._id} value={sub.name}>{sub.name}</option>)}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Comment</label>
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength="300" rows="3" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div className="text-center pt-2">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50">
          {isSubmitting ? 'Saving...' : `Save ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;