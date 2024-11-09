import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../constants';
const jwt = localStorage.getItem('jwt');


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const chargesurl = `${API_URL}/charges`

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      const response = await fetch(chargesurl, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'customer@example.com',
          payment_method: paymentMethod.id,
          amount: 5000, // Amount in cents
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        console.log('Payment successful!', data);
      }
    }
  };

  return (
    <>
        <div className="black-strip"></div>
        <section className="page-section" id="register">
        <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="card-element">
          Credit or debit card
        </label>
        <CardElement id="card-element" />
        <div id="card-errors" role="alert"></div>
      </div>
      <button type="submit" disabled={!stripe}>
        Pay now
      </button>
    </form>
    </section>
    </>
  );
};

export default CheckoutForm;
