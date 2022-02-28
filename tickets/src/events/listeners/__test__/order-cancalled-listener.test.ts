import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import {
  generateMessageObject,
  generateObjectId,
  generateTicketData,
  generateOrderCancelledEvent,
} from '../../../test/test-data-generators';
import { OrderCancelledListener } from '../order-cancalled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = generateObjectId();
  const ticket = Ticket.build(generateTicketData());
  ticket.set({ orderId });
  await ticket.save();

  const data = generateOrderCancelledEvent(orderId, ticket);
  const msg = generateMessageObject();

  return { msg, listener, orderId, ticket, data };
};

it('updates the ticket, pubilshes an event, and acks th message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
