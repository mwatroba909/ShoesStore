import express from 'express';

import { signup } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/zarejestruj', signup)

router.post('/zaloguj', login)

router.post('/wyloguj', logout)

export default router;