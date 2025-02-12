import express from 'express';

import { signup } from '../controllers/auth.controller.js';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { refresh_token } from '../controllers/auth.controller.js';
// import { getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/zarejestruj', signup)

router.post('/zaloguj', login)

router.post('/wyloguj', logout)

router.post('/odswiez_token', refresh_token)

// router.get(`/profile`, getProfile)

export default router;

// accesToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2N2FjYzlhYWVlZDY5MWJlM2Y3OTE3NTciLCJpYXQiOjE3MzkzNzg5NTgsImV4cCI6MTczOTM3OTg1OH0.jslxGT7ZpTPOjRDxykt7XdNERtRbkWjWS1ymNQl5FZw; Path=/; HttpOnly; Expires=Wed, 12 Feb 2025 17:04:14 GMT;