import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SavedOffers from '../components/SavedOffers';
import Settings from '../components/Settings';
import Sidebar from '../components/Sidebar';
import OverviewSection from '../components/Dashboard/OverviewSection';
import MyOffersSection from '../components/Dashboard/MyOffersSection';
import MessagesSection from '../components/Dashboard/MessagesSection';
import EditOfferModal from '../components/Dashboard/EditOfferModal';

function Dashboard() {
    const [company, setCompany] = useState(null);
    const [offers, setOffers] = useState([]);
    const [people, setPeople] = useState([]);
    const [savedOffers, setSavedOffers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [retry, setRetry] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const navigate = useNavigate();
    const baseUrl = 'https://texturnhub-backenn-3.onrender.com';

    useEffect(() => {
        const token = localStorage.getItem('token');
        const company_id = localStorage.getItem('company_id');

        if (!token) {
            setError('Please log in to access the dashboard');
            setLoading(false);
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                const companyResponse = await axios.get('https://texturnhub-backenn-3.onrender.com/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompany(companyResponse.data);

                const offersResponse = await axios.get(`https://texturnhub-backenn-3.onrender.com/offers?company_id=${company_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formattedOffers = offersResponse.data.map(offer => ({
                    ...offer,
                    image_url_1: offer.image_url_1?.startsWith('http') ? offer.image_url_1 : `${baseUrl}/${offer.image_url_1}`
                })).filter(offer => offer.company_id === parseInt(company_id));
                setOffers(formattedOffers || []);

                const messagesResponse = await axios.get('https://texturnhub-backenn-3.onrender.com/messages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const uniquePeople = messagesResponse.data.reduce((acc, msg) => {
                    const personId = msg.sender_id === parseInt(company_id) ? msg.receiver_id : msg.sender_id;
                    const personName = msg.sender_id === parseInt(company_id) ? msg.receiver_name : msg.sender_name;
                    if (!acc.find(p => p.id === personId)) {
                        acc.push({ id: personId, name: personName, company: msg.company_name });
                    }
                    return acc;
                }, []);
                setPeople(uniquePeople || []);

                const storedSavedOffers = JSON.parse(localStorage.getItem('savedOffers')) || [];
                setSavedOffers(storedSavedOffers);
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Failed to load data';
                if (error.response?.status === 401) {
                    setError('Invalid or expired token. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (error.response?.status === 500) {
                    setError(`${errorMessage}. Please try again later.`);
                } else {
                    setError(errorMessage);
                }
                console.error('Error details:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate, retry]);

    const handleRetry = () => {
        setError('');
        setRetry(!retry);
    };

    const handleDeleteOffer = async (offerId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete an offer');
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`https://texturnhub-backenn-3.onrender.com/offers/${offerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOffers(offers.filter(offer => offer.offer_id !== offerId));
            setError('');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to delete offer');
        }
    };

    const handleEditOffer = (offer) => {
        setSelectedOffer(offer);
    };

    const handleSaveOffer = (updatedOffer) => {
        setOffers(offers.map(o => o.offer_id === updatedOffer.offer_id ? updatedOffer : o));
        setSelectedOffer(null);
    };

    const handleContact = (companyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        navigate(`/messages?to=${companyId}`);
    };

    const handleRemoveSavedOffer = (offerId) => {
        const updatedSavedOffers = savedOffers.filter(offer => offer.offer_id !== offerId);
        setSavedOffers(updatedSavedOffers);
        localStorage.setItem('savedOffers', JSON.stringify(updatedSavedOffers));
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    if (loading) return <p className="text-gray-500 text-center py-12">Loading...</p>;
    if (error) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <Navbar />
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <p className="text-red-500 text-center">{error}</p>
                <button
                    onClick={handleRetry}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Retry
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-2 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Log In Again
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 pt-16 md:pt-0 px-6 lg:px-8 pb-10 md:ml-64">
                {activeSection === 'overview' && (
                    <OverviewSection company={company} offers={offers} />
                )}
                {activeSection === 'my-offers' && (
                    <MyOffersSection
                        offers={offers}
                        navigate={navigate}
                        onDelete={handleDeleteOffer}
                        onEdit={handleEditOffer}
                    />
                )}
                {activeSection === 'saved-offers' && (
                    <SavedOffers
                        savedOffers={savedOffers}
                        onContact={handleContact}
                        onRemove={handleRemoveSavedOffer}
                    />
                )}
                {activeSection === 'messages' && (
                    <MessagesSection people={people} navigate={navigate} />
                )}
                {activeSection === 'settings' && <Settings />}
            </div>
            {selectedOffer && (
                <EditOfferModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                    onSave={handleSaveOffer}
                />
            )}
        </div>
    );
}

export default Dashboard;