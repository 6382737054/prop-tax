import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, MapPin, AlertCircle, Loader } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// LocationMarker Component with drag support
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [position, map]);

  const handleDragEnd = (e) => {
    const newPosition = [e.target._latlng.lat, e.target._latlng.lng];
    setPosition(newPosition);
  };

  return position ? (
    <Marker 
      position={position} 
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    >
      <Popup className="custom-popup">
        <div className="text-center">
          <h3 className="font-semibold">Selected Location</h3>
          <p className="text-sm text-gray-600">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Drag marker to adjust location
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
    <AlertCircle className="h-5 w-5" />
    <p className="text-sm">{message}</p>
  </div>
);

// Main LocationMap Component
const LocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const defaultCenter = [13.0827, 80.2707]; // Chennai coordinates

  // Update parent component with new position
  useEffect(() => {
    if (position) {
      onLocationSelect({
        latitude: position[0],
        longitude: position[1]
      });
    }
  }, [position]);

  const handleLocationDetection = async () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    try {
      const location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const newPosition = [location.coords.latitude, location.coords.longitude];
      setPosition(newPosition);
    } catch (err) {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case err.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred while getting location.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLocating(false);
    }
  };

  // Handle map click to set marker
  const handleMapClick = (e) => {
    setPosition([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button
          onClick={handleLocationDetection}
          disabled={isLocating}
          className="w-full sm:w-auto px-4 py-2.5 bg-sky-500 text-white rounded-lg 
            hover:bg-sky-600 transition-all duration-300 disabled:opacity-50 
            flex items-center justify-center gap-2 text-sm font-medium
            transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLocating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          {isLocating ? 'Detecting Location...' : 'Detect Current Location'}
        </button>
        {position && (
          <p className="text-sm text-gray-500">
            Or drag the marker to adjust location
          </p>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="relative h-[300px] rounded-xl overflow-hidden border-2 border-sky-200 shadow-lg">
        <MapContainer
          center={position || defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {position && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-sky-200 hover:border-sky-400 transition-colors">
            <p className="text-sm text-gray-600">Latitude</p>
            <p className="text-base font-semibold text-black">{position[0].toFixed(6)}</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-sky-200 hover:border-sky-400 transition-colors">
            <p className="text-sm text-gray-600">Longitude</p>
            <p className="text-base font-semibold text-black">{position[1].toFixed(6)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;