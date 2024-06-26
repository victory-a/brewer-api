import { OrderStatus, Size } from '@prisma/client';
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
  params: Joi.object().keys({
    id: Joi.string().required()
  }),
  body: Joi.object().keys({
    order_status: Joi.string().valid(...Object.values(OrderStatus))
  })
};

const getAnOrderValidation = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
};

const getAllOrdersValidation = {
  query: Joi.object().keys({
    order_status: Joi.string().valid(...Object.values(OrderStatus))
  })
};

export {
  createOrderValidation,
  updateAnOrderValidation,
  getAnOrderValidation,
  getAllOrdersValidation
};
