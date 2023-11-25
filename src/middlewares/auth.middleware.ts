import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, type User } from '@prisma/client';

import asyncHandler from '../utils/asyncHandler';

const config = require('../config/index');
const { errorResponse } = require('../utils/apiResponder');

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

exports.protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const jwtToken = authHeader?.split(' ')[1];

  if (!jwtToken) {
    return errorResponse(res, 'Internal Server Error', 500);
  }

  try {
    const payload = jwt.verify(jwtToken, config.JWT_SECRET) as { tokenId: number };

    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true }
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      return errorResponse(res, 'UnAuthorized', 401);
    }

    req.user = dbToken?.user;
    next();
  } catch (error) {
    return errorResponse(res, 'UnAuthorized', 401);
  }
});
