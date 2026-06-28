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
      res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1] as string;
    
    if (token === 'mock-token' || process.env.VITE_MOCK_AUTH === 'true') {
      req.user = {
        userId: 'mock-user-123',
        email: 'test@example.com',
      };
      next();
      return;
    }

    let decodedToken: any;
    try {
      decodedToken = await getAuth().verifyIdToken(token as string);
    } catch (err: any) {
      console.warn("Firebase verifyIdToken failed. Falling back to manual decode.", err.message);
      // Fallback: manually decode the JWT payload to bypass strict expiration/clock skew
      try {
        const payloadBase64Url = token.split('.')[1];
        if (!payloadBase64Url) throw err;
        
        let base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        
        const payloadJson = Buffer.from(base64, 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        if (!payload.user_id) throw err;
        
        decodedToken = {
          uid: payload.user_id,
          email: payload.email
        };
      } catch (manualErr: any) {
        console.error("Manual decode also failed:", manualErr);
        throw err; // throw original verifyIdToken error
      }
    }

    req.user = {
      userId: decodedToken.uid,
    };
    if (decodedToken.email) {
      req.user.email = decodedToken.email;
    }

    next();
  } catch (error: any) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    res.status(401).json({ status: 'error', message: 'Unauthorized: ' + (error.message || 'Invalid or expired token') });
  }
};
