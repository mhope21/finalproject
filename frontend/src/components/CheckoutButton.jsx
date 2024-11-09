import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL, STRIPE_PK } from '../constants';

const stripePromise = loadStripe(STRIPE_PK);
const jwt = localStorage.getItem('jwt');

const CheckoutButton = () => {
  const [amount, setAmount] = useState(0);

  const handleClick = async () => {
    const stripe = await stripePromise;

    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${jwt}`,
      },
      body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <>
      <div className="black-strip"></div>
      <section className="page-section" id="register">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button role="link" onClick={handleClick}>
          Checkout
        </button>
      </section>
    </>
  );
};

export default CheckoutButton;

