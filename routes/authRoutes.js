import express from 'express';
import { forgotPassword, resetPassword } from './controllers/authController.js';

const router = express.Router();

router.post('/api/auth/forgot-password', forgotPassword);
router.post('/api/auth/reset-password/:token', resetPassword);

export default router;
