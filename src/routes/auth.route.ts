import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import { loginValidation } from '../validations/auth.validation';
const router = Router();

const { login, authenticate, currentUser, updateUser } = require('../controller/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/login', validate(loginValidation), login);
router.post('/authenticate', authenticate);

router.get('/current-user', protect, currentUser);
router.post('/update-user', protect, updateUser);

module.exports = router;
