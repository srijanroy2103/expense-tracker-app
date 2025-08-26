"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, Lock, HelpCircle } from 'lucide-react';

const CategoryEditingPage = () => {
  const router = useRouter();

  // State for fetched data
  const [creditCards, setCreditCards] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI Control State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreditCardSetupDone, setIsCreditCardSetupDone] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch existing categories.');
        
        const data = await res.json();
        
        setCreditCards(data.creditCards || []);
        setCategories(data.customCategories || []);

        if (data.creditCards && data.creditCards.length > 0) {
          setIsCreditCardSetupDone(true);
        } else {
          setIsCreditCardSetupDone(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // --- Credit Card Handlers (Updated) ---
  const handleCreditCardCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    const newCount = Math.max(0, Math.min(count, 20));

    const newCreditCards = Array.from({ length: newCount }, (_, index) => {
      return creditCards[index] || { bankName: '', limit: '', subcategories: [] };
    });
    setCreditCards(newCreditCards);
  };

  const handleCreditCardChange = (index, field, value) => {
    const updatedCreditCards = [...creditCards];
    updatedCreditCards[index][field] = value;
    setCreditCards(updatedCreditCards);
  };

  const addCreditCardSubcategory = (cardIndex) => {
    const updatedCreditCards = [...creditCards];
    if (!updatedCreditCards[cardIndex].subcategories) {
      updatedCreditCards[cardIndex].subcategories = [];
    }
    updatedCreditCards[cardIndex].subcategories.push({ name: '', isDeletable: true });
    setCreditCards(updatedCreditCards);
  };

  const handleCreditCardSubcategoryChange = (cardIndex, subIndex, value) => {
    const updatedCreditCards = [...creditCards];
    updatedCreditCards[cardIndex].subcategories[subIndex].name = value;
    setCreditCards(updatedCreditCards);
  };

  const removeCreditCardSubcategory = (cardIndex, subIndex) => {
    const updatedCreditCards = [...creditCards];
    updatedCreditCards[cardIndex].subcategories = updatedCreditCards[cardIndex].subcategories.filter((_, i) => i !== subIndex);
    setCreditCards(updatedCreditCards);
  };

  // --- Custom Category Handlers ---
  const addCategory = () => {
    setCategories([...categories, { name: '', subcategories: [], isDeletable: true }]);
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index].name = value;
    setCategories(updatedCategories);
  };
  
  const removeCategory = (index) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  const addSubcategory = (catIndex) => {
    const updatedCategories = [...categories];
    if (!updatedCategories[catIndex].subcategories) {
      updatedCategories[catIndex].subcategories = [];
    }
    updatedCategories[catIndex].subcategories.push({ name: '', isDeletable: true });
    setCategories(updatedCategories);
  };

  const handleSubcategoryChange = (catIndex, subIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[catIndex].subcategories[subIndex].name = value;
    setCategories(updatedCategories);
  };
  
  const removeSubcategory = (catIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[catIndex].subcategories = updatedCategories[catIndex].subcategories.filter((_, i) => i !== subIndex);
    setCategories(updatedCategories);
  };

  // --- Main Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditCards, categories }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save categories.');

      setSuccess('Categories saved successfully! Redirecting...');
      setTimeout(() => router.push('/add-expense'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-20">Loading your categories...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Manage Your Financial Categories</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Credit Card Section */}
          <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Credit Cards</h2>
              {isCreditCardSetupDone && <Lock className="text-yellow-400" />}
            </div>
            
            {isCreditCardSetupDone ? (
              <>
                <p className="text-sm text-gray-400 mb-4">Credit card setup is locked. You can still edit subcategories below.</p>
                {/* Display locked cards and their subcategories */}
              </>
            ) : (
              <div className="mb-4">
                <label htmlFor="creditCardCount" className="block mb-2 text-gray-300">How many credit cards do you use?</label>
                <input
                  type="number"
                  id="creditCardCount"
                  value={creditCards.length}
                  onChange={handleCreditCardCountChange}
                  className="w-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                  min="0"
                />
              </div>
            )}
            
            <div className="space-y-6">
              {creditCards.map((card, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <span className="text-gray-400 font-semibold">{index + 1}.</span>
                    <input
                      type="text" placeholder="Bank Name (e.g., HDFC)" value={card.bankName}
                      onChange={(e) => handleCreditCardChange(index, 'bankName', e.target.value)}
                      required disabled={isCreditCardSetupDone}
                      className="flex-1 w-full bg-gray-700 rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    <input
                      type="number" placeholder="Card Limit" value={card.limit}
                      onChange={(e) => handleCreditCardChange(index, 'limit', e.target.value)}
                      required disabled={isCreditCardSetupDone}
                      className="w-full sm:w-40 bg-gray-700 rounded-md px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  {/* Subcategories for Credit Cards */}
                  <div className="pl-8 mt-4">
                    <div className="space-y-2">
                       {card.subcategories && card.subcategories.map((sub, subIndex) => (
                        <div key={sub._id || subIndex} className="flex items-center gap-2 animate-fade-in">
                          <input
                            type="text" placeholder="Subcategory (e.g., Online Shopping)" value={sub.name}
                            onChange={(e) => handleCreditCardSubcategoryChange(index, subIndex, e.target.value)}
                            maxLength="20" required
                            className="flex-1 bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
                          />
                          <button type="button" onClick={() => removeCreditCardSubcategory(index, subIndex)} disabled={!sub.isDeletable} className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => addCreditCardSubcategory(index)} className="mt-2 text-sm text-blue-400 hover:text-blue-300">
                      Add Subcategory +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Categories Section */}
          <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Custom Expense & Income Categories</h2>
            <div className="space-y-4">
              {categories.map((cat, catIndex) => (
                <div key={cat._id || catIndex} className="p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={cat.name}
                      onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                      maxLength="20"
                      required
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" onClick={() => addSubcategory(catIndex)} className="text-blue-400 hover:text-blue-300">Add Subcategory +</button>
                    <button
                      type="button"
                      onClick={() => removeCategory(catIndex)}
                      disabled={!cat.isDeletable}
                      className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed group relative"
                    >
                      <Trash2 size={20} />
                      {!cat.isDeletable && (
                        <span className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          Cannot delete: category has transactions.
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="pl-8 mt-3 space-y-2">
                    {cat.subcategories.map((sub, subIndex) => (
                      <div key={sub._id || subIndex} className="flex items-center gap-2 animate-fade-in">
                        <input
                          type="text"
                          placeholder="Subcategory"
                          value={sub.name}
                          onChange={(e) => handleSubcategoryChange(catIndex, subIndex, e.target.value)}
                          maxLength="20"
                          required
                          className="flex-1 bg-gray-600 border border-gray-500 rounded-md px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubcategory(catIndex, subIndex)}
                          disabled={!sub.isDeletable}
                          className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed group relative"
                        >
                          <Trash2 size={18} />
                           {!sub.isDeletable && (
                            <span className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              Cannot delete: subcategory has transactions.
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCategory} className="mt-4 flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold">
              <PlusCircle size={22} />
              Add Category
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center pt-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="px-10 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditingPage;
