import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBox, FaMapMarkerAlt, FaBuilding, FaTshirt, FaBookmark } from 'react-icons/fa';

// OfferCard Component - Adjusted for Saved Offers Page
const OfferCard = ({ offer, onContact, onRemove }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
        <div className="p-4 border-b border-gray-100">
            <div className="flex items-start space-x-3">
                {offer.company_logo ? (
                    <img
                        src={offer.company_logo}
                        alt={offer.company_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <FaBuilding className="text-gray-400 text-xl" />
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{offer.company_name}</h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{offer.location}</span>
                        <span>•</span>
                        <span>{new Date(offer.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
                <FaTshirt className="text-gray-400" />
                <h4 className="font-medium text-gray-900">{offer.material_type}</h4>
            </div>
            {offer.image_url_1 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                        src={offer.image_url_1}
                        alt={offer.material_type}
                        className="w-full h-48 object-cover"
                        onError={(e) => { 
                            e.target.src = 'https://via.placeholder.com/400x300'; 
                            console.error(`Failed to load image: ${offer.image_url_1}`); 
                        }}
                    />
                </div>
            )}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="font-medium text-gray-900">{offer.quantity} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Condition</p>
                    <p className="font-medium text-gray-900 capitalize">{offer.material_condition}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onContact(offer.company_id)}
                    className="flex-1 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors duration-200 font-medium text-sm"
                >
                    Contact
                </button>
                <button
                    onClick={() => onRemove(offer.offer_id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                >
                    <FaBookmark /> Remove
                </button>
            </div>
        </div>
    </div>
);

function SavedOffers() {
    const [savedOffers, setSavedOffers] = useState([]);
    const navigate = useNavigate();
    const baseUrl = 'https://texturnhub-backenn-3.onrender.com'; // Adjust based on your backend URL

    useEffect(() => {
        // Load saved offers from localStorage and ensure full image URLs
        const storedSavedOffers = JSON.parse(localStorage.getItem('savedOffers')) || [];
        const formattedOffers = storedSavedOffers.map(offer => ({
            ...offer,
            image_url_1: offer.image_url_1?.startsWith('http') ? offer.image_url_1 : `${baseUrl}/${offer.image_url_1}`
        }));
        setSavedOffers(formattedOffers);
    }, []);

    const handleContact = (companyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        navigate(`/messages?to=${companyId}`);
    };

    const handleRemove = (offerId) => {
        const updatedSavedOffers = savedOffers.filter(offer => offer.offer_id !== offerId);
        setSavedOffers(updatedSavedOffers);
        localStorage.setItem('savedOffers', JSON.stringify(updatedSavedOffers));
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Saved Offers</h1>
                    <Link
                        to="/"
                        className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                    >
                        Back to Home
                    </Link>
                </div>

                {savedOffers.length === 0 ? (
                    <div className="text-center py-12">
                        <FaBox className="mx-auto text-emerald-400 text-5xl mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No saved offers</h3>
                        <p className="text-gray-500">Save offers from the home page to see them here.</p>
                        <Link
                            to="/offers"
                            className="mt-4 inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200"
                        >
                            Browse Offers
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedOffers.map((offer) => (
                            <OfferCard
                                key={offer.offer_id}
                                offer={offer}
                                onContact={handleContact}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedOffers;