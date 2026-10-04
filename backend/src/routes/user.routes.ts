import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { getMe, createUser, updateMe } from '../controllers/user.controller.js';
import { createUserSchema, updateUserSchema } from '../validations/user.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.post('/', validateRequest(createUserSchema), createUser);
router.put('/me', validateRequest(updateUserSchema), updateMe);
router.put('/fcm-token', async (req, res, next) => {
  const { updateFcmToken } = await import('../controllers/user.controller.js');
  updateFcmToken(req, res, next);
});

export default router;
