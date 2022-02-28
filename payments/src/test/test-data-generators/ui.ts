import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { OrderAttrs } from '../../models/order';
import { generateObjectId } from './mongo';
import { OrderStatus } from '@fftickets/common';

const generateUserData = () => {
  return {
    email: 'test@test.com',
    password: 'password',
  };
};

const generateOrderData = (userId?: string, price?: number): OrderAttrs => {
  return {
    id: generateObjectId(),
    status: OrderStatus.Created,
    price: price || faker.datatype.number({ min: 1 }),
    userId: userId || faker.datatype.string(),
    version: 0,
  };
};

const generateSessionData = (userId?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId || generateObjectId(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

const generatePaymentData = () => {
  return {
    token: faker.datatype.string(),
    orderId: generateObjectId(),
  };
};

export {
  generateUserData,
  generateOrderData,
  generateSessionData,
  generatePaymentData,
};
