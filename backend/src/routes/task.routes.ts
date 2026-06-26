import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../validations/task.validation.js';

const router = Router();

router.use(requireAuth);

router.route('/')
  .get(getTasks)
  .post(validateRequest(createTaskSchema), createTask);

router.route('/:id')
  .get(validateRequest(taskIdSchema), getTask)
  .put(validateRequest(updateTaskSchema), updateTask)
  .delete(validateRequest(taskIdSchema), deleteTask);

export default router;
