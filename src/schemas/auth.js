import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

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
