import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const { NATS_CLUSTER_ID, NATS_URL, NATS_CLIENT_ID } = process.env;

const start = async () => {
<<<<<<< HEAD
  console.log("Expiration Service is starting up...");
=======
  console.log('Expiration Service is starting up.....');
>>>>>>> 19d695300a8e3e6517842302463cd3c1651ab946
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
};

start();
