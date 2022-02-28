import request from 'supertest';
import { CURRENT_USER_API } from '../../api';
import { app } from '../../app';
import { generateUserData } from '../../test/test-data-handler';

it('responds with details about the current user', async () => {
  const data = generateUserData();
  const cookie = await global.signin();
  const response = await request(app)
    .get(CURRENT_USER_API)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(data['email']);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get(CURRENT_USER_API).send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
