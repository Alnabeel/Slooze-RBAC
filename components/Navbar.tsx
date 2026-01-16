'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { UserRole } from '@/types';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 h-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center lg:w-64 lg:justify-center">
              <Link href={user?.role === UserRole.MANAGER ? '/dashboard' : '/products'}>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  Slooze
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - Theme toggle, User info, Logout */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-zinc-700">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-zinc-200">{user.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.role === UserRole.MANAGER 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {user.role === UserRole.MANAGER ? 'Manager' : 'Store Keeper'}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-white dark:ring-zinc-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
