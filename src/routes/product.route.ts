import { Router } from 'express';

import { createProduct, getProduct, getAllProducts } from '../controller/product.controller';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createProductValidation,
  getAProductValidation,
  getAllProductsValidation
} from '../validations/product.validations';

const router = Router();

router.use(protect);
router.post('/create', validate(createProductValidation), createProduct);

router.get('/', validate(getAllProductsValidation), getAllProducts);
router.get('/:id', validate(getAProductValidation), getProduct);

export default router;
