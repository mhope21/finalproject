import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_URL } from '../../constants';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${API_URL}/checkout-session/${sessionId}`)
        .then(response => response.json())
        .then(data => setSession(data))
        .catch(error => console.error('Error fetching session:', error));
    }
  }, [sessionId]);

  return (
    <>
        <section id="confirmation" >
         <div className="container border bg-white w-60 h-100 p-5 rounded" style={{marginTop: 40}}>
            <div className="text-center">
      <h2 className='mb-5'>Payment Successful!</h2>
      {session ? (
        <div>
          <p>Thank you for your donation, {session.customer_details.name}!</p>
          <p>Amount: ${(session.amount_total / 100).toFixed(2)}</p>
          <p>Payment Status: {session.payment_status}</p>
        </div>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
    </div>
    </section>
    </>
  );
};

export default SuccessPage;

