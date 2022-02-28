import { faker } from '@faker-js/faker';

export const setupEnv = () => {
  process.env = {
    JWT_KEY: faker.datatype.string(),
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    STRIPE_KEY:
      'sk_test_51KWwuGIUe1IKEpvSKH90GqXuBsYe9MgaphrHKVNoQG9rMlQQu7T4Sx50jrxiy7bvDQxVYICTJsxBPxCngEMzRXCQ00KlzRCKgn',
  };
};
