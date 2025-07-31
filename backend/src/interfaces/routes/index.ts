import { Router } from 'express';
import benefitRequestRoutes from './benefitRequestRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/benefit-requests', benefitRequestRoutes);

router.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    service: 'benefit-management-api',
    timestamp: new Date().toISOString()
  });
});

export default router; 