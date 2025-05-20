import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post('/api/auth/register', { name, email, password });
    return response.data;
  },
  
  adminLogin: async (email: string, password: string) => {
    const response = await apiClient.post('/api/admin/login', { email, password });
    return response.data;
  }
};

// Product Services
export const productService = {
  getProducts: async (params = {}) => {
    try {
      console.log('Fetching products with params:', params);
      const response = await apiClient.get('/api/products', { params });
      
      console.log('API response raw:', response.data);
      
      // Ensure ID fields are consistently available
      if (response.data.products) {
        console.log('Number of products returned:', response.data.products.length);
        console.log('Product sources:', response.data.products.map((p: any) => p.source));
        
        const dbProducts = response.data.products.filter((p: any) => p.source === 'database');
        console.log('Database products count:', dbProducts.length);
        
        if (dbProducts.length > 0) {
          console.log('First DB product sample:', dbProducts[0]);
        }
        
        response.data.products = response.data.products.map((product: any) => ({
          ...product,
          id: product.id || product._id,
          _id: product._id || product.id
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error in productService.getProducts:', error);
      throw error;
    }
  },
  
  getProductById: async (id: string) => {
    const response = await apiClient.get(`/api/products/${id}`);
    
    // Ensure ID fields are consistently available
    if (response.data.product) {
      response.data.product = {
        ...response.data.product,
        id: response.data.product.id || response.data.product._id,
        _id: response.data.product._id || response.data.product.id
      };
    }
    
    return response.data;
  },
  
  createProduct: async (productData: any) => {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  },
  
  updateProduct: async (id: string, productData: any) => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  }
};

// Seller Services
export const sellerService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/sellers/dashboard');
    return response.data;
  },
  
  getSubmissions: async () => {
    const response = await apiClient.get('/api/sellers/submissions');
    return response.data;
  },
  
  submitProduct: async (productData: any) => {
    const response = await apiClient.post('/api/sellers/products/submit', productData);
    return response.data;
  },
  
  deleteSubmission: async (id: string) => {
    const response = await apiClient.delete(`/api/sellers/submissions/${id}`);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  getUsers: async () => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },
  
  getProductSubmissions: async () => {
    const response = await apiClient.get('/api/admin/product-submissions');
    return response.data;
  },
  
  approveSubmission: async (id: string) => {
    const response = await apiClient.post(`/api/admin/product-submissions/${id}/approve`);
    return response.data;
  },
  
  rejectSubmission: async (id: string, feedback: string) => {
    const response = await apiClient.post(`/api/admin/product-submissions/${id}/reject`, { feedback });
    return response.data;
  }
};

// Order Services
export const orderService = {
  getOrders: async () => {
    const response = await apiClient.get('/api/orders');
    return response.data;
  },
  
  getOrderById: async (id: string) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },
  
  createOrder: async (orderData: any) => {
    const response = await apiClient.post('/api/orders', orderData);
    return response.data;
  },
  
  submitReturn: async (orderId: string, reason: string) => {
    const response = await apiClient.post(`/api/orders/${orderId}/return`, { reason });
    return response.data;
  },
  
  cancelOrder: async (orderId: string) => {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  }
};

// Admin Order Management
export const adminOrderService = {
  getAllOrders: async (params = {}) => {
    const response = await apiClient.get('/api/admin/orders', { params });
    return response.data;
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await apiClient.put(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  },
  
  approveReturn: async (orderId: string) => {
    const response = await apiClient.post(`/api/admin/orders/${orderId}/approve-return`);
    return response.data;
  },
  
  rejectReturn: async (orderId: string, reason: string) => {
    const response = await apiClient.post(`/api/admin/orders/${orderId}/reject-return`, { reason });
    return response.data;
  }
};

export default {
  authService,
  productService,
  sellerService,
  adminService,
  orderService,
  adminOrderService
}; 