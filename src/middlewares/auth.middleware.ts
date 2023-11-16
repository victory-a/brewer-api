import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, type User } from '@prisma/client';

const config = require('../config/index');

const asyncHandler = require('../utils/asyncHandler');
const { ErrorResponse } = require('../utils/apiResponder');

const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

// type AuthRequest = Request & {user?: User}
exports.protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const jwtToken = authHeader?.split(' ')[1];

  if (!jwtToken) {
    next(new ErrorResponse('UnAuthorized', 401));
    return;
  }

  try {
    const payload = jwt.verify(jwtToken, config.JWT_SECRET) as { tokenId: number };

    const dbToken = await prisma.token.findUnique({
      where: { id: payload.tokenId },
      include: { user: true }
    });

    if (!dbToken?.valid || dbToken.expiration < new Date()) {
      next(new ErrorResponse('Token Invalid', 401));
    }

    req.user = dbToken?.user;
  } catch (error) {
    next(new ErrorResponse('Failed to authticate', 400));
  }
  next();
});
