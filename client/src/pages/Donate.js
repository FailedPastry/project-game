import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Donate = () => {
  const handleClick = async (event) => {
    const stripe = await stripePromise;
    const response = await fetch('/create-checkout-session', { method: 'POST' });
    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <button onClick={handleClick}>Donate $5</button>
  );
};

export default Donate;