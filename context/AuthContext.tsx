'use client';

import { AuthContextType, User, UserRole } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Mock login function
   * - Emails containing "manager" will be assigned MANAGER role
   * - All other emails will be assigned STORE_KEEPER role
   * - Simulates JWT token storage
   */
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Determine role based on email
    const role = email.toLowerCase().includes('manager') 
      ? UserRole.MANAGER 
      : UserRole.STORE_KEEPER;

    // Create user object
    const newUser: User = {
      id: String(Date.now()),
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role,
    };

    // Mock JWT token
    const mockToken = `mock-jwt-token-${Date.now()}`;

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', mockToken);

    // Update state
    setUser(newUser);
  };

  /**
   * Logout function
   * Clears user data and token from localStorage
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
