// User roles in the system
export enum UserRole {
    MANAGER = 'MANAGER',
    STORE_KEEPER = 'STORE_KEEPER',
}

// User interface
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

// Auth context type
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Product interface
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Dashboard statistics
export interface DashboardStats {
    totalProducts: number;
    lowStockItems: number;
    categories: number;
    totalValue: number;
}

// Theme context type
export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// Product input for create/update
export interface ProductInput {
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
}
