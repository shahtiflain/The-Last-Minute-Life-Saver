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

export default router;
