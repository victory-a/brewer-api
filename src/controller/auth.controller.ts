/* eslint-disable no-case-declarations */
/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { PrismaClient, type User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';

const sendEmailToken = require('../services/emailService');

const config = require('../config/index');

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
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, username } = req.body;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!email) {
    errorResponse(res, 'Email is required', 400);
    return;
  }

  const OTP = generateOTP();
  const expiration = new Date(new Date().getTime() + config.OTP_TOKEN_VALIDITY * 60 * 1000);

  try {
    // delete all existing tokens for user
    await prisma.token.deleteMany({
      where: {
        type: 'OTP',
        user: {
          email
        }
      }
    });

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

    // await sendEmailToken({ email, token: OTP });

    successResponse(res, {}, 'Successful, check email for token');
  } catch (error) {
    console.error('❌', error);
    errorResponse(res, 'Internal Server Error', 500);
  }
});

// validate email and token, return jwt
const authenticate = asyncHandler(async (req: Request, res: Response) => {
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
        errorResponse(res, 'Invalid Token', 401);
        break;

      case userOTP && userOTP.expiration < new Date():
        errorResponse(res, 'Token Expired', 401);
        break;

      case userOTP?.user?.email !== email:
        errorResponse(res, 'UnAuthorized', 401);
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

        // delete all existing tokens for user on success
        await prisma.token.deleteMany({
          where: {
            type: 'OTP',
            userId: userOTP?.userId
          }
        });

        successResponse(res, { token, user: userOTP?.user }, 'Successfully Authenticated');
        break;
    }
  } catch (error) {
    errorResponse(res, 'Internal Server Error', 500);
  }
});

const currentUser = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  try {
    const user = req.user;
    successResponse(res, user, 'Success');
  } catch (error) {
    errorResponse(res, 'Internal Server Error', 500);
  }
});

const updateUser = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  const { username, name, mobile } = req.body;

  const updateData = {
    ...(username && { username }),
    ...(name && { name }),
    ...(mobile && { mobile })
  };

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

    if (!user) {
      errorResponse(res, 'User not found', 404);
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
    errorResponse(res, 'Internal Server Error', 500);
  }
});

module.exports = {
  login,
  authenticate,
  currentUser,
  updateUser
};
