import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const traceId = req.headers['x-request-id'] || req.headers['trace-id'] || uuidv4();
  req.headers['x-request-id'] = traceId;
  res.setHeader('X-Request-ID', traceId);
  
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = req.user?.userId || 'anonymous';
    
    logger.info('Request processed', {
      method: req.method,
      url: req.url,
      traceId,
      userId,
      statusCode: res.statusCode,
      responseTimeMs: duration,
      ip: req.ip,
    });
  });
  
  next();
};
