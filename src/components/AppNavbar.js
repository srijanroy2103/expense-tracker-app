"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LayoutDashboard, Wallet, BarChart, PlusCircle, Settings, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AppNavbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const navLinks = [
    { name: 'Add Expense', href: '/add-expense', icon: PlusCircle },
    { name: 'Add Income', href: '/add-income', icon: Wallet },
    { name: 'View Report', href: '/view-report', icon: BarChart },
  ];

  return (
    <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo/Dashboard Link */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white font-bold text-xl flex items-center gap-2">
              <LayoutDashboard />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
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

          {/* Right Side: User Menu and Mobile Menu Button */}
          <div className="flex items-center">
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
                >
                  <Link href="/category-editing" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 w-full text-left">
                    <Settings size={16} />
                    Category Editing
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 w-full text-left">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="ml-4 md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;