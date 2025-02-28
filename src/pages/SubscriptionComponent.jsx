import React, { useState } from 'react';
import axios from 'axios';

const Subscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // افتراض وجود توكن من تسجيل الدخول
      const response = await axios.post(
        'https://texturnhub-backenn-3.onrender.com/subscribe',
        { email: 'user@example.com' }, // يمكن تمرير بريد المستخدم من حالة التطبيق
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { approvalUrl } = response.data;
      window.location.href = approvalUrl; // إعادة توجيه للموافقة على الاشتراك
    } catch (err) {
      setError('حدث خطأ أثناء بدء الاشتراك، حاول مرة أخرى.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>الاشتراك الشهري</h1>
      <p>اشترك الآن للوصول إلى جميع المزايا مقابل 10 دولار شهريًا.</p>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070ba',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'جارٍ التحميل...' : 'اشترك الآن'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Subscribe;