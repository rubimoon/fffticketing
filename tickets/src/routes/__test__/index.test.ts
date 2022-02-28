import request from 'supertest';
import { TICKETS_API } from '../../api';
import { app } from '../../app';
import { generateTicketData } from '../../test/test-data-generators/ui';

const createTicket = () => {
  const data = generateTicketData();
  return request(app)
    .post(TICKETS_API)
    .set('Cookie', global.signin())
    .send(data);
};

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get(TICKETS_API).send().expect(200);
  expect(response.body.length).toEqual(3);
});
