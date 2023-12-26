import { Router } from 'express';

import { createProduct, getProduct, getAllProducts } from '../controller/product.controller';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { createProductValidation, getAProduct } from '../validations/product.validations';
const router = Router();

router.post('/create', protect, validate(createProductValidation), createProduct);

router.get('/', protect, getAllProducts);
router.get('/:id', protect, validate(getAProduct), getProduct);

export default router;
