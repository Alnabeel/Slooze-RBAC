'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      role: UserRole.MANAGER,
      icon: (
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Products',
      href: '/products',
      role: null, // All roles
      icon: (
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 pt-16 z-40 transition-transform duration-300 ease-in-out">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-4 space-y-2">
          {links.map((link) => {
            if (link.role && user?.role !== link.role) return null;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`${isActive(link.href) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-500 dark:group-hover:text-zinc-300'}`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
