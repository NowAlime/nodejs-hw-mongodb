import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import router from './routers/contacts.js';  
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3009;

const setupServer = async () => {
  try {
    await initMongoConnection();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(pino({ transport: { target: 'pino-pretty' } }));

    app.use('/api', router);  

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

export default setupServer;
