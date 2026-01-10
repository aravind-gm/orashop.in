import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { rawBodyMiddleware } from './middleware/rawBody';

// Routes
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/review.routes';
import userRoutes from './routes/user.routes';
import wishlistRoutes from './routes/wishlist.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - MUST be first before any other middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', cors());

// Raw body middleware for Razorpay webhook (MUST be before express.json())
app.use(rawBodyMiddleware);

// Raw body parser for Razorpay webhook
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ORA Jewellery API',
    tagline: 'own. radiate. adorn.',
    version: '1.0.0',
  });
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   ORA Jewellery API Server Running    ║
  ║   own. radiate. adorn.                ║
  ╠════════════════════════════════════════╣
  ║   Port: ${PORT.toString().padEnd(30)}║
  ║   Env:  ${(process.env.NODE_ENV || 'development').padEnd(30)}║
  ╚════════════════════════════════════════╝
  `);
});

export default app;
