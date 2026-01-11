import { NextFunction, Request, Response } from 'express';
/**
 * Middleware to capture raw body for webhook signature verification
 * Only applies to webhook routes
 */
export declare const rawBodyMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rawBody.d.ts.map