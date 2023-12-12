import { type Request, type Response } from 'express';
import { PrismaClient, type Product } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const prisma = require('../models/db');

// const createOrder()
