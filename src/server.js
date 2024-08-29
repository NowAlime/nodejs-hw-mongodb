import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import env from './utils/env.js';
import routers from './routers/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

const PORT = Number(env('PORT', '5011'));

const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.use(routers);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
export default setupServer;