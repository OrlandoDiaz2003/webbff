import { Router } from 'express';
import { getPaymentById, createPayment } from '../controllers/payments.controller';

const router = Router();

// GET /payments/{id}
router.get('/:id', getPaymentById);

// POST /payments
router.post('/', createPayment);

export default router;
