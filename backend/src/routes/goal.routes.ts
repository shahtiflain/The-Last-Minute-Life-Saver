import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { getGoals, getGoal, createGoal, updateGoal, deleteGoal } from '../controllers/goal.controller.js';
import { createGoalSchema, updateGoalSchema, goalIdSchema } from '../validations/goal.validation.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(getGoals)
  .post(validateRequest(createGoalSchema), createGoal);

router.route('/:id')
  .get(validateRequest(goalIdSchema), getGoal)
  .put(validateRequest(updateGoalSchema), updateGoal)
  .delete(validateRequest(goalIdSchema), deleteGoal);

export default router;
