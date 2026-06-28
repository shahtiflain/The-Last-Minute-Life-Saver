import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { FocusBlock } from '../models/FocusBlock.js';
import { decrypt } from '../utils/encryption.js';

// We validate the basic structure before forwarding, but the orchestrator does its own deep validation
const orchestrateSchema = z.object({
  intent: z.string().min(1),
  context: z.record(z.string(), z.any()).optional(),
  calendarTokens: z.record(z.string(), z.any()).optional(),
});

const approveScheduleSchema = z.object({
  blocks: z.array(z.record(z.string(), z.any())),
});

export const orchestrate = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const parsed = await orchestrateSchema.parseAsync(req.body);

  const user = await User.findOne({ userId });
  let decryptedGoogleTokens = null;

  if ((user?.connectedAccounts?.googleCalendar as any)?.encrypted) {
    try {
      const rawTokens = decrypt((user!.connectedAccounts!.googleCalendar as any).encrypted);
      decryptedGoogleTokens = JSON.parse(rawTokens);
    } catch (e) {
      console.error('Failed to decrypt Google Calendar tokens', e);
    }
  }

  const orchestratorUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const internalApiKey = process.env.INTERNAL_API_KEY || 'your_secure_internal_key'; // default matching ai-orchestrator/.env.example

  const payload = {
    user_id: userId,
    intent: parsed.intent,
    context: parsed.context || {},
    calendar_tokens: decryptedGoogleTokens,
  };

  try {
    const response = await fetch(`${orchestratorUrl}/api/v1/orchestrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': internalApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Orchestrator error (${response.status}):`, errorText);
      res.status(response.status).json({ status: 'error', message: 'Failed to orchestrate request' });
      return;
    }

    const data = await response.json();

    // Execute Memory Updates natively on Node backend
    if (data.agent_responses && Array.isArray(data.agent_responses)) {
      for (const agentRes of data.agent_responses) {
        if (agentRes.memory_updates && Array.isArray(agentRes.memory_updates)) {
          for (const update of agentRes.memory_updates) {
        if (update.action === 'create') {
          if (update.collection === 'tasks') {
            await Task.create({
              userId,
              title: update.data.title,
              description: update.data.description,
              priority: update.data.priority,
              status: update.data.status || 'TODO',
              category: 'AI generated',
              deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
              estimatedDurationMinutes: update.data.estimatedMinutes || 60,
              progress: 0,
            });
          } else if (update.collection === 'focus_blocks') {
            await FocusBlock.create({
              userId,
              taskId: update.data.taskId,
              type: update.data.type,
              title: update.data.title,
              startTime: update.data.startTime,
              endTime: update.data.endTime,
              pomodorosAssigned: update.data.pomodorosAssigned || 1,
              whyThisSlot: update.data.whyThisSlot,
              energyRequirement: update.data.energyRequirement,
              estimatedFocusScore: update.data.estimatedFocusScore,
              status: update.data.status,
            });
          } else if (update.collection === 'notification_history') {
            const { Notification } = await import('../models/Notification.js');
            await Notification.create({
              userId,
              title: update.data.title,
              type: update.data.type,
              status: update.data.status,
              timestamp: new Date(update.data.timestamp),
            });
          }
        }
      }
    }
  }
}
    res.json(data);
  } catch (error: any) {
    console.error('Error connecting to orchestrator:', error.message);
    res.status(500).json({ status: 'error', message: 'AI Service is unreachable' });
  }
});

export const approveSchedule = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const parsed = await approveScheduleSchema.parseAsync(req.body);

  const user = await User.findOne({ userId });
  let decryptedGoogleTokens = null;

  if ((user?.connectedAccounts?.googleCalendar as any)?.encrypted) {
    try {
      const rawTokens = decrypt((user!.connectedAccounts!.googleCalendar as any).encrypted);
      decryptedGoogleTokens = JSON.parse(rawTokens);
    } catch (e) {
      console.error('Failed to decrypt Google Calendar tokens', e);
    }
  }

  if (!decryptedGoogleTokens) {
    res.status(400).json({ status: 'error', message: 'Google Calendar is not connected' });
    return;
  }

  const orchestratorUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const internalApiKey = process.env.INTERNAL_API_KEY || 'your_secure_internal_key';

  const payload = {
    user_id: userId,
    blocks: parsed.blocks,
    calendar_tokens: decryptedGoogleTokens,
  };

  try {
    const response = await fetch(`${orchestratorUrl}/api/v1/schedule/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': internalApiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Orchestrator error (${response.status}):`, errorText);
      res.status(response.status).json({ status: 'error', message: 'Failed to approve schedule' });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('Error connecting to orchestrator:', error.message);
    res.status(500).json({ status: 'error', message: 'AI Service is unreachable' });
  }
});
