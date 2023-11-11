import { type Request, type Response } from 'express';

// @ts-expect-error no reason :)
const asyncHandler = (fn) => (req: Request, res: Response, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = asyncHandler;
