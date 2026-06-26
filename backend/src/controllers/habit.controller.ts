import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Habit } from '../models/Habit.js';

export const getHabits = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const habits = await Habit.find({ userId });
  res.json({ status: 'success', data: habits });
});

export const getHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const habit = await Habit.findOne({ _id: req.params.id as string, userId });
  
  if (!habit) {
    res.status(404).json({ status: 'error', message: 'Habit not found' });
    return;
  }
  
  res.json({ status: 'success', data: habit });
});

export const createHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const habit = await Habit.create({
    ...req.body,
    userId,
  });
  
  res.status(201).json({ status: 'success', data: habit });
});

export const updateHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id as string, userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!habit) {
    res.status(404).json({ status: 'error', message: 'Habit not found' });
    return;
  }

  res.json({ status: 'success', data: habit });
});

export const deleteHabit = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const habit = await Habit.findOneAndDelete({ _id: req.params.id as string, userId });

  if (!habit) {
    res.status(404).json({ status: 'error', message: 'Habit not found' });
    return;
  }

  res.json({ status: 'success', message: 'Habit deleted' });
});
