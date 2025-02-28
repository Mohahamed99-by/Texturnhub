import React, { useEffect } from 'react';
import axios from 'axios';

const Success = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscription_id');

    if (subscriptionId) {
      const token = localStorage.getItem('token');
      axios
        .post(
          '/activate-subscription',
          { subscriptionId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          alert('Subscription activated successfully!');
        })
        .catch(err => {
          console.error('Activation error:', err);
          alert('Subscription activation failed.');
        });
    }
  }, []);

  return <h2>Transaction successful, thank you for subscribing!</h2>;
};

export default Success;
