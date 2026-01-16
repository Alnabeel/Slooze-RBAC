'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        if (user.role === UserRole.MANAGER) {
          router.push('/dashboard');
        } else {
          router.push('/products');
        }
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, we are redirecting, so return null or loader
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Slooze RBAC</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Commodities Management System</p>
      </div>

      <div className="mb-8">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login to Dashboard
        </Link>
      </div>
    </div>
  );
}
