import { Subjects, Publisher, PaymentCreatedEvent } from '@fftickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
