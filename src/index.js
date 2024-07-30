import dotenv from 'dotenv';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import authRouter from './routers/auth.js';

dotenv.config();

initMongoConnection()
  .then(() => {
    setupServer();
  })
  .catch((error) => {
    console.error('Error initializing MongoDB connection', error);
    process.exit(1);
  });
  const app = express();
  app.use(authRouter);