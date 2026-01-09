import { Router } from 'express';
import { createPayment, verifyPayment, webhook } from '../controllers/payment.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhook);

export default router;
