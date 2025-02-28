import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://texturnhub-backenn-3.onrender.com/subscription-status', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsSubscribed(response.data.isSubscribed);
            } catch (error) {
                console.error('Error checking subscription:', error);
                setIsSubscribed(false);
            } finally {
                setLoading(false);
            }
        };

        checkSubscription();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isSubscribed) {
        return <Navigate to="/subscribe" replace />;
    }

    return children;
};

export default ProtectedRoute;
