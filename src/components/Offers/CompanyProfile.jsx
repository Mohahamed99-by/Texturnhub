import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Mail, User, ExternalLink, Briefcase, Phone } from 'lucide-react';

const CompanyProfile = ({ company, showViewProfileButton = true }) => {
  // Generate initials from company name for the avatar
  const getInitials = (name) => {
    if (!name) return 'CO';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 w-full max-w-xs transform hover:-translate-y-1">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 relative">
        <div className="flex items-center gap-4">
          {/* Company Avatar */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-white">
            {company?.logo ? (
              <img 
                src={company.logo || "/placeholder.svg"} 
                alt={company?.name || 'Company'} 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder.svg?height=100&width=100';
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                {getInitials(company?.name)}
              </div>
            )}
          </div>
          
          {/* Company Name and Type */}
          <div>
            <h2 
              className="text-xl font-bold text-white truncate" 
              title={company?.name || 'Company Name'}
            >
              {company?.name || 'Company Name'}
            </h2>
            <span className="inline-block text-xs font-medium text-emerald-800 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full mt-2 capitalize shadow-sm">
              {company?.type || 'N/A'}
            </span>
          </div>
        </div>
        
        {/* Decorative pattern */}
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="80" r="20" fill="white" />
            <circle cx="20" cy="80" r="10" fill="white" />
            <circle cx="80" cy="20" r="15" fill="white" />
          </svg>
        </div>
      </div>
      
      {/* Company Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-200">
          <Briefcase className="text-emerald-600 flex-shrink-0 w-5 h-5" />
          <div className="flex-1">
            <p className="text-xs text-emerald-600 font-medium">Company Type</p>
            <p className="text-sm font-semibold text-emerald-900 capitalize">
              {company?.type || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-200">
          <MapPin className="text-emerald-600 flex-shrink-0 w-5 h-5" />
          <div className="flex-1">
            <p className="text-xs text-emerald-600 font-medium">Location</p>
            <p className="text-sm font-semibold text-emerald-900">
              {company?.location || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-200">
          <Mail className="text-emerald-600 flex-shrink-0 w-5 h-5" />
          <div className="flex-1">
            <p className="text-xs text-emerald-600 font-medium">Contact Email</p>
            <p 
              className="text-sm font-semibold text-emerald-900 truncate"
              title={company?.email || 'N/A'}
            >
              {company?.email || 'N/A'}
            </p>
          </div>
        </div>
        
        {company?.phone && (
          <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-200">
            <Phone className="text-emerald-600 flex-shrink-0 w-5 h-5" />
            <div className="flex-1">
              <p className="text-xs text-emerald-600 font-medium">Phone</p>
              <p className="text-sm font-semibold text-emerald-900">
                {company.phone}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with View Profile button */}
      {showViewProfileButton && company?.id && (
        <div className="px-5 pb-5">
          <Link 
            to={`/companies/${company.id}`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
