import request from 'supertest';
import { ORDERS_API } from '../../api';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { generateTicketData } from '../../test/test-data-generators';

it('fetches the order', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  const user = global.signin();
  const { body: order } = await request(app)
    .post(ORDERS_API)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`${ORDERS_API}/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('return an error when trying to fetch other users order ', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  await ticket.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: order } = await request(app)
    .post(ORDERS_API)
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`${ORDERS_API}/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});
