import React, { useState, useRef } from 'react';
import { Camera, X, MapPin, Upload, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// DraggableMarker component
const DraggableMarker = ({ position, onPositionChange }) => {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange(newPos);
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
};

const PhotoLocationCapture = ({ onPhotoCaptured }) => {
  const [photos, setPhotos] = useState([]);
  const [stream, setStream] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            reject(error);
          },
          { 
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 
          }
        );
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  };

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const location = await getLocation();
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);

      const newPhoto = {
        id: Date.now(),
        dataUrl: compressedDataUrl,
        location: location
      };

      const updatedPhotos = [...photos, newPhoto];
      if (updatedPhotos.length <= 3) {
        setPhotos(updatedPhotos);
        onPhotoCaptured(updatedPhotos);
        setCurrentLocation(location);
        stopCamera();
      } else {
        setError('Maximum 3 photos allowed');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      setError('Failed to capture photo. Please ensure location services are enabled.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    try {
      setIsProcessing(true);
      setError(null);
      const files = Array.from(event.target.files);
      const location = await getLocation();
      
      const remainingSlots = 3 - photos.length;
      const filesToProcess = files.slice(0, remainingSlots);

      const processedPhotos = await Promise.all(filesToProcess.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              const maxSize = 1280;
              if (width > height && width > maxSize) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
              } else if (height > maxSize) {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              resolve({
                id: Date.now() + Math.random(),
                dataUrl: canvas.toDataURL('image/jpeg', 0.6),
                location: location
              });
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      }));

      const updatedPhotos = [...photos, ...processedPhotos];
      setPhotos(updatedPhotos);
      onPhotoCaptured(updatedPhotos);
      setCurrentLocation(location);

      if (files.length > remainingSlots) {
        setError(`Only ${remainingSlots} photo${remainingSlots === 1 ? '' : 's'} could be added. Maximum limit reached.`);
      }
    } catch (error) {
      console.error('Error processing uploaded files:', error);
      setError('Failed to process uploaded files. Please ensure location services are enabled.');
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    onPhotoCaptured(updatedPhotos);
    if (updatedPhotos.length === 0) {
      setCurrentLocation(null);
    }
  };

  const handleMarkerPositionChange = (newPosition) => {
    setCurrentLocation({
      lat: newPosition.lat,
      lng: newPosition.lng
    });
    
    // Update the location in the most recent photo
    const updatedPhotos = photos.map((photo, index) => {
      if (index === photos.length - 1) {
        return {
          ...photo,
          location: {
            lat: newPosition.lat,
            lng: newPosition.lng
          }
        };
      }
      return photo;
    });
    
    setPhotos(updatedPhotos);
    onPhotoCaptured(updatedPhotos);
  };

  return (
    <div className="space-y-6 w-full">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload and Preview Container */}
        <div className="relative">
          {!showCamera ? (
            <div className="w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Status and Upload Section */}
                <div className="w-full">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    {photos.length}/3 photos added
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center mb-4">
                    <button
                      onClick={() => {
                        if (photos.length < 3) {
                          startCamera();
                          setShowCamera(true);
                        }
                      }}
                      disabled={photos.length >= 3 || isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                    >
                      <Camera className={`h-5 w-5 ${photos.length >= 3 ? 'text-gray-300' : 'text-sky-500'}`} />
                      <span className="text-sm font-medium text-gray-600">Take Photo</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photos.length >= 3 || isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                    >
                      <Upload className={`h-5 w-5 ${photos.length >= 3 ? 'text-gray-300' : 'text-sky-500'}`} />
                      <span className="text-sm font-medium text-gray-600">Upload Photo</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={photos.length >= 3 || isProcessing}
                  />
                </div>

                {/* Photos Preview */}
                {photos.length > 0 && (
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map(photo => (
                        <div key={photo.id} className="relative aspect-square">
                          <img
                            src={photo.dataUrl}
                            alt="Captured"
                            className="w-full h-full object-cover rounded-lg shadow-sm"
                          />
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                            disabled={isProcessing}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {photos.length >= 3 ? 'Maximum photos reached' : 'Choose how to add photos'}
                </p>
              </div>
            </div>
          ) : (
            // Camera View
            <>
              <div className="relative h-[400px] rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-4 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:p-4 sm:bg-gradient-to-t sm:from-black/70 sm:to-transparent w-full">
                <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={capturePhoto}
                    disabled={photos.length >= 3 || isProcessing}
                    className="w-full sm:w-auto px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-5 w-5" />
                        <span>Capture {photos.length}/3</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={stopCamera}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          {photos.length > 0 && currentLocation && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-sky-500" />
                <span className="font-semibold text-gray-700">Location</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Latitude</p>
                  <p className="font-mono text-sm font-medium">{currentLocation.lat.toFixed(6)}°</p>

                  </div>
                <div>
                  <p className="text-sm text-gray-600">Longitude</p>
                  <p className="font-mono text-sm font-medium">{currentLocation.lng.toFixed(6)}°</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Drag the marker on the map to update location</p>
            </div>
          )}

          {/* Map */}
          {currentLocation && (
            <div className="h-[200px] rounded-xl overflow-hidden border-2 border-sky-200 shadow-lg">
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker 
                  position={[currentLocation.lat, currentLocation.lng]}
                  onPositionChange={handleMarkerPositionChange}
                />
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoLocationCapture;