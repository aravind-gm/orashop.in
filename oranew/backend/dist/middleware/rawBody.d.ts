import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to capture raw body for webhook signature verification
 * Must be placed BEFORE express.json() middleware
 */
export declare const rawBodyMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rawBody.d.ts.map