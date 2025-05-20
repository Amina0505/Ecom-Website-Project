import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import TodaysDealsPage from './pages/TodaysDealsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import { WishlistProvider } from './contexts/WishlistContext';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './components/admin/AdminDashboard';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerOverview from './components/seller/SellerOverview';
import MySubmissions from './components/seller/MySubmissions';
import SubmitProductForm from './components/seller/SubmitProductForm';
import ProductManagement from './pages/seller/ProductManagement';
import SellerLoginPage from './pages/SellerLoginPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <MainLayout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/category/:category" element={<CategoryProductsPage />} />
                  <Route path="/deals" element={<TodaysDealsPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Redirect /admin to /admin/dashboard */}
                  <Route 
                    path="/admin" 
                    element={
                      localStorage.getItem('adminToken') 
                        ? <Navigate to="/admin/dashboard" replace /> 
                        : <Navigate to="/admin/login" replace />
                    } 
                  />
                  
                  {/* Seller routes */}
                  <Route path="/seller/login" element={<SellerLoginPage />} />
                  
                  {/* Root seller path redirect */}
                  <Route 
                    path="/seller"
                    element={
                      localStorage.getItem('userToken') 
                        ? <Navigate to="/seller/dashboard" replace /> 
                        : <Navigate to="/seller/login" replace />
                    }
                  />
                  
                  {/* Seller dashboard and nested routes */}
                  <Route 
                    path="/seller/dashboard"
                    element={
                      <ProtectedRoute>
                        <SellerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/seller/products/new"
                    element={
                      <ProtectedRoute>
                        <SellerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/seller/products"
                    element={
                      <ProtectedRoute>
                        <SellerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/seller/submissions"
                    element={
                      <ProtectedRoute>
                        <SellerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Protected user routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </MainLayout>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
