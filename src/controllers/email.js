import createHttpError from 'http-errors';
import { requestResetToken } from '../services/auth.js';

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestResetToken(email);
    res.status(200).json({ message: 'Reset email sent' });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword({ token, password });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};