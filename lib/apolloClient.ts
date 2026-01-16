import { calculateDashboardStats, mockProducts } from '@/graphql/mockData';
import { Product } from '@/types';
import { ApolloClient, ApolloLink, InMemoryCache, Observable } from '@apollo/client';

// In-memory storage for products (simulating a database)
let productsStore: Product[] = [...mockProducts];

// Mock link to simulate GraphQL API responses
const mockLink = new ApolloLink((operation) => {
    return new Observable((observer) => {
        const { operationName, variables } = operation;

        // Simulate network delay
        setTimeout(() => {
            try {
                let result;

                switch (operationName) {
                    case 'GetProducts':
                        // Return all products
                        result = {
                            data: {
                                products: productsStore,
                            },
                        };
                        break;

                    case 'GetProduct':
                        // Return single product by ID
                        const product = productsStore.find(p => p.id === variables.id);
                        result = {
                            data: {
                                product: product || null,
                            },
                        };
                        break;

                    case 'CreateProduct':
                        // Create new product
                        const newProduct: Product = {
                            id: String(Date.now()),
                            ...variables.input,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };
                        productsStore.push(newProduct);
                        result = {
                            data: {
                                createProduct: newProduct,
                            },
                        };
                        break;

                    case 'UpdateProduct':
                        // Update existing product
                        const index = productsStore.findIndex(p => p.id === variables.id);
                        if (index !== -1) {
                            const updatedProduct: Product = {
                                ...productsStore[index],
                                ...variables.input,
                                updatedAt: new Date().toISOString(),
                            };
                            productsStore[index] = updatedProduct;
                            result = {
                                data: {
                                    updateProduct: updatedProduct,
                                },
                            };
                        } else {
                            throw new Error('Product not found');
                        }
                        break;

                    case 'DeleteProduct':
                        // Delete product
                        const deleteIndex = productsStore.findIndex(p => p.id === variables.id);
                        if (deleteIndex !== -1) {
                            const deletedProduct = productsStore[deleteIndex];
                            productsStore.splice(deleteIndex, 1);
                            result = {
                                data: {
                                    deleteProduct: deletedProduct,
                                },
                            };
                        } else {
                            throw new Error('Product not found');
                        }
                        break;

                    case 'GetDashboardStats':
                        // Calculate and return dashboard statistics
                        const stats = calculateDashboardStats(productsStore);
                        result = {
                            data: {
                                dashboardStats: stats,
                            },
                        };
                        break;

                    default:
                        throw new Error(`Unknown operation: ${operationName}`);
                }

                observer.next(result);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        }, 500); // 500ms simulated delay
    });
});

// Create Apollo Client with mock link
export const apolloClient = new ApolloClient({
    link: mockLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
        },
        query: {
            fetchPolicy: 'network-only',
        },
    },
});
