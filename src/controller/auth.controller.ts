/* eslint-disable no-case-declarations */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
import { type Request, type Response, type NextFunction } from 'express';
import { PrismaClient, type User } from '@prisma/client';
import jwt from 'jsonwebtoken';
const sendEmailToken = require('../services/emailService');

const config = require('../config/index');

const asyncHandler = require('../utils/asyncHandler');
const { successResponse, ErrorResponse } = require('../utils/apiResponder');

const prisma = new PrismaClient();

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateJWT(tokenId: number) {
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

  const OTP = generateOTP();
  const expiration = new Date(new Date().getTime() + config.OTP_TOKEN_VALIDITY * 60 * 1000);

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: 'OTP',
        OTP,
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
  const { email, otp } = req.body;

  try {
    const userOTP = await prisma.token.findUnique({
      where: {
        OTP: otp
      },
      include: {
        user: true
      }
    });

    switch (true) {
      case !userOTP || !userOTP.valid:
        next(new ErrorResponse('UnAuthorized', 401));
        break;

      case userOTP && userOTP.expiration < new Date():
        next(new ErrorResponse('Token Expired', 401));
        break;

      case userOTP?.user?.email !== email:
        next(new ErrorResponse('UnAuthorized', 401));
        break;

      default:
        const expiration = new Date(
          new Date().getTime() + config.JWT_TOKEN_VALIDITY * 60 * 60 * 1000
        );

        const apiToken = await prisma.token.create({
          data: {
            type: 'JWT',
            expiration,
            user: {
              connect: { email }
            }
          }
        });

        const token = generateJWT(apiToken.id);
        successResponse(res, { token }, 'Successfully Authenticated');

        break;
    }

    await prisma.token.deleteMany({
      where: {
        type: 'OTP',
        userId: userOTP?.userId
      }
    });
  } catch (error) {
    next(new ErrorResponse('Failed to authticate', 400));
  }
});

const currentUser = asyncHandler(
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      successResponse(res, user, 'Success');
    } catch (error) {
      next(new ErrorResponse('Internal Server Error', 500));
    }
  }
);

const updateUser = asyncHandler(
  async (req: Request & { user?: User }, res: Response, next: NextFunction) => {
    const { username, name, mobile } = req.body;

    const updateData = {
      ...(username && { username }),
      ...(name && { name }),
      ...(mobile && { mobile })
    };

    try {
      const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

      if (!user) {
        next(new ErrorResponse('User not found', 404));
      } else {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...updateData
          }
        });
        successResponse(res, updatedUser, 'Updated User Successfully');
      }
    } catch (error) {
      next(new ErrorResponse('Failed to update user', 400));
    }
  }
);

module.exports = {
  login,
  authenticate,
  currentUser,
  updateUser
};
