import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getNotifications } from '../controllers/notification.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);

export default router;
