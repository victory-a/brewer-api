/* eslint-disable no-case-declarations */
/* eslint-disable indent */
import { type Request, type Response } from 'express';
import { type User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/apiResponder';
import asyncHandler from '../utils/asyncHandler';
import prisma from '../models/db';

import sendEmailToken from '../services/emailService';

import config from '../config/index';

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
  const { email } = req.body;

  const OTP = generateOTP();
  const expiration = new Date(new Date().getTime() + config.OTP_TOKEN_VALIDITY * 60 * 1000);

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
            email
          }
        }
      }
    }
  });

  console.log({ createdToken });

  // await sendEmailToken({ email, token: OTP });

  successResponse(res, null, 'Successful, check email for token');
});

// validate email and token, return jwt
const authenticate = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const userOTP = await prisma.token.findUnique({
    where: {
      OTP: otp
    },
    include: {
      user: true
    }
  });

  switch (true) {
    case !userOTP?.valid:
      errorResponse(res, 'Invalid Token', 401);
      break;

    case userOTP && userOTP.expiration < new Date():
      errorResponse(res, 'Token Expired', 401);
      break;

    case userOTP?.user?.email !== email:
      errorResponse(res, 'UnAuthorized', 401);
      break;

    default:
      // delete all existing tokens for user on success
      await prisma.token.deleteMany({
        where: {
          userId: userOTP?.userId
        }
      });

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

      successResponse(res, { token, user: userOTP?.user }, 'Successfully Authenticated');
      break;
  }
});

const currentUser = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  const user = req.user;
  successResponse(res, user, 'Success');
});

const updateUser = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
  if (!user) {
    errorResponse(res, 'User not found', 404);
  } else {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: req.body
    });
    successResponse(res, updatedUser, 'Updated User Successfully');
  }
});

const logout = asyncHandler(async (req: Request & { user?: User }, res: Response) => {
  await prisma.token.updateMany({
    where: { userId: req.user?.id },
    data: { valid: false, expiration: new Date() }
  });

  successResponse(res, null, 'Logged out Successfully');
});

export { login, authenticate, currentUser, updateUser, logout };
