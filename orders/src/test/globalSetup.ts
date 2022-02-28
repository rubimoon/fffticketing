import { faker } from '@faker-js/faker';

export const setupEnv = () => {
  process.env = {
    JWT_KEY: faker.datatype.string(),
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
  };
};
