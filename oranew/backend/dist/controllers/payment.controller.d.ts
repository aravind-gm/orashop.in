import { Request, Response } from 'express';
/**
 * Create a Razorpay payment order
 * Called after customer selects address and clicks "Continue to Payment"
 * Creates Payment record in DB with status INITIATED
 */
export declare const createPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Verify payment signature (called from frontend after payment)
 * This is idempotent - can be called multiple times safely
 */
export declare const verifyPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Webhook endpoint to receive payment confirmation from Razorpay
 * THIS IS THE SOURCE OF TRUTH FOR PAYMENT STATUS
 */
export declare const webhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get payment status by order ID
 * Called by frontend to poll for webhook confirmation
 */
export declare const getPaymentStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Refund a payment (called by admin when approving returns)
 */
export declare const refundPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=payment.controller.d.ts.map