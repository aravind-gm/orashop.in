import { Router } from 'express';
import {
    getAllOrders,
    getCustomers,
    getDashboardStats,
    getLowStockProducts,
    updateOrderStatus,
} from '../controllers/admin.controller';
import { authorize, protect } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('ADMIN', 'STAFF'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/customers', getCustomers);
router.get('/inventory/low-stock', getLowStockProducts);

export default router;
