
import initMongoConnection from './db/initMongoConnection.js';

const createUser = async () => {
  await initMongoConnection();

};

createUser();