import { DashboardStats, Product } from '@/types';

// Mock products data
export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Premium Coffee Beans',
        category: 'Beverages',
        price: 24.99,
        stock: 150,
        description: 'High-quality Arabica coffee beans from Colombia',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Organic Green Tea',
        category: 'Beverages',
        price: 12.99,
        stock: 8,
        description: 'Premium organic green tea leaves',
        createdAt: '2024-01-14T10:00:00Z',
        updatedAt: '2024-01-14T10:00:00Z',
    },
    {
        id: '3',
        name: 'Whole Wheat Flour',
        category: 'Grains',
        price: 8.99,
        stock: 200,
        description: 'Stone-ground whole wheat flour',
        createdAt: '2024-01-13T10:00:00Z',
        updatedAt: '2024-01-13T10:00:00Z',
    },
    {
        id: '4',
        name: 'Basmati Rice',
        category: 'Grains',
        price: 15.99,
        stock: 5,
        description: 'Premium aged basmati rice',
        createdAt: '2024-01-12T10:00:00Z',
        updatedAt: '2024-01-12T10:00:00Z',
    },
    {
        id: '5',
        name: 'Extra Virgin Olive Oil',
        category: 'Oils',
        price: 28.99,
        stock: 75,
        description: 'Cold-pressed extra virgin olive oil',
        createdAt: '2024-01-11T10:00:00Z',
        updatedAt: '2024-01-11T10:00:00Z',
    },
    {
        id: '6',
        name: 'Coconut Oil',
        category: 'Oils',
        price: 18.99,
        stock: 3,
        description: 'Organic virgin coconut oil',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
    },
    {
        id: '7',
        name: 'Raw Honey',
        category: 'Sweeteners',
        price: 22.99,
        stock: 120,
        description: 'Pure raw unfiltered honey',
        createdAt: '2024-01-09T10:00:00Z',
        updatedAt: '2024-01-09T10:00:00Z',
    },
    {
        id: '8',
        name: 'Maple Syrup',
        category: 'Sweeteners',
        price: 32.99,
        stock: 45,
        description: 'Grade A pure maple syrup',
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-08T10:00:00Z',
    },
    {
        id: '9',
        name: 'Almonds',
        category: 'Nuts',
        price: 19.99,
        stock: 6,
        description: 'Premium California almonds',
        createdAt: '2024-01-07T10:00:00Z',
        updatedAt: '2024-01-07T10:00:00Z',
    },
    {
        id: '10',
        name: 'Cashews',
        category: 'Nuts',
        price: 24.99,
        stock: 90,
        description: 'Roasted and salted cashews',
        createdAt: '2024-01-06T10:00:00Z',
        updatedAt: '2024-01-06T10:00:00Z',
    },
];

// Calculate dashboard statistics from products
export const calculateDashboardStats = (products: Product[]): DashboardStats => {
    const lowStockThreshold = 10;
    const categories = new Set(products.map(p => p.category)).size;
    const lowStockItems = products.filter(p => p.stock < lowStockThreshold).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
        totalProducts: products.length,
        lowStockItems,
        categories,
        totalValue: Math.round(totalValue * 100) / 100,
    };
};
