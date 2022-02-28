import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { OrderAttrs, OrderStatus } from '../../models/order';
import { TicketAttrs, TicketDoc } from '../../models/ticket';
import { generateObjectId } from './mongo';

const generateUserData = () => {
  return {
    email: 'test@test.com',
    password: 'password',
  };
};

const generateTicketData = (): TicketAttrs => {
  return {
    id: generateObjectId(),
    title: faker.datatype.string(),
    price: faker.datatype.number({ min: 1 }),
  };
};

const generateOrderData = (ticket: TicketDoc): OrderAttrs => {
  return {
    status: OrderStatus.Created,
    userId: faker.datatype.string(),
    expiresAt: new Date(),
    ticket,
  };
};

const generateSessionData = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: generateObjectId(),
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
export {
  generateUserData,
  generateTicketData,
  generateOrderData,
  generateSessionData,
};
