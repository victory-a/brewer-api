import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import {
  authenticateValidation,
  loginValidation,
  updateUserValidation
} from '../validations/auth.validation';

import {
  login,
  authenticate,
  currentUser,
  updateUser,
  logout
} from '../controller/auth.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();

router.post('/login', validate(loginValidation), login);
router.post('/authenticate', validate(authenticateValidation), authenticate);

router.post('/update-user', protect, validate(updateUserValidation), updateUser);

router.get('/current-user', protect, currentUser);

router.post('/logout', protect, logout);

export default router;
