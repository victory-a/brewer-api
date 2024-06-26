import { type Request, type Response } from 'express';
import { type Product } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

import prisma from '../models/db';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = req.body as Product;

  const createdProduct = await prisma.product.create({
    data: product
  });

  successResponse(res, createdProduct, 'Product Created Successfully');
});

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!product) {
    errorResponse(res, 'Product not found', 404);
  } else {
    successResponse(res, product, 'Product fetched Successfully');
  }
});

interface IRequest extends Request {
  query: { product_name?: string };
}

const getAllProducts = asyncHandler(async (req: IRequest, res: Response) => {
  let products;
  if (req.query.product_name) {
    products = await prisma.product.findMany({
      where: {
        name: {
          contains: req.query.product_name
        }
      },
      select: { id: true, name: true, variant: true, image: true, basePrice: true }
    });
  } else {
    products = await prisma.product.findMany({
      select: { id: true, name: true, variant: true, image: true, basePrice: true }
    });
  }

  successResponse(res, { products, count: products.length }, 'Products fetched Successfully');
});

export { createProduct, getProduct, getAllProducts };
