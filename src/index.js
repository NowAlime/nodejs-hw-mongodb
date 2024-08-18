import { setupServer } from './server.js';  
import { initMongoConnection } from './db/initMongoConnection.js';

const bootUser = async () => {
  await initMongoConnection();
  setupServer();
};

bootUser();
