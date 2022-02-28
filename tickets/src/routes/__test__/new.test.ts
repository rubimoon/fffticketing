import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { TICKETS_API } from '../../api';
import {
  generateEventData,
  generateTicketData,
} from '../../test/test-data-generators/ui';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post(TICKETS_API).send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(TICKETS_API).send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  const ticket = generateTicketData();
  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({ title: '', price: ticket['price'] })
    .expect(400);

  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({ price: ticket['price'] })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  const ticket = generateTicketData();
  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({ title: ticket['title'], price: -10 })
    .expect(400);

  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({ title: 'abcdefg' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  const ticket = generateTicketData();
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send(ticket)
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(ticket['title']);
  expect(tickets[0].price).toEqual(ticket['price']);
});

it('pubilshes an event', async () => {
  const { title } = generateEventData();
  await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
