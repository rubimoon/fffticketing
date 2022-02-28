import Link from 'next/link';
import { TICKETS_API } from '../api/services';
import { TICKET_DETAIL } from '../api/pages';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={TICKET_DETAIL} as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
<<<<<<< HEAD
      <h2>Tickets</h2>
=======
      <h3>Tickets</h3>
>>>>>>> 19d695300a8e3e6517842302463cd3c1651ab946
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(TICKETS_API);

  return { tickets: data };
};

export default LandingPage;
