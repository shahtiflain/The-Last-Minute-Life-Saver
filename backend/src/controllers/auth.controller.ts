import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { z } from 'zod';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // redirect URI for @react-oauth/google auth-code flow
);

export const getGoogleAuthUrl = asyncHandler(async (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ],
    prompt: 'consent', // Force to get refresh token
  });
  res.json({ url });
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;
  const userId = req.user!.userId;

  if (!code) {
    res.status(400).json({ status: 'error', message: 'No authorization code provided' });
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens securely in the user's document
    const { encrypt } = await import('../utils/encryption.js');
    const encryptedTokens = encrypt(JSON.stringify(tokens));
    
    await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          'connectedAccounts.googleCalendar': { encrypted: encryptedTokens }
        }
      },
      { upsert: true }
    );

    res.json({ status: 'success', message: 'Google Calendar connected successfully' });
  } catch (error: any) {
    import('../utils/logger.js').then(({ logger }) => {
      logger.error('Error exchanging Google OAuth code', { 
        error: error.message, 
        response: error.response?.data 
      });
    });
    res.status(500).json({ status: 'error', message: 'Failed to connect Google Calendar' });
  }
});

export const getCalendarStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await User.findOne({ userId });
  
  const isConnected = !!user?.connectedAccounts?.googleCalendar;
  res.json({ isConnected });
});

export const disconnectGoogleCalendar = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await User.findOneAndUpdate(
    { userId },
    { $unset: { 'connectedAccounts.googleCalendar': '' } }
  );
  res.json({ status: 'success', message: 'Google Calendar disconnected' });
});
