import { type Response } from 'express';
import httpStatus from 'http-status';

const ApiResponder = (
  res: Response,
  statusCode: number,
  message: string,
  payload: any,
  extra = {}
) => {
  res.status(statusCode).send({
    status: statusCode,
    success: statusCode === httpStatus.OK || statusCode === httpStatus.CREATED,
    message,
    data: payload,
    ...extra
  });
};

const successResponse = (res: Response, payload: any = null, message = 'Success') => {
  ApiResponder(res, httpStatus.OK, message, payload);
};

const errorResponse = (
  res: Response,
  message = '',
  statusCode: number = httpStatus.INTERNAL_SERVER_ERROR
) => {
  const httpMessage = message ?? httpStatus[statusCode];

  ApiResponder(res, statusCode, httpMessage, null);
};

class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ApiResponder, successResponse, errorResponse, ErrorResponse };
