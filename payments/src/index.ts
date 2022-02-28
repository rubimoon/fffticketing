import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;
const { MONGO_URL, JWT_KEY, NATS_CLUSTER_ID, NATS_URL, NATS_CLIENT_ID } =
  process.env;

const start = async () => {
  console.log("Payments Service is starting up....");
  if (!JWT_KEY) {
    throw new Error('JWT_KEY must be defined.');
  }
  if (!MONGO_URL) {
    throw new Error('MONGO_URL must be defined.');
  }
  if (!NATS_CLUSTER_ID) {
    throw new Error('NATS CLUSTER must be defined.');
  }
  if (!NATS_URL) {
    throw new Error('NATS URL must be defined.');
  }
  if (!NATS_CLIENT_ID) {
    throw new Error('NATS client Id must be defined.');
  }

  await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();

  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}!!!`);
  });
};

start();
