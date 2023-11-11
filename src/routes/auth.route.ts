import { Router, type Request, type Response, type NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_VALIDITY_IN_MINUTES = 10;

function generateEmailToken(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

// create user if none and send otp to email
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, username } = req.body;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!email) {
      next(new ErrorResponse('Email is required', 400));
      return;
    }

    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_VALIDITY_IN_MINUTES * 60 * 1000);

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
      // send token to email
      return res.status(200).json({
        success: true,
        message: 'Successful, check email for token'
      });
    } catch (error) {
      next(new ErrorResponse('Failed to authticate', 400));
    }
  })
);

// validate email and token, return jwt
router.post(
  '/authenticate',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

      console.log({ dbEmailToken });

      if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
      }
    } catch (error) {
      next(new ErrorResponse('Failed to authticate', 400));
    }
  })
);

export default router;
