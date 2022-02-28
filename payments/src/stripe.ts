import Stripe from 'stripe';

const { STRIPE_KEY } = process.env;
if (!STRIPE_KEY) {
  throw new Error('STRIPE API KEY must be defined.');
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
});

export { stripe };
