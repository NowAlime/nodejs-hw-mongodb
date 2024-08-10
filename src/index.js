import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './db/models/user.js';
import bcrypt from 'bcrypt';

dotenv.config();

const createUser = async () => {
    try {
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

        await mongoose.connect(uri);

        await User.deleteOne({ email: 'tour@gmail.com' });

        const hashedPassword = await bcrypt.hash('securepassword', 10);
        const newUser = new User({
            name: 'Tour Guide',
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
