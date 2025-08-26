"use client";
import { useState, useEffect } from 'react';
import TransactionForm from '@/components/TransactionForm';

export default function AddIncomePage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories.');
        const data = await res.json();
        // For income, you might only want custom categories, not credit cards
        setCategories(data.customCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) return <p className="text-center mt-10">Loading categories...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6">Add a New Income</h1>
      <TransactionForm type="income" categories={categories} />
    </div>
  );
}