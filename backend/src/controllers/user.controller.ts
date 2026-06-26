import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await User.findOne({ userId });

  if (!user) {
    res.status(404).json({ status: 'error', message: 'User not found' });
    return;
  }

  res.json({ status: 'success', data: user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const existingUser = await User.findOne({ userId });

  if (existingUser) {
    res.status(400).json({ status: 'error', message: 'User already exists' });
    return;
  }

  const user = await User.create({
    userId,
    ...req.body,
  });

  res.status(201).json({ status: 'success', data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await User.findOneAndUpdate({ userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    res.status(404).json({ status: 'error', message: 'User not found' });
    return;
  }

  res.json({ status: 'success', data: user });
});
