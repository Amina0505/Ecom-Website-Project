/**
 * Application configuration
 */

// Base URL for API requests
export const API_BASE_URL = 'http://localhost:5000';

// Routes
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Seller
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_SUBMISSIONS: '/seller/submissions',
  SELLER_ADD_PRODUCT: '/seller/products/new',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_SUBMISSIONS: '/admin/submissions',
  
  // Shopping
  HOME: '/',
  PRODUCT_DETAILS: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
};

export default {
  API_BASE_URL,
  ROUTES,
}; 