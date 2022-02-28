import request from 'supertest';
import { app } from '../../app';
import { TICKETS_API } from '../../api';
import {
  generateObjectId,
  generateTicketData,
} from '../../test/test-data-generators/ui';

it('returns a 404 if the ticket is not found', async () => {
  const id = generateObjectId();
  await request(app).get(`${TICKETS_API}/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = generateTicketData();
  const response = await request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send(ticket)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`${TICKETS_API}/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(ticket['title']);
  expect(ticketResponse.body.price).toEqual(ticket['price']);
});
