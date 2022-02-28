import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { TicketAttrs, TicketDoc } from '../../models/ticket';

export const generateUserData = () => {
  return {
    email: 'test@test.com',
    password: 'password',
  };
};

export const generateTicketData = (): TicketAttrs => {
  return {
    title: faker.datatype.string(),
    price: faker.datatype.number({ min: 1 }),
    userId: faker.datatype.string(),
  };
};

export const generateSessionData = () => {
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

export const generateObjectId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

export const generateEventData = () => {
  return {
    title: 'test_event',
  };
};
