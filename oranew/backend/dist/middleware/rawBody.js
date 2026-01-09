"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyMiddleware = void 0;
/**
 * Middleware to capture raw body for webhook signature verification
 * Must be placed BEFORE express.json() middleware
 */
const rawBodyMiddleware = (req, res, next) => {
    if (req.is('application/json')) {
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