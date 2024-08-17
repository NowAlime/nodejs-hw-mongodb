import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import authRouter from './routers/auth.js';
import uploadRouter from './routers/uploadRouter.js';

const PORT = Number(env('PORT', '3009'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json()); 
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  
  app.use('/auth', authRouter);
  app.use(router);
  app.use(uploadRouter);

  app.use('*', notFoundHandler);


  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};