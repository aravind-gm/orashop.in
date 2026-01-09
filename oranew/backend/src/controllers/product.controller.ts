import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { calculateFinalPrice, slugify } from '../utils/helpers';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = { isActive: true };

    if (category) {
      const categoryData = await prisma.category.findUnique({
        where: { slug: category as string },
      });
      if (categoryData) {
        where.categoryId = categoryData.id;
      }
    }

    if (minPrice || maxPrice) {
      where.finalPrice = {};
      if (minPrice) where.finalPrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.finalPrice.lte = parseFloat(maxPrice as string);
    }

    if (minRating) {
      where.averageRating = { gte: parseFloat(minRating as string) };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { [sortBy as string]: order },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / take),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
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
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
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
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query;

    if (!q) {
      throw new AppError('Search query is required', 400);
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { material: { contains: q as string, mode: 'insensitive' } },
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
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPercent,
      categoryId,
      material,
      careInstructions,
      weight,
      dimensions,
      stockQuantity,
      images,
      metaTitle,
      metaDescription,
    } = req.body;

    const slug = slugify(name);
    const finalPrice = calculateFinalPrice(
      parseFloat(price),
      parseFloat(discountPercent || 0)
    );

    const product = await prisma.product.create({
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
          create: images?.map((img: any, index: number) => ({
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
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    if (updateData.price && updateData.discountPercent !== undefined) {
      updateData.finalPrice = calculateFinalPrice(
        parseFloat(updateData.price),
        parseFloat(updateData.discountPercent)
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true, category: true },
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
