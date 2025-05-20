# Frontend API Service

This directory contains a centralized API service for making HTTP requests to the backend. The service is built using Axios and provides a structured approach to API calls across the application.

## Structure

The API service is organized into logical sections:

- `authService`: Authentication-related API calls (login, register)
- `productService`: Product management (CRUD operations)
- `sellerService`: Seller-specific operations (dashboard, submissions)
- `adminService`: Admin panel operations (user management, product submissions)
- `orderService`: Order management for customers
- `adminOrderService`: Order management for administrators

## Usage

### Import

```typescript
// Import individual services
import { authService, productService } from '../api';

// Or import the default export for all services
import api from '../api';
```

### Authentication

```typescript
// Login
const login = async (email, password) => {
  try {
    const userData = await authService.login(email, password);
    // Handle successful login
    return userData;
  } catch (error) {
    // Handle error
    console.error('Login failed:', error);
  }
};

// Register
const register = async (name, email, password) => {
  try {
    const result = await authService.register(name, email, password);
    // Handle successful registration
    return result;
  } catch (error) {
    // Handle error
    console.error('Registration failed:', error);
  }
};
```

### Products

```typescript
// Get all products
const fetchProducts = async (filters = {}) => {
  try {
    const products = await productService.getProducts(filters);
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

// Get product details
const fetchProductDetails = async (productId) => {
  try {
    const product = await productService.getProductById(productId);
    return product;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }
};
```

### Seller Operations

```typescript
// Get seller dashboard stats
const getDashboardData = async () => {
  try {
    const stats = await sellerService.getDashboardStats();
    return stats;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
};

// Get seller submissions
const getMySubmissions = async () => {
  try {
    const submissions = await sellerService.getSubmissions();
    return submissions;
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
  }
};
```

### Admin Operations

```typescript
// Get all users
const fetchUsers = async () => {
  try {
    const users = await adminService.getUsers();
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

// Get product submissions
const fetchProductSubmissions = async () => {
  try {
    const submissions = await adminService.getProductSubmissions();
    return submissions;
  } catch (error) {
    console.error('Failed to fetch product submissions:', error);
  }
};
```

### Order Management

```typescript
// Get user orders
const fetchMyOrders = async () => {
  try {
    const orders = await orderService.getOrders();
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

// Submit a return request
const submitReturnRequest = async (orderId, reason) => {
  try {
    const result = await orderService.submitReturn(orderId, reason);
    return result;
  } catch (error) {
    console.error('Failed to submit return request:', error);
  }
};
```

### Admin Order Management

```typescript
// Get all orders (admin)
const fetchAllOrders = async (filters = {}) => {
  try {
    const orders = await adminOrderService.getAllOrders(filters);
    return orders;
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
  }
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await adminOrderService.updateOrderStatus(orderId, status);
    return result;
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
};

// Approve a return request
const approveReturn = async (orderId) => {
  try {
    const result = await adminOrderService.approveReturn(orderId);
    return result;
  } catch (error) {
    console.error('Failed to approve return:', error);
  }
};
```

## Configuration

The API service is configured with:

- Base URL: `http://localhost:5000` (can be updated for production)
- Default headers: Content-Type set to application/json
- Authentication: Bearer token is automatically added to requests from localStorage

## Error Handling

All API methods return promises that resolve with the response data or reject with an error. It's recommended to wrap API calls in try/catch blocks for proper error handling. 