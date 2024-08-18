import User from '../db/models/user.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js'; 

export const registerUserController = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user._id }, env('JWT_SECRET'), { expiresIn: '1h' });
  res.json({ token });
};

export const logoutUserController = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const refreshUsersSessionController = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));
    const newToken = jwt.sign({ id: decoded.id }, env('JWT_SECRET'), { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


export const resetPasswordController = async (req, res, next) => {
  try {

    const { token, password } = req.body;

   
    let decoded;
    try {
      decoded = jwt.verify(token, env('JWT_SECRET'));
    } catch (err) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.password = hashedPassword;
    await user.save();


    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

