import request from 'supertest';
import { SIGNUP_API } from '../../api';
import { app } from '../../app';
import { generateUserData } from '../../test/test-data-handler';

it('returns a 201 on successful signup', async () => {
  const data = generateUserData();
  return request(app).post(SIGNUP_API).send(data).expect(201);
});

it('returns a 400 with an invalid email', async () => {
  const data = generateUserData();
  return request(app)
    .post(SIGNUP_API)
    .send({ email: 'invalidemail', password: data['password'] })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  const data = generateUserData();
  return request(app)
    .post(SIGNUP_API)
    .send({
      email: data['email'],
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  const data = generateUserData();
  await request(app)
    .post(SIGNUP_API)
    .send({
      email: data['email'],
    })
    .expect(400);

  await request(app)
    .post(SIGNUP_API)
    .send({
      password: data['password'],
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  const data = generateUserData();
  await request(app).post(SIGNUP_API).send(data).expect(201);

  await request(app).post(SIGNUP_API).send(data).expect(400);
});

it('sets a cookie after successful signup', async () => {
  const data = generateUserData();
  const response = await request(app).post(SIGNUP_API).send(data).expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
