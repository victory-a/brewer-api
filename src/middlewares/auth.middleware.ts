import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { type User } from '@prisma/client';

import asyncHandler from '../utils/asyncHandler';
import prisma from '../models/db';

import config from '../config/index';
import { errorResponse } from '../utils/apiResponder';

type AuthRequest = Request & { user?: User };

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const jwtToken = authHeader?.split(' ')[1];

  if (!jwtToken) {
    errorResponse(res, 'Unauthorized', 401);
    return;
  }

  try {
    const payload = jwt.verify(jwtToken, config.JWT_SECRET) as unknown as { tokenId: number };

    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true }
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      errorResponse(res, 'UnAuthorized', 401);
      return;
    }

    req.user = dbToken?.user;
    next();
  } catch (error) {
    errorResponse(res, 'UnAuthorized', 401);
  }
});
