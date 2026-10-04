import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Task } from '../models/Task.js';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const tasks = await Task.find({ userId, deletedAt: null });
  res.json({ status: 'success', data: tasks });
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const task = await Task.findOne({ _id: req.params.id as string, userId, deletedAt: null });
  
  if (!task) {
    res.status(404).json({ status: 'error', message: 'Task not found' });
    return;
  }
  
  res.json({ status: 'success', data: task });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const task = await Task.create({
    ...req.body,
    userId,
  });
  
  res.status(201).json({ status: 'success', data: task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id as string, userId, deletedAt: null },
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404).json({ status: 'error', message: 'Task not found' });
    return;
  }

  res.json({ status: 'success', data: task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  // Soft delete
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id as string, userId, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!task) {
    res.status(404).json({ status: 'error', message: 'Task not found' });
    return;
  }

  // Cascade delete pending focus blocks for this task
  const { FocusBlock } = await import('../models/FocusBlock.js');
  await FocusBlock.deleteMany({ taskId: (task._id as any).toString(), userId, status: 'PENDING_APPROVAL' });

  res.json({ status: 'success', message: 'Task deleted' });
});
