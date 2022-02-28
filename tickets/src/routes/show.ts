import { NotFoundError } from '@fftickets/common';
import experss, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const ROUTE = '/api/tickets';
const router = experss.Router();

router.get(`${ROUTE}/:id`, async (req: Request, res: Response) => {
  // TODO Do we need to put trycatch here?
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };
