import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getGoogleAuthUrl, googleCallback, getCalendarStatus, disconnectGoogleCalendar } from '../controllers/auth.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/google/url', getGoogleAuthUrl);
router.post('/google/callback', googleCallback);
router.get('/google/status', getCalendarStatus);
router.delete('/google/disconnect', disconnectGoogleCalendar);

export default router;
