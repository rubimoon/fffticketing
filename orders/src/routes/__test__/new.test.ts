import request from 'supertest';
import { ORDERS_API } from '../../api';
import { app } from '../../app';
import {
  generateObjectId,
  generateTicketData,
} from '../../test/test-data-generators';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = generateObjectId();
  await request(app)
    .post(ORDERS_API)
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post(ORDERS_API)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  await request(app)
    .post(ORDERS_API)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits on order created event', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  await request(app)
    .post(ORDERS_API)
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
