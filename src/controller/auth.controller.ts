import { type Request, type Response, type NextFunction } from 'express';
import { PrismaClient, type User } from '@prisma/client';
import jwt from 'jsonwebtoken';
const sendEmailToken = require('../services/emailService');

const config = require('../config/index');

const asyncHandler = require('../utils/asyncHandler');
const { successResponse, ErrorResponse } = require('../utils/apiResponder');

const prisma = new PrismaClient();

function generateEmailToken() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateAuthToken(tokenId: number) {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, config.JWT_SECRET, {
    noTimestamp: true
  });
}

// create user if none and send otp to email
const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, username } = req.body;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!email) {
    next(new ErrorResponse('Email is required', 400));
    return;
  }

  const emailToken = generateEmailToken();
  const expiration = new Date(new Date().getTime() + config.EMAIL_TOKEN_VALIDITY * 60 * 1000);

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: 'EMAIL',
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              username: username ?? null
            }
          }
        }
      }
    });

    console.log({ createdToken });

    // await sendEmailToken({ email, token: emailToken });

    successResponse(res, null, 'Successful, check email for token');
  } catch (error) {
    console.error('❌', error);
    next(new ErrorResponse('Failed to authticate', 400));
  }
});

// validate email and token, return jwt
const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, emailToken } = req.body;

  try {
    const dbEmailToken = await prisma.token.findUnique({
      where: {
        emailToken
      },
      include: {
        user: true
      }
    });

    if (!dbEmailToken || !dbEmailToken.valid) {
      next(new ErrorResponse('UnAuthorized', 401));
    }

    if (dbEmailToken && dbEmailToken.expiration < new Date()) {
      next(new ErrorResponse('Token Expired', 401));
    }

    if (dbEmailToken?.user?.email !== email) {
      next(new ErrorResponse('UnAuthorized', 401));
    }

    // generate API token
    const expiration = new Date(new Date().getTime() + config.AUTH_TOKEN_VALIDITY * 60 * 60 * 1000);

    const apiToken = await prisma.token.create({
      data: {
        type: 'API',
        expiration,
        user: {
          connect: { email }
        }
      }
    });

    // delete email token after user has been authenticated
    await prisma.token.delete({
      where: { id: dbEmailToken?.id }
    });

    // generate JWT token
    const authToken = generateAuthToken(apiToken.id);
    successResponse(res, { authToken }, 'Successfully Authenticated');
  } catch (error) {
    next(new ErrorResponse('Failed to authticate', 400));
  }
});

const currentUser = asyncHandler(
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      successResponse(res, user, 'Successfully Authenticated');
    } catch (error) {
      next(new ErrorResponse('Internal Server Error', 500));
    }
  }
);

const deleteUser = asyncHandler(
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {}
);

module.exports = {
  login,
  authenticate,
  currentUser
};
