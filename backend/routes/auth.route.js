import express from 'express';

import { signup } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { refresh_token } from '../controllers/auth.controller.js';
import { getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/zarejestruj', signup)
router.post('/zaloguj', login)
router.post('/wyloguj', logout)
router.post('/odswiez_token', refresh_token)
router.get(`/profile`, protectRoute, getProfile)

export default router;