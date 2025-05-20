import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  submitProduct,
  getSellerSubmissions,
  getSellerDashboard
} from '../controllers/sellerController';

const router = express.Router();

// All seller routes are protected
router.use(protect);

// Dashboard
router.get('/dashboard', getSellerDashboard);

// Product submissions
router.post('/products/submit', submitProduct);
router.get('/products/submissions', getSellerSubmissions);

export default router; 