import Joi from 'joi';

export const resetPwdSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.base': `"token" should be a type of 'text'`,
    'string.empty': `"token" cannot be an empty field`,
    'any.required': `"token" is a required field`
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`
  })
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required()
});