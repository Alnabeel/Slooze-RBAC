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

  const [errors, setErrors] = useState<Partial<ProductInput>>({});

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
    const newErrors: Partial<ProductInput> = {};

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
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {product ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <div className="mt-6 space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={isStoreKeeper && !!product}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white ${
                          errors.name
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        } ${isStoreKeeper && !!product ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category *
                      </label>
                      <input
                        type="text"
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        disabled={isStoreKeeper && !!product}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white ${
                          errors.category
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        } ${isStoreKeeper && !!product ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                      />
                      {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                        disabled={isStoreKeeper && !!product}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white ${
                          errors.price
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        } ${isStoreKeeper && !!product ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>

                    {/* Stock - Store Keeper can always edit this */}
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock Quantity *
                        {isStoreKeeper && product && (
                          <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You can edit this)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        id="stock"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white ${
                          errors.stock
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'
                        }`}
                      />
                      {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        disabled={isStoreKeeper && !!product}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 ${
                          isStoreKeeper && !!product ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : product ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
