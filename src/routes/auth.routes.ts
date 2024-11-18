import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

export const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authMiddleware, authController.register);
authRoutes.post('/login', authController.login);
