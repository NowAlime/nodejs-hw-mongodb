import mongoose from 'mongoose';
import { env } from '../utils/env.js';

const initMongoConnection = async () => {
  const user = env('MONGODB_USER');
  const password = env('MONGODB_PASSWORD');
  const url = env('MONGODB_URL');
  const dbName = env('MONGODB_DB');

  const connectionString = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
};

export default initMongoConnection;
