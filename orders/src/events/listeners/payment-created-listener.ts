import {
  PaymentCreatedEvent,
  Listener,
  Subjects,
  OrderStatus,
} from '@fftickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Complete,
      //no need to update version anymore
    });
    await order.save();
    console.log(
      `Database: Updated Order ${order.id}. Set status to ${OrderStatus.Complete}`
    );
    msg.ack();
  }
}
