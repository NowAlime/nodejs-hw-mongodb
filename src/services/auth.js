import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const registerUserService = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, name });
  await newUser.save();

  return newUser;
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  await new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).save();

  return { accessToken, refreshToken };
};

export const refreshSessionService = async (refreshToken) => {
  try {
    const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const session = await Session.findOne({ userId, refreshToken });
    if (!session || new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    await Session.deleteMany({ userId });

    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await new Session({
      userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
};

export const logoutUserService = async (sessionId, refreshToken) => {
  try {
    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid session ID or refresh token');
    }

    await Session.deleteOne({ _id: sessionId });

    return;
  } catch (error) {
    throw createHttpError(500, 'Error logging out user');
  }
};
