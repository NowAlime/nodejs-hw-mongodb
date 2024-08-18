import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import env from '../utils/env.js';

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

  
    const resetToken = generateResetToken(email);
    const resetPasswordUrl = `http://yourdomain.com/reset-password?token=${resetToken}`;

    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: env('EMAIL_USER'),
        pass: env('EMAIL_PASS'),
      },
    });

    await transporter.sendMail({
      from: env('EMAIL_USER'),
      to: email,
      subject: 'Reset Your Password',
      html: `<a href="${resetPasswordUrl}">Reset Password</a>`,
    });

    res.status(200).json({
      message: 'Reset password email sent successfully.',
    });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
};
