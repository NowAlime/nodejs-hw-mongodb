import Joi from 'joi';

export const emailSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    'string.email': 'Будь ласка, введіть дійсну електронну адресу.',
    'any.required': 'Електронна адреса є обов’язковою.',
  }),
});

export const resetPwdSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});