import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware.authenticate, authController.me);

export default router; 