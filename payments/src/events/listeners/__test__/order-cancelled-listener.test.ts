import { natsWrapper } from '../../../nats-wrapper';
import {
  generateMessageObject,
  generateOrderCancelledEvent,
  generateOrderData,
} from '../../../test/test-data-generators';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order, OrderStatus } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build(generateOrderData());
  await order.save();
  const data = generateOrderCancelledEvent(order);
  const msg = generateMessageObject();

  return {
    listener,
    order,
    msg,
    data,
  };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the messgae', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
