import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import  User from '../db/models/user.js';
import  SessionsCollection  from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import nodemailer from 'nodemailer';

export const hashPassword = async (password) => {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


export const registerUser = async (userData) => {
  const { email, password } = userData;

  const hashedPassword = await hashPassword(password); 
  const user = await User.create({ email, password: hashedPassword });


  const { password: _, ...userWithoutPassword } = user.toObject();

  return userWithoutPassword;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      headers: {
        'X-Mailer': 'Nodemailer',
        'X-Priority': '1',
      }
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Помилка при відправці листа:', error);
    return false;
  }
};


const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

  
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });

  
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `<p>To reset your password, click the following link:</p><p><a href="${resetLink}">${resetLink}</a></p>`
    });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {}
    });
  } catch (error) {
    next(error);
  }
};


export const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
};


export const deleteSession = async (userId) => {
  try {
    await SessionsCollection.deleteMany({ userId }); 
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
};