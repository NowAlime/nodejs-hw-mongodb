import Joi from 'joi';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createHttpError(400, error.message));
      return;
    }
    next();
  };
};


export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ status: 400, message: 'Invalid contact ID' });
  }
  next();
};