import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task.js';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    category: z.string().min(1),
    deadline: z.string().datetime(), // ISO string
    estimatedDurationMinutes: z.number().min(1),
    progress: z.number().min(0).max(100).optional(),
    dependencies: z.array(z.string()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    category: z.string().min(1).optional(),
    deadline: z.string().datetime().optional(),
    estimatedDurationMinutes: z.number().min(1).optional(),
    progress: z.number().min(0).max(100).optional(),
    dependencies: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
