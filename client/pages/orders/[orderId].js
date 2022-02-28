import { ORDERS_API, PAYMENTS_API } from '../../api/services';
import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useRequest } from '../../hooks/use-request';
import Router from 'next/router';
import { ORDERS_HISTORY } from '../../api/pages';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { processRequest, errors } = useRequest({
    url: PAYMENTS_API,
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push(ORDERS_HISTORY),
  });
  //run only once
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    // invoke the helper function immediately
    findTimeLeft();
    // invoke the helper function every 1000 milisecond
    const timerId = setInterval(findTimeLeft, 1000);

    // invoked when useEffect is about to be re-invoked
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => processRequest({ token: id })}
        stripeKey='pk_test_51KWwuGIUe1IKEpvSsShREYBYUyvuN2QlAbRzg3nTG66ISOy8Pxw39W76gM7g9mwEuAZ0zWdvLDvFS6w5FBAwLLtz00ymfvezQ3'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`${ORDERS_API}/${orderId}`);
  return { order: data };
};

export default OrderShow;
