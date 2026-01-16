'use client';

import { useAuth } from '@/context/AuthContext';
import { CREATE_PRODUCT, GET_PRODUCTS, UPDATE_PRODUCT } from '@/graphql/queries';
import { Product, ProductInput, UserRole } from '@/types';
import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const { user } = useAuth();
  const isStoreKeeper = user?.role === UserRole.STORE_KEEPER;
  
  const [formData, setFormData] = useState<ProductInput>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductInput, string>>>({});

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const loading = creating || updating;

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (product) {
        // Update existing product
        await updateProduct({
          variables: {
            id: product.id,
            input: formData,
          },
        });
      } else {
        // Create new product
        await createProduct({
          variables: {
            input: formData,
          },
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleChange = (field: keyof ProductInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500/75 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel centering trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-zinc-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-zinc-800 animate-scale-in">
          <div className="bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white" id="modal-title">
                  {product ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    {product ? 'Update the details of your existing product.' : 'Fill in the information below to create a new product.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={isStoreKeeper && !!product}
                      className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                        errors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500'
                      } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                        isStoreKeeper && !!product ? 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 cursor-not-allowed' : ''
                      }`}
                      placeholder="e.g. Wireless Headphones"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      disabled={isStoreKeeper && !!product}
                      className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                        errors.category
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500'
                      } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                        isStoreKeeper && !!product ? 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 cursor-not-allowed' : ''
                      }`}
                      placeholder="e.g. Electronics"
                    />
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                          disabled={isStoreKeeper && !!product}
                          className={`block w-full pl-7 px-3 py-2 border rounded-xl focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                            errors.price
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500'
                          } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                            isStoreKeeper && !!product ? 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 cursor-not-allowed' : ''
                          }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>

                    {/* Stock */}
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="stock"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                        className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                          errors.stock
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500'
                        } bg-white dark:bg-zinc-800 text-gray-900 dark:text-white`}
                        placeholder="0"
                      />
                      {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                    </div>
                  </div>
                  {isStoreKeeper && product && (
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                      Note: As a Store Keeper, you can only update stock levels.
                    </p>
                  )}

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      disabled={isStoreKeeper && !!product}
                      className={`mt-1 block w-full px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors border-gray-300 dark:border-zinc-700 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white ${
                        isStoreKeeper && !!product ? 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500 cursor-not-allowed' : ''
                      }`}
                      placeholder="Product description..."
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-zinc-700 shadow-sm px-4 py-2 bg-white dark:bg-zinc-800 text-base font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
