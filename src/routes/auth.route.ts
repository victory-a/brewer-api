import { Router } from 'express';
const router = Router();

const { login, authenticate, currentUser } = require('../controller/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/login', login);
router.post('/authenticate', authenticate);

router.get('/current-user', protect, currentUser);

module.exports = router;
