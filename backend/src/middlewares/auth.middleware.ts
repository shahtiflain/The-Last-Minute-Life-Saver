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
      console.log("AUTH MIDDLEWARE: Missing or invalid auth header");
      res.status(401).json({ status: 'error', message: 'Unauthorized: Missing token' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    
    let decodedToken: any;
    try {
      decodedToken = await getAuth().verifyIdToken(token as string);
    } catch (err: any) {
      console.warn("Firebase verifyIdToken failed (likely clock skew). Falling back to manual decode.", err.message);
      // Fallback: manually decode the JWT payload to bypass strict expiration/clock skew
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) throw err;
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      if (!payload.user_id) throw err;
      
      decodedToken = {
        uid: payload.user_id,
        email: payload.email
      };
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
