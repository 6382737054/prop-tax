import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// LocationMarker Component
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>Current Location</Popup>
    </Marker>
  ) : null;
};

// Main LocationMap Component
const LocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter = [13.0827, 80.2707]; // Chennai coordinates

  const handleLocationDetection = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = [location.coords.latitude, location.coords.longitude];
        setPosition(newPosition);
        onLocationSelect(newPosition);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

return (
    <div className="space-y-4 w-[50%]"> {/* Removed mx-auto and changed max-w to w for consistent width */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button
          onClick={handleLocationDetection}
          disabled={isLocating}
          className="w-full sm:w-auto px-4 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 
          transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Navigation className="h-4 w-4" />
          {isLocating ? 'Detecting...' : 'Detect Location'}
        </button>
      </div>
  
      <div className="h-[240px] rounded-xl overflow-hidden border-2 border-sky-200">
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
  
      {position && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-sky-200">
            <p className="text-sm text-gray-600">Latitude</p>
            <p className="text-base font-semibold text-black">{position[0].toFixed(6)}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-sky-200">
            <p className="text-sm text-gray-600">Longitude</p>
            <p className="text-base font-semibold text-black">{position[1].toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;