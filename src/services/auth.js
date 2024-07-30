import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import User from '../models/user.js';

export const register = async ({ name, email, password }) => {
  // Перевірте, чи користувач з такою електронною поштою вже існує
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення та збереження нового користувача
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  // Видалення поля пароля з відповіді
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};
