'use client';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { GET_DASHBOARD_STATS } from '@/graphql/queries';
import { DashboardStats, UserRole } from '@/types';
import { useQuery } from '@apollo/client';

export default function DashboardPage() {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS);
  const stats: DashboardStats | undefined = data?.dashboardStats;

  return (
    <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <Navbar />
        <Sidebar />
        
        <main className="pt-16 lg:pl-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                Overview of your commodities management system
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-zinc-400">Loading dashboard...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Error loading dashboard data. Please try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-in">
                {/* Total Products */}
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Products</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                      </div>
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                        <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Stock Items */}
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Low Stock Items</p>
                        <div className="mt-2 flex items-baseline">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.lowStockItems}</p>
                          {stats.lowStockItems > 0 && (
                            <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                              Action needed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Categories</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.categories}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Value */}
                <div className="bg-white dark:bg-zinc-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Value</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${stats.totalValue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 transition-colors">
                        <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {stats && (
              <div className="mt-8 bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Insights
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-zinc-300">
                      You have <strong className="text-gray-900 dark:text-white">{stats.totalProducts}</strong> products across <strong className="text-gray-900 dark:text-white">{stats.categories}</strong> categories
                    </p>
                  </div>
                  {stats.lowStockItems > 0 && (
                    <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-600 dark:text-zinc-300">
                        <strong className="text-red-600 dark:text-red-400">{stats.lowStockItems}</strong> products are running low on stock and need restocking
                      </p>
                    </div>
                  )}
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-zinc-300">
                      Total inventory value is <strong className="text-green-600 dark:text-green-400">${stats.totalValue.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
