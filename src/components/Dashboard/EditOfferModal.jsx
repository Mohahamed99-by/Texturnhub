import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const EditOfferModal = ({ offer, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        material_type: offer.material_type,
        quantity: offer.quantity,
        material_condition: offer.material_condition,
        price: offer.price || '',
        location: offer.location,
        image_url_1: null,
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image_url_1: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to edit the offer');
            return;
        }

        const data = new FormData();
        if (formData.material_type) data.append('material_type', formData.material_type);
        if (formData.quantity) data.append('quantity', formData.quantity);
        if (formData.material_condition) data.append('material_condition', formData.material_condition);
        if (formData.price !== '') data.append('price', formData.price);
        if (formData.location) data.append('location', formData.location);
        if (formData.image_url_1) data.append('image_url_1', formData.image_url_1);

        try {
            const response = await axios.put(`https://texturnhub-backenn-3.onrender.com/offers/${offer.offer_id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            onSave({ ...offer, ...formData, image_url_1: formData.image_url_1 ? URL.createObjectURL(formData.image_url_1) : offer.image_url_1 });
            onClose();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update offer');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Offer</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 bg-red-50 p-3 rounded-lg mb-6 text-sm font-medium">{error}</p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Material Type</label>
                        <input
                            type="text"
                            name="material_type"
                            value={formData.material_type}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity (kg)</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50"
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
                        <select
                            name="material_condition"
                            value={formData.material_condition}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50"
                            required
                        >
                            <option value="new">New</option>
                            <option value="used">Used</option>
                            <option value="scrap">Scrap</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Price (Optional)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50"
                            placeholder="Leave blank for N/A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-green-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Image (Optional)</label>
                        <input
                            type="file"
                            name="image_url_1"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-200 rounded-lg text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200 transition-all duration-200"
                            accept="image/*"
                        />
                        {offer.image_url_1 && (
                            <img
                                src={offer.image_url_1}
                                alt="Current"
                                className="mt-3 w-full h-40 object-cover rounded-lg shadow-sm"
                            />
                        )}
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOfferModal;