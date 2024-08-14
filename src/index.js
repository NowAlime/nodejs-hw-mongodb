import  setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

const createUser = async () => {
  await initMongoConnection();
  setupServer();
};

createUser();