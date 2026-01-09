import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to capture raw body for webhook signature verification
 * Must be placed BEFORE express.json() middleware
 */
export const rawBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.is('application/json')) {
    let rawBody = '';
    
    req.on('data', (chunk: Buffer) => {
      rawBody += chunk.toString('utf-8');
    });

    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
};
