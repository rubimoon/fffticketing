import request from 'supertest';
import { PAYMENTS_API } from '../../api';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import {
  generateOrderData,
  generatePaymentData,
  generateObjectId,
} from '../../test/test-data-generators';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

const TEST_TOKEN = 'tok_visa';

it('returns a 404 when purchasing an order that does not exist ', async () => {
  const data = generatePaymentData();
  await request(app)
    .post(PAYMENTS_API)
    .set('Cookie', global.signin())
    .send(data)
    .expect(404);
});
it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build(generateOrderData());
  await order.save();
  await request(app)
    .post(PAYMENTS_API)
    .set('Cookie', global.signin())
    .send({ token: 'randonstring', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = generateObjectId();
  const order = Order.build(generateOrderData(userId));
  order.status = OrderStatus.Cancelled;
  await order.save();

  await request(app)
    .post(PAYMENTS_API)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'randomstring',
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = generateObjectId();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build(generateOrderData(userId, price));
  await order.save();

  await request(app)
    .post(PAYMENTS_API)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: TEST_TOKEN,
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });
  // payment is either PaymentDoc or null
  expect(payment).not.toBeNull();
});

it('', async () => {});
