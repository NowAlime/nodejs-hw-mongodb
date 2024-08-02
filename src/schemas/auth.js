import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const logoutSchema = Joi.object({
  sessionId: Joi.string().required()
});