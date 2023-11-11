import { Router } from 'express';
const router = Router();

const { login, authenticate } = require('../controller/auth.controller');

router.post('/login', login);

router.post('/authenticate', authenticate);

module.exports = router;
