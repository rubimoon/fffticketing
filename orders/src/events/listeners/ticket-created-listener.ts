import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@fftickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    console.log(`Database: Added Ticket ${ticket.id}`);
    msg.ack();
  }
}
