import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import {
  authenticateValidation,
  loginValidation,
  updateUserValidation
} from '../validations/auth.validation';

import { login, authenticate, currentUser, updateUser } from '../controller/auth.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();

router.post('/login', validate(loginValidation), login);
router.post('/authenticate', validate(authenticateValidation), authenticate);

router.get('/current-user', protect, currentUser);
router.post('/update-user', validate(updateUserValidation), protect, updateUser);

export default router;
