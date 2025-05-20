import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          console.log('Checking authentication with token');
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Auth check response:', JSON.stringify(response.data));
          
          // Handle the profile endpoint structure which has success and user properties
          // response.data = { success: true, user: {...} }
          const userData = response.data.success && response.data.user 
            ? response.data.user 
            : (response.data.user || response.data);
          
          console.log('Extracted userData:', JSON.stringify(userData));
          
          if (!userData || !userData._id) {
            console.error('Invalid user data in response:', response.data);
            localStorage.removeItem('userToken');
            setUser(null);
            setLoading(false);
            return;
          }
          
          console.log('Setting user state with: id:', userData._id, 'name:', userData.name, 'email:', userData.email, 'role:', userData.role);
          setUser({
            _id: userData._id,
            name: userData.name || 'User', // Provide default if name is missing
            email: userData.email,
            role: userData.role
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('userToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Logging in with email:', email);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log('Login response data structure:', JSON.stringify(response.data));
      
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        
        // Handle various response structures:
        // 1. { success, token, user: {...} }
        // 2. { token, _id, name, email, role }
        const userData = response.data.user || response.data;
        
        console.log('Extracted userData:', JSON.stringify(userData));
        console.log('User properties present:', {
          _id: !!userData._id,
          name: !!userData.name,
          email: !!userData.email,
          role: !!userData.role
        });
        
        setUser({
          _id: userData._id,
          name: userData.name || 'User', // Provide default if name is missing
          email: userData.email,
          role: userData.role
        });
        
        console.log('User set in context:', {
          _id: userData._id,
          name: userData.name || 'User',
          email: userData.email,
          role: userData.role
        });
        
        // Return the role to allow for redirecting to appropriate dashboard
        return userData.role || null;
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      console.log('Register response:', JSON.stringify(response.data));
      
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        
        // Extract user data, handle both possible structures
        const userData = response.data.user || response.data;
        
        console.log('Register userData:', JSON.stringify(userData));
        
        setUser({
          _id: userData._id,
          name: userData.name || name, // Use registered name as fallback
          email: userData.email || email,
          role: userData.role || 'user'
        });
        
        // Return the role to allow for redirecting to appropriate dashboard
        return userData.role || 'user';
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 