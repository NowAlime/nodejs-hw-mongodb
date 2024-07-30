import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import User from './models/user.js';

dotenv.config();

const PORT = process.env.PORT || 3006;

const setupServer = async () => {
  try {
    await initMongoConnection();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({ transport: { target: 'pino-pretty' } }));

    app.use(contactsRouter);

    app.use((req, res, next) => {
      console.log(`Time: ${new Date().toLocaleString()}`);
      next();
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
  }
};

setupServer();


const createUser = async () => {
  try {
    const newUser = new User({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'securepassword'
    });
    await newUser.save();
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

createUser();
