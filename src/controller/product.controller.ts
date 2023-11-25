import { type Request, type Response } from 'express';
import { PrismaClient, type Product } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  // const {} = req.body
});

const bulkCreateProducts = asyncHandler(async (req: Request, res: Response) => {
  // const {} = req.body
});

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  // const {} = req.body
});

const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
  // const {} = req.body
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  // const {} = req.body
});
