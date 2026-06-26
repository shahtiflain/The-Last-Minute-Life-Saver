import { z } from 'zod';

export const createHabitSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    frequencyDays: z.array(z.number().min(0).max(6)).nonempty(),
    currentStreak: z.number().min(0).optional(),
    longestStreak: z.number().min(0).optional(),
    reminderEnabled: z.boolean().optional(),
  }),
});

export const updateHabitSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    frequencyDays: z.array(z.number().min(0).max(6)).nonempty().optional(),
    currentStreak: z.number().min(0).optional(),
    longestStreak: z.number().min(0).optional(),
    reminderEnabled: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const habitIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
