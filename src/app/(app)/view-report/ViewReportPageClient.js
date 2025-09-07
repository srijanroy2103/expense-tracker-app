"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import ReportFilters from '@/components/ReportFilters';
import ReportTable from '@/components/ReportTable';
import ReportSidebar from '@/components/ReportSidebar'; // Import the sidebar here
import CreditCardFilters from '@/components/CreditCardFilters';


const ViewReportPageClient = ({ initialCustomCategories, initialCreditCardCategories }) => {
  const searchParams = useSearchParams();
  const reportType = searchParams.get('type');

  const [customCategories] = useState(initialCustomCategories);
  const [creditCardCategories] = useState(initialCreditCardCategories);
  
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete.');
      setTransactions(current => current.filter(t => t._id !== transactionId));
      setSuccess(data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderFilters = () => {
    if (reportType === 'expense' || reportType === 'income') {
      return <ReportFilters categories={customCategories} onFilterChange={fetchTransactions} />;
    }
    if (reportType === 'credit-card') {
      return <CreditCardFilters creditCards={creditCardCategories} onFilterChange={fetchTransactions} />;
    }
    return null;
  };

  return (
    <>
      <aside className="md:w-64 flex-shrink-0">
        <ReportSidebar />
      </aside>
      <div className="flex-1">
        {!reportType ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">Select a Report Type</h2>
            <p className="text-gray-400">Please choose a report from the sidebar.</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default ViewReportPageClient;