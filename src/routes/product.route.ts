import { Router } from 'express';
const router = Router();

const { createProduct, getProduct, getAllProducts } = require('../controller/product.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/create', protect, createProduct);

router.get('/', protect, getAllProducts);

router.get('/:id', protect, getProduct);

module.exports = router;
