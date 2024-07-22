import dotenv from 'dotenv';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';


dotenv.config();


initMongoConnection()
  .then(() => {
    
    setupServer();
  })
  .catch((error) => {
    console.error('Error initializing MongoDB connection', error);
    process.exit(1);
  });