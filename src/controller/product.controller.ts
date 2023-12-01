import { type Request, type Response } from 'express';
import { PrismaClient, type Product } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const prisma = new PrismaClient();

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = req.body as Product;

  try {
    const createdProduct = await prisma.product.create({
      data: product
    });

    successResponse(res, createdProduct, 'Product Created Successfully');
  } catch (error) {
    errorResponse(res, 'Failed to create Product', 400);
  }
});

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
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
  } catch (error) {
    errorResponse(res, 'Failed to get product', 400);
  }
});

const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    successResponse(res, products, 'Products fetched Successfully');
  } catch (error) {
    errorResponse(res, 'Failed to products', 400);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts
};
