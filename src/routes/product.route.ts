import { Router } from 'express';

import { createProduct, getProduct, getAllProducts } from '../controller/product.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();

router.post('/create', protect, createProduct);

router.get('/', protect, getAllProducts);

router.get('/:id', protect, getProduct);

export default router;
