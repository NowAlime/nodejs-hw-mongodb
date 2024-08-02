import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, `Validation error: ${error.details.map(detail => detail.message).join(', ')}`));
    }
    next();
  };
};
