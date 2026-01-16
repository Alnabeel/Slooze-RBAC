'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === UserRole.MANAGER) {
        router.push('/dashboard');
      } else {
        router.push('/products');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Redirect will happen via useEffect
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-zinc-400">
            Commodities Management System
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl shadow-gray-200/50 dark:shadow-none sm:rounded-xl sm:px-10 border border-gray-100 dark:border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/30 animate-slide-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-500">
                  Test Credentials
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 border border-gray-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Manager Account:</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Email: manager@slooze.com<br />
                  Password: manager123
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3 border border-gray-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Store Keeper Account:</p>
                <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                  Email: keeper@slooze.com<br />
                  Password: keeper123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
