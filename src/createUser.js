import User from './db/models/user.js';
import bcrypt from 'bcrypt';

const createUser = async () => {
    try {
      const hashedPassword = await bcrypt.hash('securepassword', 10);
      const newUser = new User({
        name: 'Jo Do',
        email: 'jodo@example.com',
        password: hashedPassword
      });
      await newUser.save();
      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };
  
  
  createUser();