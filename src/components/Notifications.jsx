import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaTrash } from 'react-icons/fa'; // أضفنا FaTrash لأيقونة الحذف

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('https://texturnhub-backenn-2.onrender.com/notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedNotifications = response.data;
                setNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
            } catch (error) {
                console.error('Failed to fetch notifications:', error.message);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
        return () => clearInterval(interval);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const markAsRead = async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.put(`https://texturnhub-backenn-3.onrender.com/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, is_read: true } : n
            ));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Failed to mark notification as read:', error.message);
        }
    };

    const deleteNotification = async (notificationId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`https://texturnhub-backenn-3.onrender.com/notifications/${notificationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.filter(n => n.id !== notificationId));
            setUnreadCount(notifications.filter(n => n.id !== notificationId && !n.is_read).length);
        } catch (error) {
            console.error('Failed to delete notification:', error.message);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-white hover:text-emerald-200 focus:outline-none"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No new notifications
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                                        notification.is_read ? 'bg-gray-50' : 'bg-white'
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;