"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.searchProducts = exports.getFeaturedProducts = exports.getProductBySlug = exports.getProducts = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const { category, minPrice, maxPrice, minRating, sortBy = 'createdAt', order = 'desc', page = '1', limit = '12', } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = { isActive: true };
        if (category) {
            const categoryData = await database_1.prisma.category.findUnique({
                where: { slug: category },
            });
            if (categoryData) {
                where.categoryId = categoryData.id;
            }
        }
        if (minPrice || maxPrice) {
            where.finalPrice = {};
            if (minPrice)
                where.finalPrice.gte = parseFloat(minPrice);
            if (maxPrice)
                where.finalPrice.lte = parseFloat(maxPrice);
        }
        if (minRating) {
            where.averageRating = { gte: parseFloat(minRating) };
        }
        const [products, total] = await Promise.all([
            database_1.prisma.product.findMany({
                where,
                include: {
                    category: { select: { name: true, slug: true } },
                    images: { where: { isPrimary: true }, take: 1 },
                },
                orderBy: { [sortBy]: order },
                skip,
                take,
            }),
            database_1.prisma.product.count({ where }),
        ]);
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / take),
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await database_1.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                images: { orderBy: { sortOrder: 'asc' } },
                reviews: {
                    where: { isApproved: true },
                    include: { user: { select: { fullName: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!product) {
            throw new errorHandler_1.AppError('Product not found', 404);
        }
        res.json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductBySlug = getProductBySlug;
// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await database_1.prisma.product.findMany({
            where: { isFeatured: true, isActive: true },
            include: {
                category: { select: { name: true, slug: true } },
                images: { where: { isPrimary: true }, take: 1 },
            },
            take: 8,
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            throw new errorHandler_1.AppError('Search query is required', 400);
        }
        const products = await database_1.prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { material: { contains: q, mode: 'insensitive' } },
                ],
            },
            include: {
                category: { select: { name: true, slug: true } },
                images: { where: { isPrimary: true }, take: 1 },
            },
            take: 20,
        });
        res.json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.searchProducts = searchProducts;
// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const { name, description, shortDescription, price, discountPercent, categoryId, material, careInstructions, weight, dimensions, stockQuantity, images, metaTitle, metaDescription, } = req.body;
        const slug = (0, helpers_1.slugify)(name);
        const finalPrice = (0, helpers_1.calculateFinalPrice)(parseFloat(price), parseFloat(discountPercent || 0));
        const product = await database_1.prisma.product.create({
            data: {
                name,
                slug,
                description,
                shortDescription,
                price: parseFloat(price),
                discountPercent: parseFloat(discountPercent || 0),
                finalPrice,
                sku: `ORA-${Date.now()}`,
                categoryId,
                material,
                careInstructions,
                weight,
                dimensions,
                stockQuantity: parseInt(stockQuantity),
                metaTitle,
                metaDescription,
                images: {
                    create: images?.map((img, index) => ({
                        imageUrl: img.url,
                        altText: img.alt || name,
                        sortOrder: index,
                        isPrimary: index === 0,
                    })),
                },
            },
            include: { images: true, category: true },
        });
        res.status(201).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (updateData.name) {
            updateData.slug = (0, helpers_1.slugify)(updateData.name);
        }
        if (updateData.price && updateData.discountPercent !== undefined) {
            updateData.finalPrice = (0, helpers_1.calculateFinalPrice)(parseFloat(updateData.price), parseFloat(updateData.discountPercent));
        }
        const product = await database_1.prisma.product.update({
            where: { id },
            data: updateData,
            include: { images: true, category: true },
        });
        res.json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        await database_1.prisma.product.delete({ where: { id } });
        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map