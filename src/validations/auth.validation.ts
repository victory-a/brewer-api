import Joi from 'joi';

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required()
  })
};

export { loginValidation };
