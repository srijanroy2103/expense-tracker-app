import { useMemo } from 'react';
import { Trash2 } from 'lucide-react';

const ReportTable = ({ transactions, onDelete }) => {
  const total = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  }, [transactions]);

  if (transactions.length === 0) {
    return <p className="text-center text-gray-400 mt-8">No transactions found for the selected criteria.</p>;
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  return (
    <div className="overflow-x-auto">
      {/* --- Mobile View (Card List) --- */}
      <div className="md:hidden">
        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t._id} className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-white">₹{t.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-300">{t.category}{t.subcategory ? ` / ${t.subcategory}` : ''}</p>
                </div>
                <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
              </div>
              {t.comment && <p className="text-sm text-gray-400 mt-2 pt-2 border-t border-slate-700">{t.comment}</p>}
              <div className="text-right mt-2">
                <button
                  onClick={() => onDelete(t._id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- Desktop View (Table) --- */}
      <div className="hidden md:block">
        <table className="min-w-full bg-slate-800/50 rounded-lg">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subcategory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.map(t => (
              <tr key={t._id} className="hover:bg-slate-800 transition-colors animate-fade-in">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(t.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{t.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{t.subcategory || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{t.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => onDelete(t._id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- Total Amount (Visible on all screen sizes) --- */}
      <div className="mt-6 text-right">
        <p className="text-xl font-bold text-white bg-slate-900/50 inline-block p-3 rounded-lg animate-pulse-zoom">
          Total: ₹{total}
        </p>
      </div>
    </div>
  );
};

export default ReportTable;