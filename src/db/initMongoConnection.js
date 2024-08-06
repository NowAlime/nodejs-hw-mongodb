import mongoose from 'mongoose';
import env from '../utils/env.js';

const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default initMongoConnection;
