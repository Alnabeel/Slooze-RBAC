import { gql } from '@apollo/client';

// Query to get all products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      category
      price
      stock
      description
      createdAt
      updatedAt
    }
  }
`;

// Query to get a single product by ID
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      category
      price
      stock
      description
      createdAt
      updatedAt
    }
  }
`;

// Mutation to create a new product
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      category
      price
      stock
      description
      createdAt
      updatedAt
    }
  }
`;

// Mutation to update an existing product
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      category
      price
      stock
      description
      createdAt
      updatedAt
    }
  }
`;

// Mutation to delete a product
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

// Query to get dashboard statistics (Manager only)
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProducts
      lowStockItems
      categories
      totalValue
    }
  }
`;
