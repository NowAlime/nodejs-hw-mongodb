import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import env from '../utils/env.js';

export const sendResetEmailController = async (req, res, next) => {
  console.log('Request body:', req.body);

  const { email } = req.body;
  if (!email) {
    return next(createHttpError(400, "Email is required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found!"));
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {}
    });
  } catch (error) {
    next(createHttpError(500, "Failed to send the email, please try again later."));
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;

  try {
   
    const decoded = jwt.verify(token, env('JWT_SECRET'));

    
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }


    user.password = await user.hashPassword(password); 
    await user.save();

 

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {}
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }
    next(error);
  }
};