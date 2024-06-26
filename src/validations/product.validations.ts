import Joi from 'joi';

const createProductValidation = {
  body: Joi.object().keys({
    name: Joi.string().max(20).required(),
    description: Joi.string().max(255).required(),
    variant: Joi.string().max(20).required(),
    image: Joi.string().uri().required(),
    sizes: Joi.array().items(Joi.string().valid('small', 'medium', 'large')),
    basePrice: Joi.number().min(0).required(),
    small: Joi.number().min(0),
    medium: Joi.number().min(0),
    large: Joi.number().min(0),
    rating: Joi.number().precision(1).min(1).max(5).required()
  })
};

const getAProductValidation = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
};

const getAllProductsValidation = {
  query: Joi.object().keys({
    product_name: Joi.string()
  })
};

export { createProductValidation, getAProductValidation, getAllProductsValidation };
