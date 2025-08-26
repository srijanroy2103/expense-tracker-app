"use client";

import { useMemo } from 'react';
import { Trash2 } from 'lucide-react'; // Import the icon

const ReportTable = ({ transactions, onDelete }) => { // Accept onDelete prop
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Subcategory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Comment</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.length > 0 ? (
              transactions.map(t => (
                <tr key={t._id} className="hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(t.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{t.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{t.subcategory || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{t.comment || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">₹{t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onDelete(t._id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">No transactions found for the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-900/50 text-right">
        <span className="text-sm text-gray-300 font-medium mr-2">Total:</span>
        <span className="text-xl font-bold text-white transition-all duration-300 ease-in-out animate-pulse-zoom">
          ₹{totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ReportTable;