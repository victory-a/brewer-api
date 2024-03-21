import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createOrderValidation,
  getAllOrdersValidation,
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
router.get('/', validate(getAllOrdersValidation), getAllOrders);
router.get('/:id', validate(getAnOrderValidation), getOrder);

router.post('/create', validate(createOrderValidation), createOrder);

router.patch('/:id', validate(updateAnOrderValidation), updateOrderStatus);

export default router;
