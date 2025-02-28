import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    FaHome, FaTachometerAlt, FaBox, FaEnvelope, FaBars, 
    FaTimes, FaSignOutAlt, FaUserCircle, FaBuilding 
} from 'react-icons/fa';
import Notifications from './Notifications'; // Adjust path based on your structure

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [company, setCompany] = useState(null); // State for company profile data
    const isLoggedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch company profile data on mount if logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchCompanyProfile();
        }
    }, [isLoggedIn]);

    const fetchCompanyProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get('https://texturnhub-backenn-3.onrender.com/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompany(response.data); // Assuming response.data contains { name, email, etc. }
        } catch (error) {
            console.error('Failed to fetch company profile:', error.message);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActiveRoute = (route) => {
        return location.pathname === route ? 'bg-emerald-700/50' : '';
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${
                isScrolled
                    ? 'bg-green-800/95 backdrop-blur-sm'
                    : 'bg-gradient-to-r bg-green-800/95 from-green-800 to-green-900'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="flex items-center">
                                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase tracking-wider transition-all duration-300 transform group-hover:scale-105">
                                    Text
                                </span>
                                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 uppercase tracking-wider transition-all duration-300 transform group-hover:scale-105">
                                    urn
                                </span>
                                <span className="ml-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 uppercase tracking-wider transition-all duration-300 transform group-hover:scale-105">
                                    Hub
                                </span>
                            </div>
                            <div className="h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full absolute bottom-3" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <NavLink to="/" icon={FaHome}>Home</NavLink>
                                <NavLink to="/offers" icon={FaBox}>Offers</NavLink>
                                <NavLink to="/dashboard" icon={FaTachometerAlt}>Dashboard</NavLink>
                                <Notifications />
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-700/50 text-white hover:bg-green-800"
                                    >
                                        <FaUserCircle className="mr-2" />
                                        Company
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border border-gray-100 transform transition-all duration-200 z-50">
                                            {company ? (
                                                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                                                    <div className="flex items-center">
                                                        <FaBuilding className="mr-2 text-green-600" />
                                                        <span className="font-medium">
                                                            {company.name || 'Unnamed Company'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <FaEnvelope className="mr-2 text-green-600" />
                                                        <span>{company.email || 'No email available'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-600">
                                                    Loading company info...
                                                </div>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                                            >
                                                <FaSignOutAlt className="mr-2 text-green-600" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-green-700/50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white text-emerald-600 hover:bg-gray-100"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-green-700/50"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed left-0 right-0 top-16 bg-green-800/95 backdrop-blur-sm shadow-lg border-t border-green-700">
                    <div className="px-4 pt-2 pb-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {isLoggedIn ? (
                            <>
                                <MobileNavLink to="/" icon={FaHome}>Home</MobileNavLink>
                                <MobileNavLink to="/offers" icon={FaBox}>Offers</MobileNavLink>
                                <MobileNavLink to="/dashboard" icon={FaTachometerAlt}>Dashboard</MobileNavLink>
                                <Notifications />
                                <div className="relative mt-2">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600"
                                    >
                                        <FaUserCircle className="mr-2" />
                                        Company
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-xl py-2 border border-gray-100 transform transition-all duration-200 z-50">
                                            {company ? (
                                                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                                                    <div className="flex items-center">
                                                        <FaBuilding className="mr-2 text-green-600" />
                                                        <span className="font-medium">
                                                            {company.name || 'Unnamed Company'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mt-1">
                                                        <FaEnvelope className="mr-2 text-green-600" />
                                                        <span>{company.email || 'No email available'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 text-sm text-gray-600">
                                                    Loading company info...
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsDropdownOpen(false);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100"
                                            >
                                                <FaSignOutAlt className="mr-2 text-green-600" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/">Home</MobileNavLink>
                                <MobileNavLink to="/login">Login</MobileNavLink>
                                <Link
                                    to="/register"
                                    className="block w-full px-4 py-3 rounded-lg text-sm font-medium bg-white text-emerald-600 hover:bg-gray-100"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

// Helper Components
const NavLink = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-green-700/50 ${
                isActive ? 'bg-green-700/50' : ''
            }`}
        >
            {Icon && <Icon className="mr-2" />}
            {children}
        </Link>
    );
};

const MobileNavLink = ({ to, icon: Icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`block w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-green-700/50 ${
                isActive ? 'bg-green-700/50' : ''
            }`}
        >
            <div className="flex items-center">
                {Icon && <Icon className="mr-2" />}
                {children}
            </div>
        </Link>
    );
};

export default Navbar;