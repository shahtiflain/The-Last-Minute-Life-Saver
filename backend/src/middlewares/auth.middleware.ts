import type { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import '../config/firebase.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email?: string;
    };
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: 'error', message: 'Unauthorized: Missing token' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    
    // In test environment, bypass token validation if we want, or just mock it.
    // For now we will try to verify it.
    const decodedToken = await getAuth().verifyIdToken(token as string);
    
    req.user = {
      userId: decodedToken.uid,
    };
    if (decodedToken.email) {
      req.user.email = decodedToken.email;
    }
    
    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or expired token' });
  }
};
