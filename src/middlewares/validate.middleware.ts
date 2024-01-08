import { type Request, type Response, type NextFunction } from 'express';
import pick from '../utils/pick';
import Joi from 'joi';
import httpStatus from 'http-status';

import { errorResponse } from '../utils/apiResponder';

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    errorResponse(res, errorMessage, httpStatus.BAD_REQUEST);
  }
  Object.assign(req, value);
  next();
};

export default validate;
