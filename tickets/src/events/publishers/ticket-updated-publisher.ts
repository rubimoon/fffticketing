import { Publisher, Subjects, TicketUpdatedEvent } from '@fftickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
