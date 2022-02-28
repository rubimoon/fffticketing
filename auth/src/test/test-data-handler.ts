import { faker } from '@faker-js/faker';

export const setupEnv = () => {
  process.env = {
    JWT_KEY: faker.random.word(),
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  };
};

export const generateUserData = () => {
  return {
    email: 'test@test.com',
    password: 'password',
  };
};
