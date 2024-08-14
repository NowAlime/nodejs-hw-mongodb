
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import { registerUserSchema, loginSchema } from '../schemas/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  try {
    const { error } = registerUserSchema.validate(req.body);
    if (error) throw createHttpError(400, error.details[0].message);

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(409, 'Email in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw createHttpError(400, error.details[0].message);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, 'Invalid email or password');

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await Session.findOneAndUpdate(
      { userId: user._id },
      { accessToken, refreshToken, accessTokenValidUntil: Date.now() + 15 * 60 * 1000, refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 },
      { upsert: true }
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'No refresh token found');

    const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const session = await Session.findOne({ userId, refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await Session.findOneAndUpdate(
      { userId },
      { accessToken, refreshToken: newRefreshToken, accessTokenValidUntil: Date.now() + 15 * 60 * 1000, refreshTokenValidUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 }
    );

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken }
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'No refresh token found');

    const session = await Session.findOneAndDelete({ refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
