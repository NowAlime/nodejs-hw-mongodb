import createHttpError from 'http-errors';
import Joi from 'joi'; 

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, `Validation error: ${error.details.map(detail => detail.message).join(', ')}`));
    }
    next();
  };
};

export const resetPwdSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).required(),
});