// src/pages/Subscribe.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to subscribe.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            // Make the subscription request with a proper request body
            const response = await axios.post(
                'https://texturnhub-backenn-3.onrender.com/subscribe',
                { email: 'user@example.com' }, // Request body (optional email)
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const { approvalUrl, subscriptionId } = response.data;
            if (!approvalUrl) {
                throw new Error('No approval URL received from the server');
            }

            console.log('Subscription initiated successfully:', { subscriptionId, approvalUrl });
            window.location.href = approvalUrl; // Redirect to PayPal approval page
        } catch (err) {
            console.error('Subscription request failed:', err.response?.data || err.message);
            const errorMessage = 
                err.response?.data?.details || 
                err.response?.data?.error || 
                err.message || 
                'Failed to initiate subscription. Please try again.';
            setError(errorMessage);

            // Handle specific error cases
            if (err.response?.status === 401 || err.message === 'Please log in to subscribe.') {
                setError('Authentication required. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response?.status === 403) {
                setError('Access denied: Please ensure you have the correct permissions.');
            } else if (err.response?.status === 500) {
                setError('Server error: Unable to process subscription. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Monthly Subscription</h1>
            <p style={{ marginBottom: '1.5rem' }}>
                Subscribe now to access all features for $10 per month.
            </p>
            <button
                onClick={handleSubscribe}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#b0b0b0' : '#0070ba',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s',
                }}
            >
                {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
            {error && (
                <p style={{ color: 'red', marginTop: '10px', fontSize: '0.9rem' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Subscribe;