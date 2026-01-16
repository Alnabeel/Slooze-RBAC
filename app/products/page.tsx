'use client';

import Navbar from '@/components/Navbar';
import ProductModal from '@/components/ProductModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { DELETE_PRODUCT, GET_PRODUCTS } from '@/graphql/queries';
import { Product, UserRole } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

export default function ProductsPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const products: Product[] = data?.products || [];

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({ variables: { id } });
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleModalSuccess = () => {
    refetch();
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.MANAGER, UserRole.STORE_KEEPER]}>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <Navbar />
        <Sidebar />
        
        <main className="pt-16 lg:pl-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Products</h1>
                  <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                    Manage your commodity inventory
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 p-4 animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg leading-5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                      placeholder="Search by name or category..."
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    Filter by Category
                  </label>
                  <select
                    id="category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg leading-5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-zinc-400">Loading products...</p>
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
                      Error loading products. Please try again.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            {!loading && !error && (
              <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">No products found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-white font-semibold text-sm">
                                    {product.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                  </div>
                                  {product.description && (
                                    <div className="text-sm text-gray-500 dark:text-zinc-400 truncate max-w-xs">
                                      {product.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/30">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full border ${
                                product.stock < 10
                                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/30'
                                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/30'
                              }`}>
                                {product.stock} units
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-4 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Product Count */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            )}
          </div>
        </main>

        {/* Product Modal */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onSuccess={handleModalSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}
