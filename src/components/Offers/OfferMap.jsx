import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { BuildingIcon, MapPinIcon, ScaleIcon } from "lucide-react"

// Fix Leaflet marker icon issue (common with Webpack)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const OfferMap = ({ offers }) => {
  const defaultCenter = [20, 0] // Approximately the center of the world as default

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <MapContainer center={defaultCenter} zoom={2} style={{ height: "400px", width: "100%" }} className="z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {offers
          .filter((offer) => offer.latitude && offer.longitude)
          .map((offer) => (
            <Marker key={offer.offer_id} position={[offer.latitude, offer.longitude]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{offer.material_type}</h3>
                  <div className="space-y-1">
                    <p className="flex items-center text-sm text-gray-600">
                      <BuildingIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      {offer.company_name}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      {offer.location}
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <ScaleIcon className="h-4 w-4 mr-2 text-emerald-500" />
                      {offer.quantity} kg - {offer.material_condition}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

export default OfferMap

