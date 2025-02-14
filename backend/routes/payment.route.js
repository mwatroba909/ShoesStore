import express from 'express';
import { createPayment, checkoutSucces } from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create_payment', protectRoute, createPayment)
router.post('/checkout_succes', protectRoute, checkoutSucces)

export default router;