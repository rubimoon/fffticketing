import { Publisher, OrderCancelledEvent, Subjects } from '@fftickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
