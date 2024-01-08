import Joi from 'joi';

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

const authenticateValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
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
    mobile: Joi.string().pattern(internationalPhoneNumberRegex).allow(null, '').messages({
      'string.pattern.base': 'Please enter a valid international phone number format'
    })
  })
};

export { loginValidation, authenticateValidation, updateUserValidation };
