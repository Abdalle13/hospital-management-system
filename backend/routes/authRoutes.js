import express from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', authLimiter, resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
