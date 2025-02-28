import React, { useState } from 'react';
import axios from 'axios';
import { FaBox, FaTrash, FaEnvelope } from 'react-icons/fa';

const OfferCard = ({ offer, onDelete, onEdit }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        onDelete(offer.offer_id);
        setShowConfirm(false);
    };

    const cancelDelete = () => {
        setShowConfirm(false);
    };

    // إرسال رسالة تلقائية عند الضغط على "Contact"
    const handleContact = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to send a message');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post(
                'https://texturnhub-backenn-3.onrender.com/messages',
                {
                    receiver_id: offer.company_id, // افترضت أن offer يحتوي على company_id لصاحب العرض
                    content: "I'm interested in your offer, let's discuss!", // رسالة تلقائية
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess('Message sent successfully!');
            setTimeout(() => setSuccess(''), 3000); // إزالة رسالة النجاح بعد 3 ثوانٍ
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to send message');
            setTimeout(() => setError(''), 3000);
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative transform hover:-translate-y-1">
            {/* Image Section */}
            <div className="relative h-56 sm:h-64">
                {offer.image_url_1 ? (
                    <img
                        src={offer.image_url_1}
                        alt={offer.material_type}
                        className="w-full h-full object-cover rounded-t-2xl"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300';
                            console.error(`Failed to load image: ${offer.image_url_1}`);
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-t-2xl">
                        <FaBox className="text-green-400 text-5xl opacity-75" />
                    </div>
                )}
                <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                        ${offer.material_condition === 'new' ? 'bg-green-100 text-green-800' : offer.material_condition === 'used' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                >
                    {offer.material_condition}
                </span>
            </div>

            {/* Content Section */}
            <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{offer.material_type}</h3>
                    <span className="text-sm text-gray-600">{new Date(offer.created_at).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
                    <div className="bg-green-50 p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Quantity</p>
                        <p className="font-semibold text-gray-900 text-lg">{offer.quantity} kg</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="font-semibold text-gray-900 truncate text-lg">{offer.location}</p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onEdit(offer)}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleContact}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <FaEnvelope /> Contact
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <FaTrash /> Delete
                    </button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <p className="text-green-600 text-sm mt-3 text-center">{success}</p>
                )}
                {error && (
                    <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-20 px-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete "{offer.material_type}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferCard;