"use client"

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';

const HeroSection = ({ onNavigate }) => {
    const navigate = useNavigate();

    const handleInputClick = () => {
        navigate('/offers/add');
    };

    return (
        <div className="relative w-full bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply opacity-30 animate-blob" />
                <div className="absolute top-10 right-0 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000" />
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-16 sm:py-20 lg:py-28">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">
                        Sustainable Textile
                    </span>
                    <br />
                    <span className="text-gray-800">Exchange Hub</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                    Join a community driving sustainability through textile trading and circular innovation
                </p>

                {/* Input with Company Logo */}
                <div className="flex items-center justify-center max-w-3xl mx-auto bg-white rounded-xl shadow-md p-2 transition-all duration-300 hover:shadow-lg border border-emerald-100">
                    {/* Company Logo */}
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                        <Building2 className="text-emerald-500 w-5 h-5" />
                    </div>
                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Start a new offer..."
                        onClick={handleInputClick}
                        onFocus={handleInputClick}
                        readOnly
                        className="flex-1 py-2 px-3 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none cursor-pointer text-sm sm:text-base"
                    />
                    {/* Add Offer Button */}
                    <button
                        onClick={handleInputClick}
                        className="ml-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        <span>Add Offer</span>
                    </button>
                </div>

              
            </div>
        </div>
    );
};

export default HeroSection;