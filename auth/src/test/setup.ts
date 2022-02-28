import request from 'supertest';
import { SIGNUP_API } from '../api';
import { app } from '../app';
import { dbHandler } from './db-handler';
import { generateUserData, setupEnv } from './test-data-handler';

beforeAll(async () => {
  setupEnv();
  await dbHandler.createDb();
  await dbHandler.connectDb();
});

beforeEach(async () => {
  await dbHandler.cleanupDb();
});

afterAll(async () => {
  await dbHandler.dropDb();
});

declare global {
  function signup(): Promise<request.Response>;
  function signin(): Promise<string[]>;
}

global.signup = async () => {
  const data = generateUserData();
  return await request(app).post(SIGNUP_API).send(data).expect(201);
};

global.signin = async () => {
  const response = await global.signup();
  return response.get('Set-Cookie');
};
