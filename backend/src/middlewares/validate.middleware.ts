import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error as z.ZodError).issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
        });
        return;
      }
      next(error);
    }
  };
