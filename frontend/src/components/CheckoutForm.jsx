import React, { useEffect, useState } from 'react';
import { CardElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../constants';
const jwt = localStorage.getItem('jwt');


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const chargesurl = `${API_URL}/charges`;

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: 5000,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on('paymentmethod', async (event) => {
        const response = await fetch(chargesurl, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: event.paymentMethod.id,
            amount: 5000, // Amount in cents
          }),
        });

        const data = await response.json();
        if (data.error) {
          event.complete('fail');
          console.error(data.error);
        } else {
          event.complete('success');
          console.log('Payment successful!', data);
        }
      });
    }
  }, [stripe]);

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
          {paymentRequest && (
            <div className="form-row">
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </div>
          )}
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

