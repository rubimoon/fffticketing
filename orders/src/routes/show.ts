import { NotAuthorizedError, NotFoundError } from '@fftickets/common';
import express, { Request, Response } from 'express';
import { ORDERS_API } from '../api';
import { Order } from '../models/order';

const router = express.Router();

router.get(`${ORDERS_API}/:orderId`, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  res.send(order);
});

export { router as showOrderRouter };
