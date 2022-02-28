import { Listener, OrderCreatedEvent, Subjects } from '@fftickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // if not ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // mark the ticet as being reserved by setting isd orderId property
    ticket.set({ orderId: data.id });
    await ticket.save();
    console.log(`Database: Updated Ticket ${ticket.id}. Set up order id.`);
    // add await to make sure that it is processed sucecessfully
    await new TicketUpdatedPublisher(this.client).publish({
      version: ticket.version,
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
