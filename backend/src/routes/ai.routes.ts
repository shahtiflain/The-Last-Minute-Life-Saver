import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { orchestrate, approveSchedule } from '../controllers/ai.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/orchestrate', orchestrate);
router.post('/schedule/approve', approveSchedule);

export default router;
