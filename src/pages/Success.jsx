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
          alert('تم تفعيل الاشتراك بنجاح!');
        })
        .catch(err => {
          console.error('Activation error:', err);
          alert('فشل تفعيل الاشتراك.');
        });
    }
  }, []);

  return <h2>تمت العملية بنجاح، شكرًا لاشتراكك!</h2>;
};

export default Success;