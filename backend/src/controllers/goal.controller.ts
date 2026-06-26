import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Goal } from '../models/Goal.js';

export const getGoals = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goals = await Goal.find({ userId });
  res.json({ status: 'success', data: goals });
});

export const getGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goal = await Goal.findOne({ _id: req.params.id as string, userId });
  
  if (!goal) {
    res.status(404).json({ status: 'error', message: 'Goal not found' });
    return;
  }
  
  res.json({ status: 'success', data: goal });
});

export const createGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goal = await Goal.create({
    ...req.body,
    userId,
  });
  
  res.status(201).json({ status: 'success', data: goal });
});

export const updateGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id as string, userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!goal) {
    res.status(404).json({ status: 'error', message: 'Goal not found' });
    return;
  }

  res.json({ status: 'success', data: goal });
});

export const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goal = await Goal.findOneAndDelete({ _id: req.params.id as string, userId });

  if (!goal) {
    res.status(404).json({ status: 'error', message: 'Goal not found' });
    return;
  }

  res.json({ status: 'success', message: 'Goal deleted' });
});
