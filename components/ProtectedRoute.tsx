'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes from unauthorized access
 * - Redirects unauthenticated users to /login
 * - Redirects unauthorized users based on their role
 * - Prevents direct URL access
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check role-based access if allowedRoles is specified
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === UserRole.MANAGER) {
          router.push('/dashboard');
        } else if (user.role === UserRole.STORE_KEEPER) {
          router.push('/products');
        } else {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, user, loading, allowedRoles, router]);

  // Show loading state while checking authentication
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

  // Don't render children if not authenticated or not authorized
  if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
