import request from 'supertest';
import { SIGNIN_API, SIGNUP_API } from '../../api';
import { app } from '../../app';
import { generateUserData } from '../../test/test-data-handler';

it('fails when a email that does not exist is supplied', async () => {
  const data = generateUserData();
  await request(app).post(SIGNIN_API).send(data).expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const data = generateUserData();
  await request(app).post(SIGNUP_API).send(data).expect(201);

  await request(app)
    .post(SIGNIN_API)
    .send({
      email: data['email'],
      password: 'pass',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const data = generateUserData();
  await request(app).post(SIGNUP_API).send(data).expect(201);
  const response = await request(app).post(SIGNIN_API).send(data).expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
