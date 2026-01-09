import { Router } from 'express';
import { cancelOrder, checkout, getOrderById, getOrders, requestReturn } from '../controllers/order.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/checkout', checkout);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.post('/:id/return', requestReturn);

export default router;
