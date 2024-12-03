import { type NextFunction, type Request, type Response } from 'express';
import { type Product, type Size, type OrderStatus, type User } from '@prisma/client';

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

const createOrder = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
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
      large: true,
      image: true
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
      userId: req.user?.id,
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
    where: { id: newOrder.id, userId: req.user?.id },
    data: {
      totalPrice
    }
  });
  successResponse(res, createdOrder, 'Order created Successfully');
});

const getOrder = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  const id = req.params.id;
  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
      userId: req.user?.id
    },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });
  if (!order) {
    errorResponse(res, 'Order not found', 404);
  } else {
    const orderWithProducts = {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      address: order.address,
      totalPrice: order.totalPrice,
      status: order.status,
      products: order.products.map((op: any) => {
        return {
          name: op.product.name,
          productId: op.productId,
          size: op.size,
          quantity: op.quantity,
          image: op.product.image,
          basePrice: op.product.basePrice,
          selectedSizePrice: op.product[op.size],
          variant: op.product.variant
        };
      })
    };
    successResponse(res, orderWithProducts, 'Order fetched Successfully');
  }
});

interface IRequest extends Request {
  query: { order_status?: OrderStatus };
  user?: User;
}

const getAllOrders = asyncHandler(async (req: IRequest, res: Response) => {
  let orders;

  if (req.query?.order_status) {
    orders = await prisma.order.findMany({
      where: {
        userId: req.user?.id,
        status: req.query.order_status
      },
      select: { id: true, createdAt: true, status: true, totalPrice: true },
      orderBy: { createdAt: 'desc' }
    });
  } else {
    orders = await prisma.order.findMany({
      select: { id: true, createdAt: true, status: true, totalPrice: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  successResponse(res, { orders, count: orders.length }, 'Orders fetched Successfully');
});

const updateOrderStatus = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  const order = await prisma.order.update({
    where: { id: Number(req.params.id), userId: req.user?.id },
    data: { status: req.body.order_status }
  });

  successResponse(res, order, 'Order updated Successfully');
});

export { createOrder, getAllOrders, getOrder, updateOrderStatus };
