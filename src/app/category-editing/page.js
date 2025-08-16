"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';

const CategoryEditingPage = () => {
  const router = useRouter();

  // State for the number of credit cards and their details
  const [creditCardCount, setCreditCardCount] = useState(0);
  const [creditCards, setCreditCards] = useState([]);
  
  // State for custom categories and their subcategories
  const [categories, setCategories] = useState([]);

  // State to lock the credit card section after submitting
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Credit Card Handlers ---
  const handleCreditCardCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    // We limit it to a reasonable number to avoid crashing the browser
    const newCount = Math.max(0, Math.min(count, 20));
    setCreditCardCount(newCount);

    // Adjust the creditCards array to match the new count
    const newCreditCards = Array.from({ length: newCount }, (_, index) => {
      return creditCards[index] || { bankName: '', limit: '' };
    });
    setCreditCards(newCreditCards);
  };

  const handleCreditCardChange = (index, field, value) => {
    const updatedCreditCards = [...creditCards];
    updatedCreditCards[index][field] = value;
    setCreditCards(updatedCreditCards);
  };

  // --- Category Handlers ---
  const addCategory = () => {
    setCategories([...categories, { id: Date.now(), name: '', subcategories: [] }]);
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
    updatedCategories[catIndex].subcategories.push({ id: Date.now(), name: '' });
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
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save this data to your database here.
    // For now, we'll just log it to see the structure.
    console.log("Submitting Data:", { creditCards, categories });
    setIsSubmitted(true);
    // You would likely redirect the user after this, e.g., router.push('/dashboard');
    alert("Categories have been set up!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Setup Your Financial Categories</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Credit Card Section */}
          <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Credit Cards</h2>
            <div className="mb-4">
              <label htmlFor="creditCardCount" className="block mb-2 text-gray-300">How many credit cards do you use?</label>
              <input
                type="number"
                id="creditCardCount"
                value={creditCardCount}
                onChange={handleCreditCardCountChange}
                disabled={isSubmitted}
                className="w-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                min="0"
              />
            </div>

            <div className="space-y-4">
              {creditCards.map((card, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                  <span className="text-gray-400 font-semibold">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={card.bankName}
                    onChange={(e) => handleCreditCardChange(index, 'bankName', e.target.value)}
                    required
                    disabled={isSubmitted}
                    className="flex-1 w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                  />
                  <input
                    type="number"
                    placeholder="Card Limit"
                    value={card.limit}
                    onChange={(e) => handleCreditCardChange(index, 'limit', e.target.value)}
                    required
                    disabled={isSubmitted}
                    className="w-full sm:w-40 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Categories Section */}
          <div className="p-6 bg-slate-800/50 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Custom Expense & Income Categories</h2>
            <div className="space-y-4">
              {categories.map((cat, catIndex) => (
                <div key={cat.id} className="p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Category Name (e.g., Groceries)"
                      value={cat.name}
                      onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                      maxLength="20"
                      required
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button type="button" onClick={() => addSubcategory(catIndex)} className="text-blue-400 hover:text-blue-300 transition-colors">Add Subcategory +</button>
                    <button type="button" onClick={() => removeCategory(catIndex)} className="text-red-500 hover:text-red-400 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="pl-8 mt-3 space-y-2">
                    {cat.subcategories.map((sub, subIndex) => (
                      <div key={sub.id} className="flex items-center gap-2 animate-fade-in">
                        <input
                          type="text"
                          placeholder="Subcategory (e.g., Supermarket)"
                          value={sub.name}
                          onChange={(e) => handleSubcategoryChange(catIndex, subIndex, e.target.value)}
                          maxLength="20"
                          required
                          className="flex-1 bg-gray-600 border border-gray-500 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button type="button" onClick={() => removeSubcategory(catIndex, subIndex)} className="text-red-500 hover:text-red-400 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCategory} className="mt-4 flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-semibold">
              <PlusCircle size={22} />
              Add Category
            </button>
          </div>
          
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-10 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-60 disabled:scale-100"
              disabled={isSubmitted}
            >
              Submit All Categories
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEditingPage;