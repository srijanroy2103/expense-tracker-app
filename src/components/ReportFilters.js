"use client";

import { useState } from 'react';

const ReportFilters = ({ categories, onFilterChange }) => {
  const [useCategoryFilter, setUseCategoryFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApplyFilters = () => {
    const filters = { fromDate, toDate };
    if (useCategoryFilter) {
      filters.category = selectedCategory;
      filters.subcategory = selectedSubcategory;
    }
    onFilterChange(filters);
  };

  const currentCategory = categories.find(c => c.name === selectedCategory);

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="category-toggle" className="text-sm text-gray-300">Filter by Category</label>
          <input
            type="checkbox"
            id="category-toggle"
            checked={useCategoryFilter}
            onChange={(e) => setUseCategoryFilter(e.target.checked)}
            className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="from-date" className="block text-sm font-medium text-gray-300">From</label>
          <input type="date" id="from-date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm" />
        </div>
        <div>
          <label htmlFor="to-date" className="block text-sm font-medium text-gray-300">To</label>
          <input type="date" id="to-date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm" />
        </div>
      </div>

      {/* Category Filters (conditionally rendered) */}
      {useCategoryFilter && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700 animate-fade-in">
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-300">Category</label>
            <select id="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm">
              <option value="">All Categories</option>
              {
                categories.map(cat =>
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>)
              }
            </select>
          </div>
          {currentCategory && currentCategory.subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory-select" className="block text-sm font-medium text-gray-300">Subcategory</label>
              <select id="subcategory-select" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-sm">
                <option value="">All Subcategories</option>
                {currentCategory.subcategories.map(sub => <option key={sub._id} value={sub.name}>{sub.name}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="text-right">
        <button onClick={handleApplyFilters} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;
