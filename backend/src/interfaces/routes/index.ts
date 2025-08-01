import { Router } from 'express';
import benefitRequestRoutes from './benefitRequestRoutes';
import authRoutes from './authRoutes';
import benefitsRoutes from './benefitsRoutes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/benefit-requests', benefitRequestRoutes);

router.use('/benefits', benefitsRoutes);

router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    service: 'benefit-management-api',
    timestamp: new Date().toISOString()
  });
});

export default router; 