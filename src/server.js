import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routers/index.js';

const PORT = Number(env('PORT', '5009'));

export const setupServer = () => {
  const app = express();


  app.use(
    cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.get('/', (req, res) => {
    res.send('Welcome to the home page!');
  });
  
  app.use(router);

  
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

