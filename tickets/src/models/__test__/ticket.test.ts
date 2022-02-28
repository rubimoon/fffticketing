import { generateTicketData } from '../../test/test-data-generators/ui';
import { Ticket } from '../ticket';

it('implememts optimitic concurrency control', async () => {
  // create an instance of a ticket
  const data = generateTicketData();
  const ticket = Ticket.build(data);
  // save the ticket to the database
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // mae two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  // set price twice before the first event is processed
  secondInstance!.set({ price: 15 });
  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket
  try {
    //this line is supposed to go wrong.
    await secondInstance!.save();
  } catch (error) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('incremens the version number on multiple saves', async () => {
  const data = generateTicketData();
  const ticket = Ticket.build(data);

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
