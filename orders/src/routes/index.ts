import { requireAuth } from '@fftickets/common';
import express, { Request, Response } from 'express';
import { ORDERS_API } from '../api';
import { Order } from '../models/order';

const router = express.Router();

router.get(ORDERS_API, requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket'
  );

  res.send(orders);
});

export { router as indexOrderRouter };
