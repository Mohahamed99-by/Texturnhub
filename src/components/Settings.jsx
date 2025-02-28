import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { FaIndustry, FaMapMarkerAlt, FaEnvelope, FaBuilding, FaSave, FaTimes } from 'react-icons/fa';

function Settings() {
    const [company, setCompany] = useState({
        name: '',
        email: '',
        location: '',
        type: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchCompanyData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://texturnhub-backenn-3.onrender.com/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompany({
                    name: response.data.name,
                    email: response.data.email,
                    location: response.data.location,
                    type: response.data.type
                });
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load company data');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await axios.put('https://texturnhub-backenn-3.onrender.com/user', company, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Company settings updated successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update company settings');
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-gray-500 text-center py-12">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-lg w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Company Settings</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-emerald-500 text-center mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <FaIndustry className="text-emerald-600" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                name="name"
                                value={company.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-emerald-600" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={company.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FaMapMarkerAlt className="text-emerald-600" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={company.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FaBuilding className="text-emerald-600" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={company.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                required
                            >
                                <option value="producer">Producer</option>
                                <option value="recycler">Recycler</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <FaSave className="mr-2" />
                            Save Changes
                        </button>
                        <Link
                            to="/dashboard"
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            <FaTimes className="mr-2" />
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;