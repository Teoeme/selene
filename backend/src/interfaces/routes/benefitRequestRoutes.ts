import { Router } from 'express';
import { BenefitRequestController } from '../controllers/BenefitRequestController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const controller = new BenefitRequestController();
const authMiddleware = new AuthMiddleware();

// Aplicar autenticación a todas las rutas
router.use(authMiddleware.authenticate);

router.post('/',authMiddleware.requireEmployee,controller.createRequest);

router.get('/',controller.listRequests);

router.get('/:id',controller.getRequest);

router.patch('/:id/approve',authMiddleware.requireAdmin,controller.approveRequest);

router.patch('/:id/reject',authMiddleware.requireAdmin,controller.rejectRequest);

export default router; 