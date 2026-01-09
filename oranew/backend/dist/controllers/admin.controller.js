"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowStockProducts = exports.getCustomers = exports.updateOrderStatus = exports.getAllOrders = exports.getDashboardStats = void 0;
const database_1 = require("../config/database");
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalOrders, totalRevenue, totalCustomers, pendingOrders,] = await Promise.all([
            database_1.prisma.order.count(),
            database_1.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'DELIVERED' },
            }),
            database_1.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            database_1.prisma.order.count({ where: { status: 'PENDING' } }),
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllOrders = async (req, res, next) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;
        const where = status ? { status: status } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [orders, total] = await Promise.all([
            database_1.prisma.order.findMany({
                where,
                include: {
                    user: { select: { fullName: true, email: true } },
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            database_1.prisma.order.count({ where }),
        ]);
        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, trackingNumber } = req.body;
        const order = await database_1.prisma.order.update({
            where: { id },
            data: {
                status,
                ...(trackingNumber && { trackingNumber }),
                ...(status === 'SHIPPED' && { shippedAt: new Date() }),
                ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
            },
        });
        res.json({ success: true, data: order });
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getCustomers = async (req, res, next) => {
    try {
        const customers = await database_1.prisma.user.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomers = getCustomers;
const getLowStockProducts = async (req, res, next) => {
    try {
        const products = await database_1.prisma.product.findMany({
            where: {
                isActive: true,
                stockQuantity: {
                    lte: database_1.prisma.product.fields.lowStockThreshold,
                },
            },
            orderBy: { stockQuantity: 'asc' },
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
};
exports.getLowStockProducts = getLowStockProducts;
//# sourceMappingURL=admin.controller.js.map