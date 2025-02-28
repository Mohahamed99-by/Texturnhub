import React from 'react';

const StatCard = ({ icon: Icon, title, value }) => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50">
            <Icon className="text-2xl text-emerald-600" />
        </div>
        <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        </div>
    </div>
);

export default StatCard;