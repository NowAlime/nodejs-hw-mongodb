import dotenv from 'dotenv';
import express from 'express';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import authRouter from './routers/auth.js';

dotenv.config();

const startServer = async () => {
  try {
    await initMongoConnection();

    const app = express();
    app.use(express.json());  
    app.use('/api/auth', authRouter);  

    setupServer(app);  

    app.listen(process.env.PORT || 4008, () => {
      console.log(`Server is running on port ${process.env.PORT || 4008}`);
    });
  } catch (error) {
    console.error('Error initializing MongoDB connection', error);
    process.exit(1);
  }
};

startServer();