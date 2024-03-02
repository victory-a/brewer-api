import { type Request, type Response } from 'express';
import { type Product, type Size, type OrderStatus, User } from '@prisma/client';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const getCartItems = asyncHandler(async (req: Request, res: Response) => {});
const addToCart = asyncHandler(async (req: Request, res: Response) => {});
const updateCart = asyncHandler(async (req: Request, res: Response) => {});
const clearCart = asyncHandler(async (req: Request, res: Response) => {});

export { getCartItems, addToCart, updateCart, clearCart };
