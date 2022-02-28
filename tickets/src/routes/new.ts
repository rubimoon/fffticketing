import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@fftickets/common';
import { Ticket } from '../models/ticket';
import { TICKETS_API } from '../api';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  TICKETS_API,
  requireAuth,
  body('title').not().isEmpty().withMessage('Title is required.'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    console.log(`Database: Added Ticket ${ticket.id}`);

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      version: ticket.version,
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
