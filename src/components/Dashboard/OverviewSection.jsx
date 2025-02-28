import React from 'react';
import { FaBuilding, FaBox, FaBookmark, FaEnvelope } from 'react-icons/fa'; // Updated icons
import StatCard from './StatCard';

const OverviewSection = ({ company, offers, savedOffers, messages }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FaBuilding} title="Company Name" value={company?.name || 'N/A'} />
            <StatCard icon={FaBox} title="Active Offers" value={offers?.length || 0} />
            <StatCard icon={FaBookmark} title="Saved Offers" value={savedOffers?.length || 0} />
            <StatCard icon={FaEnvelope} title="Messages Received" value={messages?.length || 0} />
        </div>
    </div>
);

export default OverviewSection;