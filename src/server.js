import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pino from 'pino-http';
import env from './utils/env.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import router from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

const PORT = Number(env('PORT', '7009'));
const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api', router);  
  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (err) => {
    if (err) {
      console.error(`Error starting server: ${err.message}`);
      process.exit(1); 
    }
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();
export default setupServer;
