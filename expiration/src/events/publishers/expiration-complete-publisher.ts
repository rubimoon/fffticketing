import {
  Subjects,
  ExpirationCompleteEvent,
  Publisher,
} from '@fftickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
