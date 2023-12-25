import { Router } from 'express';
const router = Router();

const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder
} = require('../controller/order.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create', protect, createOrder);

router.get('/', protect, getAllOrders);

router.get('/:id', protect, getOrder);

router.put('/:id', protect, updateOrder);

module.exports = router;
