"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import ReportFilters from '@/components/ReportFilters';
import ReportTable from '@/components/ReportTable';

// A new, simplified filter component specifically for credit cards
const CreditCardFilters = ({ creditCards, onFilterChange }) => {
  const [selectedCard, setSelectedCard] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApply = () => {
    onFilterChange({ selectedCard, fromDate, toDate });
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-6 space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm">Credit Card</label>
          <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} className="mt-1 block w-full bg-gray-700 rounded-md p-2 text-sm">
            <option value="">All Credit Cards</option>
            {creditCards.map(card => <option key={card._id} value={card.bankName}>{card.bankName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="mt-1 block w-full bg-gray-700 rounded-md p-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1 block w-full bg-gray-700 rounded-md p-2 text-sm" />
        </div>
      </div>
      <div className="text-right">
        <button onClick={handleApply} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Apply</button>
      </div>
    </div>
  );
};


const ViewReportPageClient = () => {
  const searchParams = useSearchParams();
  const reportType = searchParams.get('type');

  const [customCategories, setCustomCategories] = useState([]);
  const [creditCardCategories, setCreditCardCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all category types once on page load
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories.');
        const data = await res.json();
        setCustomCategories(data.customCategories);
        setCreditCardCategories(data.creditCards);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch transactions whenever the report type or filters change
  const fetchTransactions = useCallback(async (filters = {}) => {
    if (!reportType) return;
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ type: reportType, ...filters });
      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch transactions.');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [reportType]);

  // Initial fetch when reportType changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete transaction.');
      setTransactions(current => current.filter(t => t._id !== transactionId));
      setSuccess(data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Function to decide which filter component to show
  const renderFilters = () => {
    if (isLoading) return null;
    if (reportType === 'expense') {
      return <ReportFilters categories={customCategories} onFilterChange={fetchTransactions} />;
    }
    if (reportType === 'income') {
      return <ReportFilters categories={customCategories} onFilterChange={fetchTransactions} />;
    }
    if (reportType === 'credit-card') {
      return <CreditCardFilters creditCards={creditCardCategories} onFilterChange={fetchTransactions} />;
    }
    return null;
  };

  if (!reportType) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold">Select a Report Type</h2>
        <p className="text-gray-400">Please choose a report from the sidebar to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 capitalize">{reportType.replace('-', ' ')} Report</h1>
      {success && <p className="text-center mb-4 text-green-500">{success}</p>}
      {error && <p className="text-center mb-4 text-red-500">{error}</p>}
      
      {renderFilters()}
      
      {isLoading ? (
        <p className="text-center mt-10">Loading transactions...</p>
      ) : (
        <ReportTable transactions={transactions} onDelete={handleDeleteTransaction} />
      )}
    </div>
  );
};

export default ViewReportPageClient;