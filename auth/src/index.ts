import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;
const { MONGO_URL, JWT_KEY } = process.env;

const start = async () => {
  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined.');
  }
  if (!MONGO_URL) {
    throw new Error('MONGO_URL must be defined.');
  }

  await mongoose.connect(MONGO_URL);
  console.log('Sucessfully Connected to MongoDB.');

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}!!!`);
  });
};

start();
