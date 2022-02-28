import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@fftickets/common';
import express, { Request, Response } from 'express';
import { ORDERS_API } from '../api';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

// we are really deleting data
// instead we mark order as cancelled
router.delete(
  `${ORDERS_API}/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    console.log(`Database: Updated Order ${order.id}. Set status to Cancelled.`);

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
      version: order.version,
    });
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
