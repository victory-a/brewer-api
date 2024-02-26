import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createOrderValidation,
  getAnOrderValidation,
  updateAnOrderValidation
} from '../validations/order.validations';

import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus
} from '../controller/order.controller';

const router = Router();

router.use(protect);
router.get('/', getAllOrders);
router.get('/:id', validate(getAnOrderValidation), getOrder);

router.post('/create', validate(createOrderValidation), createOrder);

router.patch('/status/:id', validate(updateAnOrderValidation), updateOrderStatus);

export default router;
