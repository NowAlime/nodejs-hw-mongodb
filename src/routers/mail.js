import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import httpErrors from 'http-errors';
import { validateBody,resetPwdSchema } from './middlewares/validateBody.js'; 
import User from './models/user.js';

const router = express.Router();


router.post('/auth/send-reset-email', validateBody({ email: 'string' }), async (req, res, next) => {
  const { email } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      throw httpErrors(404, 'User not found!');
    }

 
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

 
    const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

   
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });


    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });

  } catch (error) {
    if (error.status) {
      next(error);
    } else {
      next(httpErrors(500, 'Failed to send the email, please try again later.'));
    }
  }
});

router.post('/auth/reset-pwd', validateBody(resetPwdSchema), async (req, res, next) => {
    const { token, password } = req.body;
  
    try {
    
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw httpErrors(401, 'Token is expired or invalid.');
      }
  
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        throw httpErrors(404, 'User not found!');
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
  
      await user.save();
  
  
      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  });


router.post('/reset-pwd', validateBody(resetPwdSchema), async (req, res, next) => {
    const { token, password } = req.body;
  
    try {
      
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw httpErrors(401, 'Token is expired or invalid.');
      }
  
      
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        throw httpErrors(404, 'User not found!');
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
  
     
      await user.save();
  
      
      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  });

export default router;