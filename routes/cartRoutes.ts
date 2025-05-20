import express from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(protect);

router.get('/', getCart);
router.put('/', updateCart);
router.delete('/', clearCart);

export default router; 