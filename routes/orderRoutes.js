const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, requestReturn);

// Admin routes
router.get('/admin/all', protect, authorizeRoles('admin'), getAllOrders);
router.put(
  '/admin/:id/status',
  protect,
  authorizeRoles('admin'),
  updateOrderStatus
);
router.get('/admin/stats', protect, authorizeRoles('admin'), getOrderStats);

module.exports = router;
