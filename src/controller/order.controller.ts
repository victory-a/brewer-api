import { type Request, type Response } from 'express';
import { type Order } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const prisma = require('../models/db');

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = req.body as Order;

  try {
    const createdOrder = await prisma.order.create({
      data: order
    });

    successResponse(res, createdOrder, 'Order Created Successfully');
  } catch (error) {
    errorResponse(res, 'Failed to create Order', 400);
  }
});

module.exports = {
  createOrder
};
