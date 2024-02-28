import { Router } from 'express';

import { createProduct, getProduct, getAllProducts } from '../controller/product.controller';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { createProductValidation, getAProduct } from '../validations/product.validations';

const router = Router();

router.use(protect);
router.post('/create', validate(createProductValidation), createProduct);

router.get('/', getAllProducts);
router.get('/:id', validate(getAProduct), getProduct);

export default router;
