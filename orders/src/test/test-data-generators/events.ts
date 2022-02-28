import {
  ExpirationCompleteEvent,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@fftickets/common';
import { generateObjectId } from './mongo';
import { Message } from 'node-nats-streaming';
import { TicketDoc } from '../../models/ticket';
import { OrderDoc } from '../../models/order';

const generateEventData = () => {
  return {
    title: 'test_event',
  };
};

const generateTicketCreatedEvent = (): TicketCreatedEvent['data'] => {
  return {
    version: 0,
    id: generateObjectId(),
    title: 'concert',
    price: 10,
    userId: generateObjectId(),
  };
};

const generateMessageData = (): Message => {
  // @ts-ignore
  return {
    ack: jest.fn(),
  };
};

const generateTicketUpdatedEvent = (
  ticket: TicketDoc
): TicketUpdatedEvent['data'] => {
  return {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'ansfnoasdf',
  };
};

const generateExpirationCompleteEvent = (
  order: OrderDoc
): ExpirationCompleteEvent['data'] => {
  return {
    orderId: order.id,
  };
};

export {
  generateEventData,
  generateTicketCreatedEvent,
  generateMessageData,
  generateTicketUpdatedEvent,
  generateExpirationCompleteEvent,
};
