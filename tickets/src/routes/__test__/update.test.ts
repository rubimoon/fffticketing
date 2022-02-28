import request from 'supertest';
import { TICKETS_API } from '../../api';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import {
  generateObjectId,
  generateTicketData,
} from '../../test/test-data-generators/ui';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provded id does not exist', async () => {
  const id = generateObjectId();
  const data = generateTicketData();
  await request(app)
    .put(`${TICKETS_API}/${id}`)
    .set('Cookie', global.signin())
    .send(data)
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateObjectId();
  const data = generateTicketData();
  await request(app).put(`${TICKETS_API}/${id}`).send(data).expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const data = generateTicketData();
  const newData = generateTicketData();

  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send(data);

  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', global.signin())
    .send(newData)
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price ', async () => {
  const data = generateTicketData();
  const cookie = global.signin();

  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', cookie)
    .send(data);

  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: data['price'],
    })
    .expect(400);

  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: data['title'],
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const data = generateTicketData();
  const newData = generateTicketData();
  const cookie = global.signin();
  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', cookie)
    .send(data)
    .expect(201);
  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', cookie)
    .send(newData)
    .expect(200);
  const ticketResponse = await request(app)
    .get(`${TICKETS_API}/${response.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual(newData['title']);
  expect(ticketResponse.body.price).toEqual(newData['price']);
});

it('publishes an event', async () => {
  const data = generateTicketData();
  const newData = generateTicketData();
  const cookie = global.signin();
  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', cookie)
    .send(data)
    .expect(201);
  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', cookie)
    .send(newData)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved.', async () => {
  const data = generateTicketData();
  const newData = generateTicketData();
  const cookie = global.signin();
  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', cookie)
    .send(data)
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({
    orderId: generateObjectId(),
  });
  await ticket!.save();

  await request(app)
    .put(`${TICKETS_API}/${response.body.id}`)
    .set('Cookie', cookie)
    .send(newData)
    .expect(400);
});
