import request from 'supertest';
import { SIGNOUT_API, SIGNUP_API } from '../../api';
import { app } from '../../app';
import { generateUserData } from '../../test/test-data-handler';

it('clears the cookie after signing out', async () => {
  await request(app).post(SIGNUP_API).send(generateUserData()).expect(201);

  const response = await request(app).post(SIGNOUT_API).send({}).expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
