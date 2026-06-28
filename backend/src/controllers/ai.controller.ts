import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';

// We validate the basic structure before forwarding, but the orchestrator does its own deep validation
const orchestrateSchema = z.object({
  intent: z.string().min(1),
  context: z.record(z.string(), z.any()).optional(),
  calendarTokens: z.record(z.string(), z.any()).optional(),
});

const approveScheduleSchema = z.object({
  blocks: z.array(z.record(z.string(), z.any())),
});

import { User } from '../models/User.js';

export const orchestrate = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const parsed = await orchestrateSchema.parseAsync(req.body);

  const user = await User.findOne({ userId });
  const googleTokens = user?.connectedAccounts?.googleCalendar || null;

  const orchestratorUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const internalApiKey = process.env.INTERNAL_API_KEY || 'your_secure_internal_key'; // default matching ai-orchestrator/.env.example

  const payload = {
    user_id: userId,
    intent: parsed.intent,
    context: parsed.context || {},
    calendar_tokens: googleTokens,
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
  const googleTokens = user?.connectedAccounts?.googleCalendar || null;

  if (!googleTokens) {
    res.status(400).json({ status: 'error', message: 'Google Calendar is not connected' });
    return;
  }

  const orchestratorUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  const internalApiKey = process.env.INTERNAL_API_KEY || 'your_secure_internal_key';

  const payload = {
    user_id: userId,
    blocks: parsed.blocks,
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
