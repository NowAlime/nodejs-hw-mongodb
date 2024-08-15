import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js'; 
import { validateBody, resetPwdSchema } from '../middlewares/validateBody.js';
import env from '../utils/env.js'; 

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  secure: env('SMTP_PORT') == 465,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

    const token = jwt.sign({ email }, env('JWT_SECRET'), { expiresIn: '5m' });

    const resetLink = `${env('APP_DOMAIN')}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: `<p>To reset your password, please click the link below:</p>
             <a href="${resetLink}">Reset Password</a>`
    });

    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    if (error.responseCode === 550) {
      return next(createHttpError(500, 'Failed to send the email, please try again later.'));
    }
    next(error);
  }
};
