import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Import models
import Product from './models/Product';
import Admin from './models/Admin';

// Import routes
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import productRoutes from './routes/productRoutes';
import sellerRoutes from './routes/sellerRoutes';

// Import middleware
import { protect } from './middleware/authMiddleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mount routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);

// Create initial admin account if it doesn't exist
const createInitialAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      await Admin.create({
        email: 'admin@example.com',
        password: 'admin123' // This will be hashed automatically
      });
      console.log('Initial admin account created');
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the E-commerce API' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createInitialAdmin();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
}); 