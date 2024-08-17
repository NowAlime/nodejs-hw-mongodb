import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import authRouter from './routers/auth.js';

const PORT = Number(env('PORT', '3009'));

export const setupServer = () => {
  const app = express();

  // Загальні middleware
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json()); // Додаємо парсинг JSON, якщо це потрібно для інших маршрутів
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Роутери
  app.use('/auth', authRouter);
  app.use(router);

  // Обробка запитів до неіснуючих маршрутів
  app.use('*', notFoundHandler);

  // Обробка помилок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
