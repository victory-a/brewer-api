import { Size } from '@prisma/client';
import Joi from 'joi';

const createOrderValidation = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().positive().required(),
        size: Joi.string()
          .valid(...Object.values(Size))
          .required()
      }).min(1)
    )
  })
};

const updateAnOrderValidation = {
  body: Joi.object().keys({})
};

const getAnOrderValidation = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
};

export { createOrderValidation, updateAnOrderValidation, getAnOrderValidation };
