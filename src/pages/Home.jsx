import React from 'react';
import Navbar from '../components/Navbar';
import { 
    FaRecycle, FaIndustry, FaDollarSign, FaLeaf, FaChartLine, 
    FaGlobe, FaHandshake, FaUsers, FaCheckCircle 
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import hero from '../assets/img/hero_sv.jpg';

// HeroSection Component
const HeroSection = ({ onNavigate }) => (
    <div className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        Transform
                        <span className="text-emerald-400 block">Textile Waste</span>
                        Into Value
                    </h1>
                    <p className="text-emerald-100 text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                        Join the leading platform connecting textile manufacturers with recyclers. 
                        Reduce waste, increase profits, and contribute to a sustainable future.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button 
                            onClick={() => onNavigate('/register')}
                            className="px-8 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 
                                     transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg
                                     shadow-lg hover:shadow-xl"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => onNavigate('/about')}
                            className="px-8 py-4 bg-white text-emerald-900 rounded-lg hover:bg-emerald-50
                                     transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg
                                     shadow-lg hover:shadow-xl"
                        >
                            Learn More
                        </button>
                    </div>
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-emerald-200">Companies</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">30K+</p>
                            <p className="text-emerald-200">Tons Recycled</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">25+</p>
                            <p className="text-emerald-200">Countries</p>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <img 
                        src={hero}
                        alt="Textile Recycling Process"
                        className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    </div>
);

// Features Section
const Features = () => (
    <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Why Leading Companies Choose Us
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Join thousands of companies already transforming their textile waste management
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: FaHandshake,
                        title: "Direct Connections",
                        description: "Connect directly with verified recyclers and manufacturers globally"
                    },
                    {
                        icon: FaChartLine,
                        title: "Market Analytics",
                        description: "Access real-time market data and pricing trends"
                    },
                    {
                        icon: FaCheckCircle,
                        title: "Quality Assured",
                        description: "All partners are verified and quality-checked"
                    }
                ].map((feature, index) => (
                    <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <feature.icon className="text-emerald-500 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Testimonials with more engaging design
const Testimonials = () => (
    <div className="py-20 bg-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">
                Trusted by Industry Leaders
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        quote: "Reduced waste management costs by 40% within the first 3 months of joining the platform.",
                        author: "Sarah Chen",
                        role: "Sustainability Director",
                        company: "EcoFibers International"
                    },
                    {
                        quote: "The platform's analytics helped us optimize our recycling process and increase efficiency by 60%.",
                        author: "Michael Rodriguez",
                        role: "Operations Manager",
                        company: "GreenThread Solutions"
                    },
                    {
                        quote: "Found reliable partners for our excess materials and turned waste into a revenue stream.",
                        author: "Emma Thompson",
                        role: "Supply Chain Director",
                        company: "Sustainable Textiles Co"
                    }
                ].map((testimonial, index) => (
                    <div key={index} className="bg-white rounded-xl p-8 shadow-xl relative">
                        <div className="absolute -top-4 left-8 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white" />
                        </div>
                        <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                <p className="text-sm text-emerald-600">{testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Main Home Component
function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <HeroSection onNavigate={navigate} />
            <Features />
          
            <Testimonials />
            <div className="bg-emerald-50 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                        Ready to Transform Your Textile Waste Management?
                    </h2>
                    <button 
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500
                                 transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg"
                    >
                        Join Now - It's Free
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;