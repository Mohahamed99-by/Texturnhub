"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Building2, MapPin, Bookmark, Share2, Package2, Scale, BadgeCheck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue (common with Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MiniMap component with zoom and drag support
const MiniMap = ({ latitude, longitude, material_type, location }) => {
  if (!latitude || !longitude) return null;

  return (
    <div className="relative overflow-hidden rounded-lg shadow-sm">
      <MapContainer
        center={[latitude, longitude]}
        zoom={10}
        style={{ height: "180px", width: "100%" }}
        dragging={true}
        zoomControl={true}
        scrollWheelZoom={true}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-800">{material_type}</h3>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute top-0 left-0 z-20 bg-white/90 backdrop-blur-sm m-2 px-2 py-1 rounded text-xs font-medium text-gray-700 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

const OfferCard = ({ offer, onSaveToggle, isSaved }) => {
  const baseUrl = "https://texturnhub-backenn-3.onrender.com";
  const imageUrl = offer.image_url_1?.startsWith("http") ? offer.image_url_1 : `${baseUrl}/${offer.image_url_1}`;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/offers/${offer.offer_id}`;
    const shareData = {
      title: `${offer.material_type} - ${offer.company_name}`,
      text: `Check out this offer: ${offer.material_type}, ${offer.quantity} kg, ${offer.material_condition} condition in ${offer.location}`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log("Offer shared successfully");
      } catch (error) {
        console.error("Error sharing offer:", error.message);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Offer link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error.message);
        alert("Failed to copy link. Please try again.");
      }
    }
  };

  const handleContact = async () => {
    const token = localStorage.getItem('token');
    const senderId = parseInt(localStorage.getItem('company_id'));

    if (!token) {
      setError('Please log in to contact');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('https://texturnhub-backenn-3.onrender.com/messages', {
        receiver_id: offer.company_id,
        content: `I'm interested in your offer: ${offer.material_type}, ${offer.quantity} kg. Let's discuss!`,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Message sent successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 w-full transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-56 sm:h-64">
        {offer.image_url_1 ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={offer.material_type}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=400&width=600";
              console.error(`Failed to load image: ${imageUrl}`);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <Package2 className="text-emerald-400 h-16 w-16 opacity-75" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => onSaveToggle(offer.offer_id)}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isSaved ? "bg-emerald-600 text-white" : "bg-white/90 backdrop-blur-sm text-emerald-600"
          } shadow-md hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
          aria-label={isSaved ? "Unsave offer" : "Save offer"}
        >
          <Bookmark className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-semibold text-emerald-800">
          {offer.material_type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-bold text-gray-900 truncate">{offer.company_name}</h4>
          <span className="text-sm text-gray-500">{formatDate(offer.created_at)}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Building2 className="text-emerald-500 h-4 w-4" />
            <span className="truncate">{offer.company_name}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="text-emerald-500 h-4 w-4" />
            <span className="truncate">{offer.location}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1 text-emerald-700">
              <Scale className="h-4 w-4" />
              <p className="text-xs font-medium">Quantity</p>
            </div>
            <p className="font-bold text-gray-900">{offer.quantity} kg</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1 text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              <p className="text-xs font-medium">Condition</p>
            </div>
            <p className="font-bold text-gray-900 capitalize">{offer.material_condition}</p>
          </div>
        </div>
        {/* MiniMap */}
        <MiniMap
          latitude={offer.latitude}
          longitude={offer.longitude}
          material_type={offer.material_type}
          location={offer.location}
        />
        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleContact}
            disabled={loading}
            className={`flex-1 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        {/* Success/Error Messages */}
        {success && <p className="text-emerald-600 text-sm mt-2">{success}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default OfferCard;