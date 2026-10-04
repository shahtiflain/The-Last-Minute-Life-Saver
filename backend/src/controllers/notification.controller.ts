import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Notification } from '../models/Notification.js';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const notifications = await Notification.find({ userId })
    .sort({ timestamp: -1 })
    .limit(20);
  
  res.json({ status: 'success', data: notifications });
});
