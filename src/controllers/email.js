import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import env from '../utils/env.js';

export const sendResetEmailController =  async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    createHttpError(500, 'Failed to send the email, please try again later.');
    next(err);
  }
};

export const resetPasswordController =  async (req, res) => {
  await resetPassword(req.body);

  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};