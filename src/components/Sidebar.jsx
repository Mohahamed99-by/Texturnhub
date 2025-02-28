

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTachometerAlt, FaBox, FaBookmark, FaEnvelope, FaCog, FaTimes, FaBars } from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, isSidebarOpen, toggleSidebar }) => {
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [notifications, setNotifications] = useState([]); // لتخزين الإشعارات

    // جلب إشعارات الرسائل غير المقروءة عند ال
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchMessageNotifications = async () => {
            try {
                const response = await axios.get('https://texturnhub-backenn-3.onrender.com/message-notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedNotifications = response.data;
                setNotifications(fetchedNotifications);
                const unreadCount = fetchedNotifications.filter(n => !n.is_read).length;
                setUnreadMessageCount(unreadCount);
            } catch (error) {
                console.error('Failed to fetch message notifications:', error.message);
            }
        };

        fetchMessageNotifications();
        const interval = setInterval(fetchMessageNotifications, 60000); // Poll كل 60 ثانية
        return () => clearInterval(interval);
    }, []);

    // دالة لتحديث الإشعارات إلى "مقروءة" عند النقر على "Messages"
    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const unreadNotifications = notifications.filter(n => !n.is_read);
            if (unreadNotifications.length === 0) {
                setActiveSection('messages');
                toggleSidebar();
                return;
            }

            const updatePromises = unreadNotifications.map(notification =>
                axios.put(`https://texturnhub-backenn-3.onrender.com/message-notifications/${notification.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            );
            await Promise.all(updatePromises);

            // تحديث الحالة محليًا دون إعادة جلب البيانات
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadMessageCount(0);
        } catch (error) {
            console.error('Failed to mark notifications as read:', error.message);
        }

        // الانتقال إلى قسم "Messages" وإغلاق الشريط الجانبي على الجوال
        setActiveSection('messages');
        toggleSidebar();
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="md:hidden px-4 py-3 bg-emerald-800 text-white flex justify-between items-center sticky top-0 z-50">
                <h2 className="text-lg font-bold">Dashboard</h2>
                <button onClick={toggleSidebar} className="text-white">
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-emerald-800 text-white shadow-xl transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:block z-40`}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 hidden md:block text-emerald-100">Dashboard</h2>
                    <nav className="space-y-3">
                        {[
                            { section: 'overview', icon: FaTachometerAlt, label: 'Overview' },
                            { section: 'my-offers', icon: FaBox, label: 'My Offers' },
                            { section: 'saved-offers', icon: FaBookmark, label: 'Saved Offers' },
                            { section: 'messages', icon: FaEnvelope, label: 'Messages', badge: unreadMessageCount, onClick: markAllAsRead }, // دالة مخصصة لـ Messages
                            { section: 'settings', icon: FaCog, label: 'Settings' },
                        ].map(({ section, icon: Icon, label, badge, onClick }) => (
                            <button
                                key={section}
                                onClick={onClick || (() => { setActiveSection(section); toggleSidebar(); })} // استخدام onClick المخصص إن وجد
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeSection === section ? 'bg-emerald-600 text-white' : 'text-emerald-200 hover:bg-emerald-700'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Icon className="mr-3" />
                                    {label}
                                </div>
                                {badge > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default Sidebar;