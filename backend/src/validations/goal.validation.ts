import { z } from 'zod';
import { GoalType } from '../models/Goal.js';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    goalType: z.nativeEnum(GoalType),
    progress: z.number().min(0).max(100).optional(),
    deadline: z.string().datetime(),
    linkedTasks: z.array(z.string()).optional(),
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    goalType: z.nativeEnum(GoalType).optional(),
    progress: z.number().min(0).max(100).optional(),
    deadline: z.string().datetime().optional(),
    linkedTasks: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const goalIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
