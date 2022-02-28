import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@fftickets/common';
import { generateObjectId } from './ui';
import faker from '@faker-js/faker';
import { TicketDoc } from '../../models/ticket';
import { Message } from 'node-nats-streaming';

const generateOrderCreatedEvent = (
  ticket: TicketDoc
): OrderCreatedEvent['data'] => {
  return {
    id: generateObjectId(),
    version: 0,
    status: OrderStatus.Created,
    userId: faker.datatype.string(),
    expiresAt: 'asfklsaf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
};
const generateMessageObject = (): Message => {
  // @ts-ignore
  return {
    ack: jest.fn(),
  };
};

const generateOrderCancelledEvent = (
  orderId: string,
  ticket: TicketDoc
): OrderCancelledEvent['data'] => {
  return {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
};

export {
  generateOrderCreatedEvent,
  generateMessageObject,
  generateOrderCancelledEvent,
};
