import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { getHabits, getHabit, createHabit, updateHabit, deleteHabit } from '../controllers/habit.controller.js';
import { createHabitSchema, updateHabitSchema, habitIdSchema } from '../validations/habit.validation.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(getHabits)
  .post(validateRequest(createHabitSchema), createHabit);

router.route('/:id')
  .get(validateRequest(habitIdSchema), getHabit)
  .put(validateRequest(updateHabitSchema), updateHabit)
  .delete(validateRequest(habitIdSchema), deleteHabit);

export default router;
