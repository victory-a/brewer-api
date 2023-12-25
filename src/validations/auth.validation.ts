import Joi from 'joi';

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required()
  })
};

const authenticateValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otp: Joi.string()
      .length(4)
      .pattern(/^[0-9]+$/)
      .required()
  })
};

const internationalPhoneNumberRegex =
  /^[+]?([0-9]{1,4})?[\s.-]?([0-9]{3})[\s.-]?([0-9]{3})[\s.-]?([0-9]{4})$/;

const updateUserValidation = {
  body: Joi.object().keys({
    username: Joi.string().max(20),
    name: Joi.string().max(20),
    mobile: Joi.string().pattern(internationalPhoneNumberRegex)
  })
};

export { loginValidation, authenticateValidation, updateUserValidation };
