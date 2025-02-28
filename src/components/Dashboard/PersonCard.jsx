import React from 'react';
import { FaUsers } from 'react-icons/fa';

const PersonCard = ({ person, onClick, unreadCount = 0 }) => (
    <div
        onClick={onClick}
        className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between"
    >
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <FaUsers className="text-emerald-600 text-xl" />
            </div>
            <div>
                <h4 className="font-medium text-gray-900 text-base truncate">{person.name}</h4>
                <span className="text-xs text-gray-500">{person.company}</span>
            </div>
        </div>
        {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-emerald-500 rounded-full">
                {unreadCount}
            </span>
        )}
    </div>
);

export default PersonCard;