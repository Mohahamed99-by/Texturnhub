"use client"

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBell, FaTrash, FaPaperPlane, FaCopy, FaArrowLeft, FaSpinner } from 'react-icons/fa';

const MessagesSection = ({ people }) => {
    const [messageNotifications, setMessageNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [newMessage, setNewMessage] = useState({ content: '', receiver_id: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const messagesContainerRef = useRef(null);
    const companyId = parseInt(localStorage.getItem('company_id'));

    // Fetch notifications
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchMessageNotifications = async () => {
            try {
                const response = await axios.get('https://texturnhub-backenn-3.onrender.com/message-notifications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedNotifications = response.data;
                setMessageNotifications(fetchedNotifications);
                setUnreadCount(fetchedNotifications.filter(n => !n.is_read).length);
            } catch (error) {
                console.error('Failed to fetch message notifications:', error.message);
            }
        };

        fetchMessageNotifications();
    }, []);

    // Fetch messages when a person is selected
    const fetchMessages = async (token) => {
        if (!selectedPerson) return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('https://texturnhub-backenn-3.onrender.com/messages', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to load messages';
            if (error.response?.status === 401) {
                setError('Invalid or expired token. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(errorMessage);
            }
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && selectedPerson) {
            fetchMessages(token);
        }
    }, [selectedPerson]);

    // Scroll to bottom of messages with smooth behavior
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedPerson]);

    // Mark notifications as read and select person
    const markAsRead = async (personId, personName) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const relatedNotifications = messageNotifications.filter(n => 
            n.sender_name === personName && !n.is_read
        );

        try {
            const updatePromises = relatedNotifications.map(notification =>
                axios.put(`https://texturnhub-backenn-3.onrender.com/message-notifications/${notification.id}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            );
            await Promise.all(updatePromises);

            setMessageNotifications(prev =>
                prev.map(n => 
                    relatedNotifications.some(m => m.id === n.id) ? { ...n, is_read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - relatedNotifications.length));

            setSelectedPerson(personId);
            setNewMessage({ content: '', receiver_id: personId });
        } catch (error) {
            console.error('Failed to mark notifications as read:', error.message);
        }
    };

    // Send new message
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to send a message');
            navigate('/login');
            return;
        }

        if (!newMessage.receiver_id) {
            setError('No recipient selected');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const response = await axios.post('https://texturnhub-backenn-3.onrender.com/messages', {
                receiver_id: parseInt(newMessage.receiver_id),
                content: newMessage.content,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newMsg = {
                message_id: response.data.id,
                sender_id: companyId,
                receiver_id: parseInt(newMessage.receiver_id),
                content: newMessage.content,
                sent_at: new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage(prev => ({ ...prev, content: '' }));
            setSuccess('Message sent successfully');
            setTimeout(scrollToBottom, 0);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to send message.');
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMessage(prev => ({ ...prev, [name]: value }));
    };

    // Delete message
    const handleDeleteMessage = async (messageId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete a message');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`https://texturnhub-backenn-3.onrender.com/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(prev => prev.filter(msg => msg.message_id !== messageId));
            setSuccess('Message deleted successfully');
            setTimeout(scrollToBottom, 0);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete message');
            console.error('Error deleting message:', error);
        } finally {
            setLoading(false);
        }
    };

    // Copy message
    const handleCopyMessage = (content) => {
        navigator.clipboard.writeText(content)
            .then(() => {
                setSuccess('Message copied to clipboard!');
                setTimeout(() => setSuccess(''), 3000);
            })
            .catch(err => {
                setError('Failed to copy message');
                console.error('Error copying message:', err);
            });
    };

    // Close chat view
    const closeChat = () => {
        setSelectedPerson(null);
        setMessages([]);
        setNewMessage({ content: '', receiver_id: '' });
    };

    // Generate chat list from messages or people
    const getChats = () => {
        const chatMap = new Map();

        // معالجة الرسائل للحصول على آخر رسالة لكل محادثة
        messages.forEach(msg => {
            const otherId = msg.sender_id === companyId ? msg.receiver_id : msg.sender_id;
            const person = people.find(p => p.id === otherId) || { id: otherId, name: `Unknown (${otherId})` };
            
            const existingChat = chatMap.get(otherId);
            const currentTimestamp = new Date(msg.sent_at);

            if (!existingChat || new Date(existingChat.timestamp) < currentTimestamp) {
                chatMap.set(otherId, {
                    id: otherId,
                    name: person.name,
                    last_message: msg.content,
                    timestamp: msg.sent_at,
                    unread: messageNotifications.filter(n => n.sender_name === person.name && !n.is_read).length,
                });
            }
        });

        // إضافة الأشخاص الذين لم يتم الدردشة معهم بعد
        people.forEach(p => {
            if (!chatMap.has(p.id)) {
                chatMap.set(p.id, {
                    id: p.id,
                    name: p.name,
                    last_message: '',
                    timestamp: null,
                    unread: messageNotifications.filter(n => n.sender_name === p.name && !n.is_read).length,
                });
            }
        });

        return Array.from(chatMap.values()).sort((a, b) => {
            if (b.timestamp && a.timestamp) {
                return new Date(b.timestamp) - new Date(a.timestamp); // أحدث رسالة أولاً
            }
            return b.unread - a.unread; // إذا لم تكن هناك رسائل، رتب حسب عدد الرسائل غير المقروءة
        });
    };

    return (
        <div className="flex flex-col h-[80vh] bg-gray-100 rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-1">
                {/* Chat List (Left Sidebar) */}
                <div className={`w-full md:w-1/3 bg-white border-r border-gray-200 overflow-y-auto ${selectedPerson ? 'hidden md:block' : 'block'}`}>
                    <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FaUsers className="text-xl" />
                            <h2 className="text-xl font-semibold">Chats</h2>
                        </div>
                        {unreadCount > 0 && (
                            <div className="flex items-center space-x-2">
                                <FaBell className="text-xl animate-pulse" />
                                <span className="text-sm bg-green-800 px-2 py-1 rounded-full">{unreadCount}</span>
                            </div>
                        )}
                    </div>
                    {people.length === 0 && messages.length === 0 ? (
                        <div className="text-center py-10">
                            <FaUsers className="mx-auto text-4xl text-gray-400 mb-2" />
                            <p className="text-gray-600">No chats yet</p>
                        </div>
                    ) : (
                        getChats().map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => markAsRead(chat.id, chat.name)}
                                className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200 ${selectedPerson === chat.id ? 'bg-gray-200' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                    {chat.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1 ml-3 overflow-hidden">
                                    <p className="font-semibold text-gray-800 truncate">{chat.name}</p>
                                    <p className="text-sm text-gray-600 truncate">{chat.last_message || 'No messages'}</p>
                                </div>
                                {chat.timestamp && (
                                    <span className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                )}
                                {chat.unread > 0 && (
                                    <span className="ml-2 bg-green-600 text-white text-xs font-semibold rounded-full px-2 py-1">{chat.unread}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Chat View (Right Panel) */}
                {selectedPerson && (
                    <div className="w-full md:w-2/3 flex flex-col bg-gray-100">
                        {/* Chat Header */}
                        <div className="bg-green-600 text-white p-4 flex items-center justify-between shadow-md">
                            <div className="flex items-center space-x-3">
                                <button onClick={closeChat} className="md:hidden text-white hover:text-gray-200">
                                    <FaArrowLeft className="text-xl" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                                    {people.find(p => p.id === selectedPerson)?.name[0].toUpperCase() || 'U'}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {people.find(p => p.id === selectedPerson)?.name || `Unknown (ID: ${selectedPerson})`}
                                </h3>
                            </div>
                        </div>

                        {/* Messages Area */}
                        {loading && !messages.length ? (
                            <p className="text-gray-500 text-center py-4">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center py-4">{error}</p>
                        ) : (
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 p-4 overflow-y-auto bg-gray-100 flex flex-col-reverse"
                                style={{ maxHeight: 'calc(80vh - 140px)' }}
                            >
                                <div className="flex flex-col space-y-2">
                                    {messages
                                        .filter(msg => 
                                            (msg.sender_id === selectedPerson && msg.receiver_id === companyId) ||
                                            (msg.receiver_id === selectedPerson && msg.sender_id === companyId)
                                        )
                                        .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
                                        .map(msg => (
                                            <div
                                                key={msg.message_id}
                                                className={`max-w-[70%] p-3 rounded-lg shadow relative group ${
                                                    msg.sender_id === companyId
                                                        ? 'bg-green-500 text-white ml-auto rounded-br-none'
                                                        : 'bg-white text-gray-800 mr-auto rounded-bl-none'
                                                }`}
                                            >
                                                <p className="text-sm">{msg.content || 'No content'}</p>
                                                <p className="text-xs mt-1 opacity-75 text-right">
                                                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                                    <button onClick={() => handleCopyMessage(msg.content)} title="Copy">
                                                        <FaCopy className="text-gray-600 hover:text-gray-800" />
                                                    </button>
                                                    <button onClick={() => handleDeleteMessage(msg.message_id)} title="Delete">
                                                        <FaTrash className="text-red-500 hover:text-red-700" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Message Input */}
                        {selectedPerson && !error && (
                            <form onSubmit={handleSubmit} className="p-4 bg-white flex items-center space-x-2 border-t border-gray-200">
                                <input
                                    type="text"
                                    name="content"
                                    value={newMessage.content}
                                    onChange={handleChange}
                                    placeholder="Type a message"
                                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.content}
                                    className={`p-2 text-green-600 rounded-full hover:bg-green-100 transition-colors ${
                                        loading || !newMessage.content ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? <FaSpinner className="animate-spin text-xl" /> : <FaPaperPlane className="text-xl" />}
                                </button>
                            </form>
                        )}
                        {success && <p className="text-green-500 text-sm p-2">{success}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesSection;