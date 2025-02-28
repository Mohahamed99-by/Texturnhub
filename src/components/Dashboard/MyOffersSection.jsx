import React from 'react';
import { FaBox } from 'react-icons/fa';
import OfferCard from './OfferCard';

const MyOffersSection = ({ offers, navigate, onDelete, onEdit }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Offers</h2>
            <button
                onClick={() => navigate('/offers/add')}
                className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
                <span>Add New Offer</span>
            </button>
        </div>

        {/* Content */}
        {offers.length === 0 ? (
            <div className="text-center py-10 bg-green-50 rounded-xl shadow-inner">
                <FaBox className="mx-auto text-5xl text-green-400 opacity-80 mb-4" />
                <p className="text-gray-700 text-lg font-medium">No offers yet. Create your first offer!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {offers.map((offer) => (
                    <OfferCard
                        key={offer.offer_id}
                        offer={offer}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        )}
    </div>
);

export default MyOffersSection;