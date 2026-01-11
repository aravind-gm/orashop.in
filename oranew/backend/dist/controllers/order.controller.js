"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestReturn = exports.cancelOrder = exports.getOrderById = exports.getOrders = exports.checkout = void 0;
const library_1 = require("@prisma/client/runtime/library");
const database_1 = require("../config/database");
const helpers_1 = require("../utils/helpers");
const inventory_1 = require("../utils/inventory");
exports.checkout = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { shippingAddressId, billingAddressId, shippingAddress, items } = req.body;
    let finalShippingAddrId = shippingAddressId;
    let finalBillingAddrId = billingAddressId;
    // Support inline address creation (for simpler checkout flow)
    if (shippingAddress && !shippingAddressId) {
        const { street, city, state, zipCode, country } = shippingAddress;
        if (!street || !city || !state || !zipCode) {
            throw new helpers_1.AppError('Shipping address is incomplete', 400);
        }
        // Fetch full user info for address
        const fullUser = await database_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        // Create new address for user
        const newAddress = await database_1.prisma.address.create({
            data: {
                userId: req.user.id,
                fullName: fullUser?.fullName || 'Customer',
                addressLine1: street,
                city,
                state,
                pincode: zipCode,
                country: country || 'India',
                phone: fullUser?.phone || '',
                isDefault: false,
            },
        });
        finalShippingAddrId = newAddress.id;
        finalBillingAddrId = newAddress.id; // Use same address for billing
    }
    if (!finalShippingAddrId || !finalBillingAddrId) {
        throw new helpers_1.AppError('Shipping and billing addresses are required', 400);
    }
    // Get cart items - either from request body or from database cart
    let cartItems;
    if (items && Array.isArray(items) && items.length > 0) {
        // Use items from request body (client-side cart)
        const itemsInput = items;
        const productIds = itemsInput.map(item => item.productId);
        const products = await database_1.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { images: true },
        });
        cartItems = itemsInput.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new helpers_1.AppError(`Product ${item.productId} not found`, 400);
            }
            return {
                productId: item.productId,
                quantity: item.quantity,
                product,
            };
        });
    }
    else {
        // Use server-side cart
        cartItems = await database_1.prisma.cartItem.findMany({
            where: { userId: req.user.id },
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
        throw new helpers_1.AppError('Cart is empty', 400);
    }
    // Verify addresses belong to user
    const shippingAddr = await database_1.prisma.address.findFirst({
        where: {
            id: finalShippingAddrId,
            userId: req.user.id,
        },
    });
    const billingAddr = await database_1.prisma.address.findFirst({
        where: {
            id: finalBillingAddrId,
            userId: req.user.id,
        },
    });
    if (!shippingAddr || !billingAddr) {
        throw new helpers_1.AppError('Invalid addresses', 400);
    }
    // Calculate totals
    let subtotal = 0;
    for (const item of cartItems) {
        subtotal += Number(item.product.finalPrice) * item.quantity;
    }
    const gstAmount = (0, helpers_1.calculateGST)(subtotal);
    const shippingFee = subtotal >= 1000 ? 0 : 50;
    const totalAmount = subtotal + gstAmount + shippingFee;
    // Create order
    const order = await database_1.prisma.order.create({
        data: {
            orderNumber: (0, helpers_1.generateOrderNumber)(),
            userId: req.user.id,
            subtotal: new library_1.Decimal(subtotal),
            gstAmount: new library_1.Decimal(gstAmount),
            shippingFee: new library_1.Decimal(shippingFee),
            totalAmount: new library_1.Decimal(totalAmount),
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
                    gstRate: new library_1.Decimal(3),
                    discount: new library_1.Decimal(0),
                    totalPrice: new library_1.Decimal(Number(item.product.finalPrice) * item.quantity),
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
        await (0, inventory_1.lockInventory)(order.id, inventoryItems);
    }
    catch (error) {
        // If inventory lock fails, delete the order
        await database_1.prisma.order.delete({ where: { id: order.id } });
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
exports.getOrders = (0, helpers_1.asyncHandler)(async (req, res) => {
    const orders = await database_1.prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
            items: true,
            payments: true,
        },
        orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: orders });
});
exports.getOrderById = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await database_1.prisma.order.findFirst({
        where: {
            id,
            userId: req.user.id,
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
        throw new helpers_1.AppError('Order not found', 404);
    }
    res.json({ success: true, data: order });
});
exports.cancelOrder = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await database_1.prisma.order.findFirst({
        where: {
            id,
            userId: req.user.id,
        },
    });
    if (!order) {
        throw new helpers_1.AppError('Order not found', 404);
    }
    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
        throw new helpers_1.AppError('Cannot cancel order at this stage', 400);
    }
    const updatedOrder = await database_1.prisma.order.update({
        where: { id },
        data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: reason,
        },
    });
    res.json({ success: true, data: updatedOrder });
});
exports.requestReturn = (0, helpers_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { reason, description } = req.body;
    const order = await database_1.prisma.order.findFirst({
        where: {
            id,
            userId: req.user.id,
            status: 'DELIVERED',
        },
    });
    if (!order) {
        throw new helpers_1.AppError('Order not found or cannot be returned', 404);
    }
    const returnRequest = await database_1.prisma.return.create({
        data: {
            orderId: id,
            userId: req.user.id,
            reason,
            description,
        },
    });
    await database_1.prisma.order.update({
        where: { id },
        data: { status: 'RETURNED' },
    });
    res.status(201).json({ success: true, data: returnRequest });
});
//# sourceMappingURL=order.controller.js.map