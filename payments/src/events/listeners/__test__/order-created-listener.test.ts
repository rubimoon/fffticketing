import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import {
  generateMessageObject,
  generateOrderCreatedEvent,
} from '../../../test/test-data-generators';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data = generateOrderCreatedEvent();
  const msg = generateMessageObject();

  return {
    listener,
    data,
    msg,
  };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
