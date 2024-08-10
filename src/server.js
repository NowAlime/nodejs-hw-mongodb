import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = process.env.PORT || 4010;

const setupServer = async () => {
  const app = express();

  try {
    // Підключення до MongoDB
    await initMongoConnection();

    // Налаштування мідлварів
    app.use(pino({ transport: { target: 'pino-pretty' } }));
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

 
    app.use('/api/auth', authRouter);
    app.use('/contacts', contactsRouter);

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
