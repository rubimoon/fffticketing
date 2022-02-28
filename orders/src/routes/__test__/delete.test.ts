import request from 'supertest';
import { ORDERS_API } from '../../api';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { generateTicketData } from '../../test/test-data-generators/ui';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  // make a request to create an order
  const user = global.signin();
  const { body: order } = await request(app)
    .post(ORDERS_API)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to cancel the order

  await request(app)
    .delete(`${ORDERS_API}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  //   expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // create a ticket with Ticket Model
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  // make a request to create an order
  const user = global.signin();
  const { body: order } = await request(app)
    .post(ORDERS_API)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to cancel the order

  await request(app)
    .delete(`${ORDERS_API}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  //   expectation to make sure the thing is cancelled

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// it.todo(
//   'returns if trying to delete order which does not exit',
//   async () => {}
// );
