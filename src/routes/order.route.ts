import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';

import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus
} from '../controller/order.controller';
const router = Router();

router.post('/create', protect, createOrder);

router.get('/', protect, getAllOrders);

router.get('/:id', protect, getOrder);

router.put('/status/:id', protect, updateOrderStatus);

export default router;
