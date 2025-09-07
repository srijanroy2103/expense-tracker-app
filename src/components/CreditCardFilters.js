"use client";

import { useState, useEffect } from 'react';

const CreditCardFilters = ({ creditCards, onFilterChange }) => {
  // State for all the filter inputs
  const [selectedCard, setSelectedCard] = useState('');
  const [filterBySubcategory, setFilterBySubcategory] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Find the currently selected card object to get its subcategories
  const currentCard = creditCards.find(card => card.bankName === selectedCard);

  // Effect to reset subcategory filters when the main card changes
  useEffect(() => {
    setFilterBySubcategory(false);
    setSelectedSubcategory('');
  }, [selectedCard]);

  // Effect to reset subcategory selection if the checkbox is unchecked
  useEffect(() => {
    if (!filterBySubcategory) {
      setSelectedSubcategory('');
    }
  }, [filterBySubcategory]);

  const handleApply = () => {
    const filters = {
      selectedCard,
      fromDate,
      toDate,
    };

    // Only add the subcategory to the filter if the checkbox is checked
    if (filterBySubcategory) {
      filters.subcategory = selectedSubcategory;
    }
    
    onFilterChange(filters);
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* Credit Card (Category) Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300">Credit Card</label>
          <select 
            value={selectedCard} 
            onChange={(e) => setSelectedCard(e.target.value)} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
          >
            <option value="">All Credit Cards</option>
            {creditCards.map(card => <option key={card._id} value={card.bankName}>{card.bankName}</option>)}
          </select>
        </div>

        {/* Date Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-300">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm" />
        </div>
      </div>
      
      {/* Subcategory section with checkbox */}
      {currentCard && currentCard.subcategories.length > 0 && (
        <div className="space-y-2 pt-2 animate-fade-in">
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="filterBySubcategory"
              checked={filterBySubcategory}
              onChange={(e) => setFilterBySubcategory(e.target.checked)}
              className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-600"
            />
            <label htmlFor="filterBySubcategory" className="ml-2 text-sm font-medium text-gray-300">Filter by subcategory</label>
          </div>
          
          {/* Conditionally render the subcategory dropdown */}
          {filterBySubcategory && (
             <div className="pl-6 animate-fade-in">
              <label className="block text-sm font-medium text-gray-300">Subcategory</label>
              <select 
                value={selectedSubcategory} 
                onChange={(e) => setSelectedSubcategory(e.target.value)} 
                className="mt-1 block w-full md:w-1/2 bg-gray-700 border-gray-600 rounded-md p-2 text-sm"
              >
                <option value="">All Subcategories</option>
                {currentCard.subcategories.map(sub => <option key={sub._id} value={sub.name}>{sub.name}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="text-right pt-2">
        <button onClick={handleApply} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Apply Filters</button>
      </div>
    </div>
  );
};

export default CreditCardFilters;