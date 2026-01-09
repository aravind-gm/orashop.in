import crypto from 'crypto';
import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import { prisma } from '../config/database';
import { AppError, asyncHandler } from '../utils/helpers';
import { confirmInventoryDeduction } from '../utils/inventory';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

/**
 * Create a Razorpay payment order
 * Called after customer selects address and clicks "Continue to Payment"
 * Creates Payment record in DB with status INITIATED
 */
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw new AppError('Order ID is required', 400);
  }

  // Fetch order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.status !== 'PENDING') {
    throw new AppError('Order is not in PENDING state', 400);
  }

  if (order.paymentStatus === 'PAID') {
    throw new AppError('Order is already paid', 400);
  }

  // Check if payment record already exists for this order
  const existingPayment = await prisma.payment.findFirst({
    where: { orderId, status: { in: ['PAID', 'REFUNDED'] } },
  });

  if (existingPayment) {
    // Return existing payment details (idempotent)
    return res.json({
      success: true,
      paymentId: existingPayment.id,
      razorpayOrderId: existingPayment.transactionId,
      amount: Number(order.totalAmount) * 100, // Razorpay expects amount in paise
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.orderNumber,
      customer: {
        name: order.user.fullName,
        email: order.user.email,
        phone: order.user.phone,
      },
    });
  }

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(Number(order.totalAmount) * 100), // Convert to paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      orderNumber: order.orderNumber,
    },
  });

  // Create Payment record in database
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentGateway: 'RAZORPAY',
      transactionId: razorpayOrder.id, // Store Razorpay order ID
      amount: order.totalAmount,
      status: 'PENDING',
      gatewayResponse: {
        razorpayOrderId: razorpayOrder.id,
        createdAt: new Date().toISOString(),
      },
    },
  });

  res.json({
    success: true,
    paymentId: payment.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
    orderId: order.orderNumber,
    customer: {
      name: order.user.fullName,
      email: order.user.email,
      phone: order.user.phone,
    },
  });
});

/**
 * Verify payment signature (called from frontend after payment)
 * This is idempotent - can be called multiple times safely
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!orderId || !razorpayPaymentId || !razorpaySignature) {
    throw new AppError('Missing required fields: orderId, razorpayPaymentId, razorpaySignature', 400);
  }

  // Fetch payment from database
  const payment = await prisma.payment.findFirst({
    where: { orderId },
  });

  if (!payment) {
    throw new AppError('Payment record not found', 404);
  }

  // If already verified or confirmed, return success (idempotent)
  if (payment.status === 'PAID') {
    return res.json({
      success: true,
      message: 'Payment already confirmed.',
      status: payment.status,
    });
  }

  // Verify signature
  const body = `${payment.transactionId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Payment signature verification failed', 400);
  }

  // Update payment status to PAID (but not confirmed by webhook)
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'PAID',
      gatewayResponse: {
        ...(typeof payment.gatewayResponse === 'object' ? payment.gatewayResponse : {}),
        razorpayPaymentId,
        verifiedAt: new Date().toISOString(),
      },
    },
  });

  res.json({
    success: true,
    message: 'Payment signature verified. Processing payment...',
    status: 'PAID',
  });
});

/**
 * Webhook endpoint to receive payment confirmation from Razorpay
 * THIS IS THE SOURCE OF TRUTH FOR PAYMENT STATUS
 */
export const webhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;

  if (!signature) {
    console.error('[Webhook] Missing Razorpay signature header');
    return res.status(400).json({ error: 'Missing signature header' });
  }

  const body = (req as any).rawBody || JSON.stringify(req.body);

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('[Webhook] Signature verification failed');
    return res.status(400).json({ error: 'Signature verification failed' });
  }

  const event = req.body;

  if (!event.event) {
    console.error('[Webhook] Missing event type');
    return res.status(400).json({ error: 'Missing event type' });
  }

  console.log(`[Webhook] Received event: ${event.event}`);

  // Only handle payment.authorized events
  if (event.event !== 'payment.authorized' && event.event !== 'payment.captured') {
    console.log(`[Webhook] Ignoring event: ${event.event}`);
    return res.json({ received: true });
  }

  const payload = event.payload?.payment?.entity;

  if (!payload) {
    console.error('[Webhook] Missing payment entity in payload');
    return res.status(400).json({ error: 'Missing payment entity' });
  }

  const { id: razorpayPaymentId, order_id: razorpayOrderId, amount } = payload;

  console.log(`[Webhook] Processing payment ${razorpayPaymentId} for order ${razorpayOrderId}`);

  // Find payment record by razorpayOrderId
  let payment = await prisma.payment.findFirst({
    where: { transactionId: razorpayOrderId },
  });

  if (!payment) {
    console.error(`[Webhook] Payment record not found for Razorpay order ${razorpayOrderId}`);
    return res.status(400).json({ error: 'Payment record not found' });
  }

  // IDEMPOTENCY: If already confirmed, return success without reprocessing
  if (payment.status === 'PAID') {
    console.log(`[Webhook] Payment ${payment.id} already confirmed. Skipping reprocessing.`);
    return res.json({ received: true });
  }

  // Fetch order with items
  const order = await prisma.order.findUnique({
    where: { id: payment.orderId },
    include: {
      items: { include: { product: true } },
      user: true,
    },
  });

  if (!order) {
    console.error(`[Webhook] Order not found for payment ${payment.id}`);
    return res.status(400).json({ error: 'Order not found' });
  }

  try {
    // Begin transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Update payment status
      payment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          gatewayResponse: {
            ...(typeof payment.gatewayResponse === 'object' ? payment.gatewayResponse : {}),
            razorpayPaymentId,
            confirmedAt: new Date().toISOString(),
            webhookPayload: payload,
          },
        },
      });

      console.log(`[Webhook] Payment ${payment.id} marked as PAID`);

      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING',
        },
      });

      console.log(`[Webhook] Order ${order.id} marked as PROCESSING`);

      // Deduct inventory
      await confirmInventoryDeduction(order.id);
      console.log(`[Webhook] Inventory deducted for order ${order.id}`);

      // Clear user's cart (now that payment is confirmed)
      await tx.cartItem.deleteMany({
        where: { userId: order.userId },
      });

      console.log(`[Webhook] Cart cleared for user ${order.userId}`);

      // Create notification
      await tx.notification.create({
        data: {
          userId: order.userId,
          type: 'ORDER_CONFIRMED',
          title: 'Order Confirmed',
          message: `Your order #${order.orderNumber} has been confirmed and will be processed soon.`,
          isRead: false,
        },
      });

      console.log(`[Webhook] Notification created for user ${order.userId}`);
    });

    return res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get payment status by order ID
 * Called by frontend to poll for webhook confirmation
 */
export const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new AppError('Order ID is required', 400);
  }

  const payment = await prisma.payment.findFirst({
    where: { orderId },
    orderBy: { createdAt: 'desc' },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  res.json({
    paymentId: payment.id,
    status: payment.status,
    amount: payment.amount,
    transactionId: payment.transactionId,
  });
});

/**
 * Refund a payment (called by admin when approving returns)
 */
export const refundPayment = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId, amount, reason } = req.body;

  if (!paymentId || !amount) {
    throw new AppError('Payment ID and amount are required', 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.status !== 'PAID') {
    throw new AppError('Can only refund paid payments', 400);
  }

  try {
    // Call Razorpay refund API
    const refund = await razorpay.payments.refund(payment.transactionId!, {
      amount: Math.round(Number(amount) * 100), // Convert to paise
      notes: {
        reason: reason || 'Customer refund',
      },
    });

    // Update payment record
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
        gatewayResponse: {
          ...(typeof payment.gatewayResponse === 'object' ? payment.gatewayResponse : {}),
          refund: refund,
          refundedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`[Refund] Refund processed for payment ${paymentId}, refund ID: ${refund.id}`);

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount,
    });
  } catch (error) {
    console.error('[Refund] Error processing refund:', error);
    throw new AppError('Failed to process refund', 500);
  }
});
