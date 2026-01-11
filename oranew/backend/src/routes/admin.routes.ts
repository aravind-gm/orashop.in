import { Router } from 'express';
import {
    getAllOrders,
    getCustomers,
    getDashboardStats,
    getLowStockProducts,
    updateOrderStatus,
} from '../controllers/admin.controller';
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../controllers/product.controller';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('ADMIN', 'STAFF'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customers
router.get('/customers', getCustomers);

// Inventory
router.get('/inventory/low-stock', getLowStockProducts);

// Products (Admin CRUD)
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', authorize('ADMIN'), deleteProduct);

export default router;
