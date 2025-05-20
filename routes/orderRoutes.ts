import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  submitReturn,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// User order routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.post('/:id/return', submitReturn);
router.post('/:id/cancel', cancelOrder);

// Admin order routes
router.get('/admin/all', authorizeRoles('admin'), getAllOrders);
router.get('/admin/stats', authorizeRoles('admin'), getOrderStats);
router.put('/admin/:id/status', authorizeRoles('admin'), updateOrderStatus);

export default router; 