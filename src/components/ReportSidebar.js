"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

const ReportSidebar = () => {
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type');

  const links = [
    { name: 'Expenses', type: 'expense', icon: TrendingDown },
    { name: 'Income', type: 'income', icon: TrendingUp },
    { name: 'Credit Card', type: 'credit-card', icon: CreditCard}, // Disabled for now
  ];

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-white">Report Type</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.type}
            href={link.disabled ? '#' : `/view-report?type=${link.type}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              currentType === link.type
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            } ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <link.icon size={18} />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ReportSidebar;
