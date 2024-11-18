import mongoose from 'mongoose';

export const connectDB = () => {
  const MONGO_URL = process.env.CONNECTION_STRING;
  mongoose.Promise = Promise;
  
  mongoose.connect(MONGO_URL || '')
    .then(() => console.log('Connected to DB'))
    .catch((error) => console.error('DB connection error:', error));;

  mongoose.connection.on('error', (error: Error) => {
    console.error('DB error', error);
  });
};