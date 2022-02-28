import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@fftickets/common';

import faker from '@faker-js/faker';
import { Message } from 'node-nats-streaming';
import { generateObjectId } from './mongo';
import { OrderDoc } from '../../models/order';


const generateOrderCreatedEvent = (): OrderCreatedEvent['data'] => {
  return {
    id: generateObjectId(),
    version: 0,
    status: OrderStatus.Created,
    userId: faker.datatype.string(),
    expiresAt: faker.datatype.string(),
    ticket: {
      id: faker.datatype.string(),
      price: 10,
    },
  };
};

const generateOrderCancelledEvent = (
  order: OrderDoc
): OrderCancelledEvent['data'] => {
  return {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: faker.datatype.string(),
    },
  };
};

const generateMessageObject = (): Message => {
  // @ts-ignore
  return {
    ack: jest.fn(),
  };
};
export {
  // generateEventData,
  generateOrderCreatedEvent,
  generateMessageObject,
  generateOrderCancelledEvent,
};
