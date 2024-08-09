import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import User from './db/models/user.js';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4010;

const createUser = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error('MONGODB_URL is not defined');
    }

    await mongoose.connect(uri);

    const hashedPassword = await bcrypt.hash('securepassword', 10);
    const newUser = new User({
      name: 'Ali',
      email: 'tour@gmail.com',
      password: hashedPassword,
    });
    await newUser.save();
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createUser();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
