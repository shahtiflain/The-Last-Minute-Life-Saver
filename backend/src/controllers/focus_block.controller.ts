import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { FocusBlock } from '../models/FocusBlock.js';

export const getFocusBlocks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const blocks = await FocusBlock.find({ userId }).sort({ startTime: 1 });
  res.json({ status: 'success', data: blocks });
});

export const getPendingBlocks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const blocks = await FocusBlock.find({ userId, status: 'PENDING_APPROVAL' }).sort({ startTime: 1 });
  res.json({ status: 'success', data: blocks });
});

export const updateFocusBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const block = await FocusBlock.findOneAndUpdate(
    { _id: req.params.id as string, userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!block) {
    res.status(404).json({ status: 'error', message: 'Focus block not found' });
    return;
  }

  res.json({ status: 'success', data: block });
});

export const deleteFocusBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const block = await FocusBlock.findOneAndDelete({ _id: req.params.id as string, userId });

  if (!block) {
    res.status(404).json({ status: 'error', message: 'Focus block not found' });
    return;
  }

  res.json({ status: 'success', message: 'Focus block deleted' });
});
