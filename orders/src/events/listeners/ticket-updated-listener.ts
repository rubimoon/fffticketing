import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@fftickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // only process event which ticket's version is version -1
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('Ticket with the correct version not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    console.log(`Database: Updated Ticket ${ticket.id}`);
    msg.ack();
  }
}
