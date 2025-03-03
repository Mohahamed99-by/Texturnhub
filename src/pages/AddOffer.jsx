// src/pages/AddOffer.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBox, FaImage, FaMapMarkerAlt, FaTags, FaDollarSign } from 'react-icons/fa';

function AddOffer() {
    const [formData, setFormData] = useState({
        company_id: '',
        material_type: '',
        quantity: '',
        material_condition: 'new',
        price: '',
        location: '',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [checkingSubscription, setCheckingSubscription] = useState(true); // New state for subscription loading
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Check login and subscription status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const company_id = localStorage.getItem('company_id');

        if (!token) {
            setError('Please log in to add an offer');
            navigate('/login');
            return;
        }

        if (company_id) {
            setFormData(prev => ({ ...prev, company_id }));
        }

        // Check subscription status
        const checkSubscription = async () => {
            try {
                const response = await axios.get('https://texturnhub-backenn-3.onrender.com/subscription-status', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsSubscribed(response.data.isSubscribed);
                if (!response.data.isSubscribed) {
                    setError('You need an active subscription to add offers.');
                }
            } catch (err) {
                console.error('Failed to check subscription:', err);
                setIsSubscribed(false);
                setError(err.response?.status === 403 
                    ? 'Access denied: An active subscription is required.'
                    : 'Failed to verify subscription status. Please try again later.');
            } finally {
                setCheckingSubscription(false);
            }
        };

        checkSubscription();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            setError('Please upload an image file');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to add an offer');
            setLoading(false);
            navigate('/login');
            return;
        }

        if (!isSubscribed) {
            setError('An active subscription is required to add offers.');
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });
        if (file) {
            formDataToSend.append('image_url_1', file);
        }

        try {
            const response = await axios.post(
                'https://texturnhub-backenn-3.onrender.com/offers',
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setSuccess(response.data.message);
            setFormData({
                company_id: formData.company_id,
                material_type: '',
                quantity: '',
                material_condition: 'new',
                price: '',
                location: '',
            });
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to add offer. Please check your input.';
            setError(errorMsg);
            if (error.response?.status === 403) {
                setError('Access denied: An active subscription is required.');
                setTimeout(() => navigate('/subscribe'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Create New Material Offer
                    </h2>

                    {checkingSubscription ? (
                        <div className="text-center">Loading subscription status...</div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                                    <p className="text-green-700">{success}</p>
                                </div>
                            )}

                            {isSubscribed === false ? (
                                <div className="text-center">
                                    <p className="text-gray-700 mb-4">You need an active subscription to add offers.</p>
                                    <button
                                        onClick={() => navigate('/subscribe')}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                    >
                                        Subscribe Now
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Material Type
                                            </label>
                                            <div className="relative">
                                                <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                <input
                                                    type="text"
                                                    name="material_type"
                                                    value={formData.material_type}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., Cotton, Polyester"
                                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Quantity (kg)
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                required
                                                step="0.01"
                                                min="0.01"
                                                placeholder="e.g., 500.50"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Material Condition
                                            </label>
                                            <div className="relative">
                                                <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                <select
                                                    name="material_condition"
                                                    value={formData.material_condition}
                                                    onChange={handleChange}
                                                    required
                                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="used">Used</option>
                                                    <option value="scrap">Scrap</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Price (optional)
                                            </label>
                                            <div className="relative">
                                                <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="e.g., 100.00"
                                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="e.g., Casablanca"
                                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Upload Image (optional)
                                            </label>
                                            <div className="relative">
                                                <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent opacity-0 absolute cursor-pointer"
                                                    style={{ zIndex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="absolute top-0 left-0 w-full h-full bg-transparent text-emerald-600 font-medium flex items-center justify-center"
                                                >
                                                    {file ? file.name : 'Choose Image'}
                                                </button>
                                            </div>
                                            {file && (
                                                <div className="mt-2">
                                                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        {file.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard')}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`flex-1 px-6 py-3 rounded-lg text-white transition-colors duration-200 ${
                                                loading
                                                    ? 'bg-emerald-400 cursor-not-allowed'
                                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                            }`}
                                        >
                                            {loading ? 'Creating Offer...' : 'Create Offer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddOffer;