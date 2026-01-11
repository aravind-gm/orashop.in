"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyMiddleware = void 0;
/**
 * Middleware to capture raw body for webhook signature verification
 * Only applies to webhook routes
 */
const rawBodyMiddleware = (req, res, next) => {
    // Only capture raw body for webhook routes
    if (req.path === '/api/payments/webhook' && req.is('application/json')) {
        let rawBody = '';
        req.on('data', (chunk) => {
            rawBody += chunk.toString('utf-8');
        });
        req.on('end', () => {
            req.rawBody = rawBody;
            next();
        });
    }
    else {
        next();
    }
};
exports.rawBodyMiddleware = rawBodyMiddleware;
//# sourceMappingURL=rawBody.js.map