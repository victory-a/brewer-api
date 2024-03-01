import { type Request, type Response } from 'express';
import { type Product, type Size, type OrderStatus } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

import prisma from '../models/db';
import { type ICreateOrder } from '../models/order.model';

const calculateProductPrice = (productInfo: Product, size: Size): number => {
  let totalPrice = 0;
  const sizePrice = productInfo[size];
  if (sizePrice) {
    totalPrice = Number(sizePrice) + Number(productInfo.basePrice);
  } else {
    totalPrice = Number(productInfo.basePrice);
  }

  return totalPrice;
};

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const payload = req.body as ICreateOrder;
    const { products: productsFromReqBody, address } = payload;

    // Fetch product information with prices from the database
    const productDetailsFromDB = (await prisma.product.findMany({
      where: { id: { in: productsFromReqBody.map((productData) => productData.productId) } },
      select: {
        id: true,
        basePrice: true,
        small: true,
        medium: true,
        large: true
      }
    })) as Product[];

    // Validate existence of products
    const productIds = productsFromReqBody.map((productData) => productData.productId);
    const existingProductIds = productDetailsFromDB.map((product) => product.id);
    const missingProductIds = productIds.filter(
      (productId) => !existingProductIds.includes(productId)
    );

    if (missingProductIds.length > 0) {
      errorResponse(res, `Products with ID(s) ${missingProductIds.join(', ')} not found`, 400);
    }

    // Create order
    const newOrder = await prisma.order.create({
      data: {
        address,
        totalPrice: 0,
        status: 'pending',
        products: {
          create: productsFromReqBody.map((productData) => {
            return {
              product: { connect: { id: productData.productId } },
              quantity: productData.quantity,
              size: productData.size
            };
          })
        }
      },
      include: {
        products: true
      }
    });

    // Calculate total price
    const totalPrice = productsFromReqBody.reduce((acc, productData) => {
      const productInfo = productDetailsFromDB.find(
        (product) => product.id === productData.productId
      );
      const productPrice = calculateProductPrice(productInfo!, productData.size);
      return (acc += productPrice * productData.quantity);
    }, 0);

    // Update order total price
    const createdOrder = await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        totalPrice
      }
    });
    successResponse(res, createdOrder, 'Order created Successfully');
  } catch (error) {
    console.error(error);
    errorResponse(res, 'Failed to create Order', 400);
  }
});

const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const order = await prisma.order.findUnique({
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
    errorResponse(res, 'Failed to get Order', 400);
  }
});

const getAllOrders = asyncHandler(
  async (req: Request & { query?: { order_status?: OrderStatus } }, res: Response) => {
    try {
      let orders;

      if (req.query?.order_status) {
        orders = await prisma.order.findMany({
          where: {
            status: req.query.order_status
          },
          select: { id: true, createdAt: true, status: true, totalPrice: true }
        });
      } else {
        orders = await prisma.order.findMany({
          select: { id: true, createdAt: true, status: true, totalPrice: true }
        });
      }

      successResponse(res, { orders, count: orders.length }, 'Orders fetched Successfully');
    } catch (error) {
      errorResponse(res, 'Failed to Orders', 400);
    }
  }
);

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {});

export { createOrder, getAllOrders, getOrder, updateOrderStatus };
