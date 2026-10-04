import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', getDashboardAnalytics);

export default router;
