import { type Request, type Response } from 'express';
import { type Order } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

import prisma from '../models/db';

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
    const order = await prisma.ordeer.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!order) {
      errorResponse(res, 'Order not found', 404);
    } else {
      successResponse(res, order, 'Order fetched Successfully');
    }
  } catch (error) {
    errorResponse(res, 'Failed to get product', 400);
  }
});

const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  try {
    const orders = await prisma.product.findMany();

    successResponse(res, orders, 'Orders fetched Successfully');
  } catch (error) {
    errorResponse(res, 'Failed to Orders', 400);
  }
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {});

export { createOrder, getAllOrders, getOrder, updateOrderStatus };
