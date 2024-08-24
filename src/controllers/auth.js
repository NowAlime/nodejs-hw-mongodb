import {ONE_DAY } from '../constants/index.js';
import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logoutUser,
  sendEmail,
  updatePassword,
  deleteSession
} from '../services/auth.js';
import jwt from 'jsonwebtoken';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';


export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUsersSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};


export const sendResetEmailController = async (req, res) => {
    try {
      const { email } = req.body;
  
      console.log('Received email:', email);
  
      const user = await UsersCollection.findOne({ email });
  
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }
  
      console.log('Found user:', user);
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '5m',
      });
  
      console.log('Generated JWT token:', token);
  
      const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  
      const emailSent = await sendEmail({
        to: email,
        subject: 'Password Reset',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
      });
  
      if (!emailSent) {
        throw createHttpError(500, 'Failed to send email. Please try again later.');
      }
  
      res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
      });
    } catch (error) {
      console.error('Error in sendResetEmailController:', error);
      res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {},
      });
    }
  };
  
  export const resetPasswordController = async (req, res) => {
    try {
      const { token, password } = req.body;
  
    
      if (!token || !password) {
        throw createHttpError(400, 'Token and password are required.');
      }
  
      let decoded;
      try {
     
        console.log('Received token:', token);
        console.log('Verifying token with secret:', process.env.JWT_SECRET);
  

        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
  
      } catch (error) {
        console.error('Token verification error:', error.message);
        
   
        if (error.name === 'TokenExpiredError') {
          throw createHttpError(401, 'Token has expired.');
        } else if (error.name === 'JsonWebTokenError') {
          throw createHttpError(401, 'Token is invalid.');
        } else {
          throw createHttpError(401, 'Token verification failed.');
        }
      }
  
   
      const user = await UsersCollection.findOne({ email: decoded.email });
      if (!user) {
        throw createHttpError(404, 'User not found!');
      }
  
 
      await updatePassword(user._id, password);
  
    
      await deleteSession(user._id);
  
     
      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
  
    } catch (error) {

      console.error('Error in resetPasswordController:', error.message);
      res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || 'Internal Server Error',
        data: {},
      });
    }
  };


