import express, { Request, Response, NextFunction } from 'express';
import Admin, { IAdminDocument } from '../models/Admin';
import { protect, generateToken } from '../middleware/authMiddleware';
import { Types } from 'mongoose';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  verifySeller
} from '../controllers/userController';
import {
  getProductSubmissions,
  getProductSubmission,
  approveSubmission,
  rejectSubmission
} from '../controllers/adminController';

const router = express.Router();

// Admin login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email }).exec();

    if (admin && (await admin.comparePassword(password))) {
      const adminDoc = admin as IAdminDocument;
      res.json({
        success: true,
        _id: adminDoc._id,
        email: adminDoc.email,
        token: generateToken(adminDoc._id.toString(), true)
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Check admin status (protected route)
router.get('/check', protect, (req: Request, res: Response) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  res.json({ message: 'Admin authenticated' });
});

// Middleware to check admin status
const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// User management routes - protect all admin routes and ensure admin role
router.get('/users', protect, checkAdmin, getAllUsers);
router.get('/users/:id', protect, checkAdmin, getUser);
router.put('/users/:id', protect, checkAdmin, updateUser);
router.delete('/users/:id', protect, checkAdmin, deleteUser);
router.patch('/users/:id/toggle-status', protect, checkAdmin, toggleUserStatus);
router.patch('/users/:id/verify-seller', protect, checkAdmin, verifySeller);

// Product submission approval routes
router.get('/product-submissions', protect, checkAdmin, getProductSubmissions);
router.get('/product-submissions/:id', protect, checkAdmin, getProductSubmission);
router.post('/product-submissions/:id/approve', protect, checkAdmin, approveSubmission);
router.post('/product-submissions/:id/reject', protect, checkAdmin, rejectSubmission);

export default router; 