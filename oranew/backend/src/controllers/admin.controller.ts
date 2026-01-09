import { NextFunction, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'DELIVERED' },
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalCustomers,
        pendingOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const where = status ? { status: status as any } : {};
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { fullName: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
      },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: prisma.product.fields.lowStockThreshold,
        },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
