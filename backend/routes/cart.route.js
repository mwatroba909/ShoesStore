import express from 'express';
import { addToCart, deleteAllFromCart, updateQuantity, getCartProducts } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getCartProducts)
router.post('/', protectRoute, addToCart)
router.delete('/', protectRoute, deleteAllFromCart) 
router.put('/:id', protectRoute, updateQuantity)

export default router;