import { ORDERS_API, TICKETS_API } from '../../api/services';
import { useRequest } from '../../hooks/use-request';
import Router from 'next/router';
import { ORDER_DETAIL } from '../../api/pages';

const TicketShow = ({ ticket }) => {
  const { processRequest, errors } = useRequest({
    url: ORDERS_API,
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push(ORDER_DETAIL, `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => processRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  // take ticketId from http get query
  const { ticketId } = context.query;
  const { data } = await client.get(`${TICKETS_API}/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
