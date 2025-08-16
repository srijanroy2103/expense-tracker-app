"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, Wallet, BarChart, PlusCircle, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

const AppNavbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Add Expense', href: '/add-expense', icon: PlusCircle },
    { name: 'Add Income', href: '/add-income', icon: Wallet },
    { name: 'View Report', href: '/view-report', icon: BarChart },
  ];

  return (
    <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white font-bold text-xl flex items-center gap-2">
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-slate-900 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <link.icon size={16} />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-sm rounded-full text-white hover:opacity-80 transition-opacity"
            >
              <span className="sr-only">Open user menu</span>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <UserIcon size={16}/>}
              </div>
            </button>
            {dropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
                role="menu"
              >
                <Link href="/category-editing" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 w-full text-left" role="menuitem">
                  <Settings size={16} />
                  Category Editing
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 w-full text-left"
                  role="menuitem"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;