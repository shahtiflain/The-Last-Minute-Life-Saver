import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    fullName: z.string().min(1),
    timezone: z.string().min(1),
    profilePhoto: z.string().optional(),
    preferences: z.record(z.string(), z.any()).optional(),
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
    }),
    notificationSettings: z.record(z.string(), z.any()).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1).optional(),
    timezone: z.string().min(1).optional(),
    profilePhoto: z.string().optional(),
    preferences: z.record(z.string(), z.any()).optional(),
    workingHours: z.object({
      start: z.string(),
      end: z.string(),
    }).optional(),
    notificationSettings: z.record(z.string(), z.any()).optional(),
  }),
});
