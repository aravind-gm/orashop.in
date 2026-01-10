import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to capture raw body for webhook signature verification
 * Only applies to webhook routes
 */
export const rawBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only capture raw body for webhook routes
  if (req.path === '/api/payments/webhook' && req.is('application/json')) {
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
