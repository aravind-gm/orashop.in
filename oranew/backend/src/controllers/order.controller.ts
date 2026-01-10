import { Decimal } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler, calculateGST, generateOrderNumber } from '../utils/helpers';
import { lockInventory } from '../utils/inventory';

interface ShippingAddressInput {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CartItemInput {
  productId: string;
  quantity: number;
}

export const checkout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shippingAddressId, billingAddressId, shippingAddress, items } = req.body;

  let finalShippingAddrId = shippingAddressId;
  let finalBillingAddrId = billingAddressId;

  // Support inline address creation (for simpler checkout flow)
  if (shippingAddress && !shippingAddressId) {
    const { street, city, state, zipCode, country } = shippingAddress as ShippingAddressInput;
    
    if (!street || !city || !state || !zipCode) {
      throw new AppError('Shipping address is incomplete', 400);
    }

    // Create new address for user
    const newAddress = await prisma.address.create({
      data: {
        userId: req.user!.id,
        fullName: `${req.user!.firstName} ${req.user!.lastName}`,
        addressLine1: street,
        city,
        state,
        pincode: zipCode,
        country: country || 'India',
        phone: req.user!.phone || '',
        isDefault: false,
      },
    });

    finalShippingAddrId = newAddress.id;
    finalBillingAddrId = newAddress.id; // Use same address for billing
  }

  if (!finalShippingAddrId || !finalBillingAddrId) {
    throw new AppError('Shipping and billing addresses are required', 400);
  }

  // Get cart items - either from request body or from database cart
  let cartItems;
  
  if (items && Array.isArray(items) && items.length > 0) {
    // Use items from request body (client-side cart)
    const itemsInput = items as CartItemInput[];
    const productIds = itemsInput.map(item => item.productId);
    
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    });

    cartItems = itemsInput.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 400);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        product,
      };
    });
  } else {
    // Use server-side cart
    cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Verify addresses belong to user
  const shippingAddr = await prisma.address.findFirst({
    where: {
      id: finalShippingAddrId,
      userId: req.user!.id,
    },
  });

  const billingAddr = await prisma.address.findFirst({
    where: {
      id: finalBillingAddrId,
      userId: req.user!.id,
    },
  });

  if (!shippingAddr || !billingAddr) {
    throw new AppError('Invalid addresses', 400);
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of cartItems) {
    subtotal += Number(item.product.finalPrice) * item.quantity;
  }

  const gstAmount = calculateGST(subtotal);
  const shippingFee = subtotal >= 1000 ? 0 : 50;
  const totalAmount = subtotal + gstAmount + shippingFee;

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: req.user!.id,
      subtotal: new Decimal(subtotal),
      gstAmount: new Decimal(gstAmount),
      shippingFee: new Decimal(shippingFee),
      totalAmount: new Decimal(totalAmount),
      shippingAddressId: finalShippingAddrId,
      billingAddressId: finalBillingAddrId,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images?.[0]?.imageUrl || null,
          quantity: item.quantity,
          unitPrice: item.product.finalPrice,
          gstRate: new Decimal(3),
          discount: new Decimal(0),
          totalPrice: new Decimal(Number(item.product.finalPrice) * item.quantity),
        })),
      },
    },
    include: {
      items: true,
      shippingAddress: true,
    },
  });

  // Lock inventory for this order (holds for 15 minutes)
  const inventoryItems = cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  try {
    await lockInventory(order.id, inventoryItems);
  } catch (error) {
    // If inventory lock fails, delete the order
    await prisma.order.delete({ where: { id: order.id } });
    throw error;
  }

  // DO NOT clear cart yet - wait for payment confirmation webhook

  res.status(201).json({
    success: true,
    order, // Frontend expects response.data.order
    data: order,
    message: 'Order created. Proceed to payment.',
  });
});

export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    include: {
      items: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      shippingAddress: true,
      billingAddress: true,
      payments: true,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ success: true, data: order });
});

export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user!.id,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
    throw new AppError('Cannot cancel order at this stage', 400);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancelReason: reason,
    },
  });

  res.json({ success: true, data: updatedOrder });
});

export const requestReturn = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason, description } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user!.id,
      status: 'DELIVERED',
    },
  });

  if (!order) {
    throw new AppError('Order not found or cannot be returned', 404);
  }

  const returnRequest = await prisma.return.create({
    data: {
      orderId: id,
      userId: req.user!.id,
      reason,
      description,
    },
  });

  await prisma.order.update({
    where: { id },
    data: { status: 'RETURNED' },
  });

  res.status(201).json({ success: true, data: returnRequest });
});
