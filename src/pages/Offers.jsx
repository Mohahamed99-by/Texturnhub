"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import OfferCard from "../components/Offers/OfferCard"
import HeroSection from "../components/Offers/HeroSection"
import CompanyProfile from "../components/Offers/CompanyProfile"
import {
  MapPinIcon,
  ShirtIcon,
  FactoryIcon,
  SearchIcon,
  BookmarkIcon,
  ArchiveIcon,
  UserIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Offers() {
  const [offers, setOffers] = useState([])
  const [company, setCompany] = useState(null)
  const [locationFilter, setLocationFilter] = useState("")
  const [materialTypeFilter, setMaterialTypeFilter] = useState("")
  const [industryFilter, setIndustryFilter] = useState("")
  const [savedOffers, setSavedOffers] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedSavedOffers = JSON.parse(localStorage.getItem("savedOffers")) || []
    setSavedOffers(storedSavedOffers)
    fetchOffers()
    fetchCompanyProfile()
  
  }, [])

  useEffect(() => {
    const fetchFilteredOffers = async () => {
      setLoading(true)
      try {
        let url = "https://texturnhub-backenn-3.onrender.com/offers"
        const params = new URLSearchParams()
        if (locationFilter) params.append("location", locationFilter.trim())
        if (materialTypeFilter) params.append("material_type", materialTypeFilter.trim())
        if (industryFilter) params.append("company_type", industryFilter.trim())
        if (params.toString()) url += `?${params.toString()}`
        const response = await axios.get(url, { timeout: 5000 })
        const data = Array.isArray(response.data) ? response.data : []
        setOffers(data.map((offer) => ({ ...offer, image_url: offer.image_url_1 || offer.image_url })))
        setError("")
      } catch (error) {
        setError(error.response?.data?.error || "Failed to load offers. Please try again later.")
        console.error("Error fetching offers:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredOffers()
  }, [locationFilter, materialTypeFilter, industryFilter])

  const fetchOffers = async () => {
    setLoading(true)
    try {
      let url = "https://texturnhub-backenn-3.onrender.com/offers"
      const params = new URLSearchParams()
      if (locationFilter) params.append("location", locationFilter.trim())
      if (materialTypeFilter) params.append("material_type", materialTypeFilter.trim())
      if (industryFilter) params.append("company_type", industryFilter.trim())
      if (params.toString()) url += `?${params.toString()}`
      const response = await axios.get(url, { timeout: 5000 })
      const data = Array.isArray(response.data) ? response.data : []
      setOffers(data.map((offer) => ({ ...offer, image_url: offer.image_url_1 || offer.image_url })))
      setError("")
    } catch (error) {
      setError(error.response?.data?.error || "Failed to load offers. Please try again later.")
      console.error("Error fetching offers:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.get("https://texturnhub-backenn-3.onrender.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCompany(response.data)
    } catch (error) {
      console.error("Error fetching company profile:", error.message)
      if (error.response?.status === 401) {
        setError("Please log in to view your profile.")
        navigate("/login")
      }
    }
  }

 
 

  const handleSaveToggle = (offerId) => {
    const offerToSave = offers.find((offer) => offer.offer_id === offerId)
    let updatedSavedOffers
    if (savedOffers.some((saved) => saved.offer_id === offerId)) {
      updatedSavedOffers = savedOffers.filter((saved) => saved.offer_id !== offerId)
    } else {
      updatedSavedOffers = [...savedOffers, offerToSave]
    }
    setSavedOffers(updatedSavedOffers)
    localStorage.setItem("savedOffers", JSON.stringify(updatedSavedOffers))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row items-start max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Company Profile */}
        <div className="w-full lg:w-72 lg:sticky lg:top-20 lg:h-auto z-40">
          {company ? (
            <CompanyProfile company={company} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
              <p className="text-center text-gray-700 font-medium">Log in to view your profile</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full lg:flex-1 lg:max-w-3xl">
          <div className="space-y-6">
            <HeroSection onNavigate={navigate} />

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Find Textile Offers</h2>
              <div className="space-y-4">
                <div className="relative">
                  <MapPinIcon className="absolute top-3 left-3 h-5 w-5 text-emerald-600" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Location (e.g., USA, Europe)"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <ShirtIcon className="absolute top-3 left-3 h-5 w-5 text-emerald-600" />
                  <select
                    value={materialTypeFilter}
                    onChange={(e) => setMaterialTypeFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition-all duration-200 appearance-none"
                  >
                    <option value="">Material Type</option>
                    <option value="cotton">Cotton</option>
                    <option value="polyester">Polyester</option>
                    <option value="wool">Wool</option>
                  </select>
                </div>
                <div className="relative">
                  <FactoryIcon className="absolute top-3 left-3 h-5 w-5 text-emerald-600" />
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 transition-all duration-200 appearance-none"
                  >
                    <option value="">Industry</option>
                    <option value="producer">Producer</option>
                    <option value="recycler">Recycler</option>
                  </select>
                </div>
                <button
                  onClick={fetchOffers}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-md hover:bg-emerald-700 transition-all duration-200 font-medium shadow flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <SearchIcon className="h-4 w-4" /> Search
                </button>
              </div>
            </div>

            {/* Saved Offers Link */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Available Offers</h2>
              <Link
                to="/saved-offers"
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-all duration-200"
              >
                <BookmarkIcon className="h-4 w-4" /> Saved ({savedOffers.length})
              </Link>
            </div>

            {/* Offers Feed */}
            {error && (
              <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg shadow-sm border border-red-100">
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <ArchiveIcon className="mx-auto text-emerald-400 h-12 w-12 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold text-gray-900">No Offers Found</h3>
                <p className="text-gray-600">Adjust your filters to find available offers.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.offer_id}
                    offer={offer}
                    onSaveTogwgle={handleSaveToggle}
                    isSaved={savedOffers.some((saved) => saved.offer_id === offer.offer_id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offers

