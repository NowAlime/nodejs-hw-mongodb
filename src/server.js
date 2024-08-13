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

const app = express();
const port = process.env.PORT || 7979;

const setupServer = async () => {
  try {
    await initMongoConnection();

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

    app.listen(port, '0.0.0.0', () => {
      console.log(`Сервер працює на порту ${port}`);
    });
  } catch (error) {
    console.error('Помилка при ініціалізації сервера:', error);
  }
};

setupServer();
