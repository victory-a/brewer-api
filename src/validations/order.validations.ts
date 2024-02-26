import Joi from 'joi';

const createOrderValidation = {
  body: Joi.object().keys({})
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
