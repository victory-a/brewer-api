import { Router } from 'express';
const router = Router();

const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus
} = require('../controller/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create', protect, createOrder);

router.get('/', protect, getAllOrders);

router.get('/:id', protect, getOrder);

router.put('/status/:id', protect, updateOrderStatus);

module.exports = router;
