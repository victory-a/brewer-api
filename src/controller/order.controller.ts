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

const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // const product = await prisma.ordeer.findUnique({
    //   where: {
    //     id: Number(id)
    //   }
    // });
    // if (!product) {
    //   errorResponse(res, 'Product not found', 404);
    // } else {
    //   successResponse(res, product, 'Product fetched Successfully');
    // }
  } catch (error) {
    errorResponse(res, 'Failed to get product', 400);
  }
});

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {});

const updateOrder = asyncHandler(async (req: Request, res: Response) => {});

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder
};
