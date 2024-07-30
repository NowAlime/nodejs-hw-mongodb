import createHttpError from 'http-errors';
import { register } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await register(userData);

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


