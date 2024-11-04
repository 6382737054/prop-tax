import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, Phone, Building, LayoutDashboard, MapPin, Camera, X } from 'lucide-react';
import api from '../apiConfig/api';

// Keep DetailSection Component exactly the same
const DetailSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
      {title}
    </h3>
    <div className="animate-fadeIn">
      {children}
    </div>
  </div>
);

// Keep DetailItem Component exactly the same
const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-2">
      {Icon && <Icon className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />}
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    <p className="text-lg font-semibold text-gray-900 pl-8">{value}</p>
  </div>
);

// Updated FloorDetailsForm Component with photo upload
const FloorDetailsForm = ({ floorNumber, onChange, data }) => {
  const buildingUsageOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "government", label: "Government" },
    { value: "residential", label: "Residential" },
    { value: "educational", label: "Educational" }
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('You can only upload up to 3 photos');
      return;
    }
    onChange(floorNumber, 'photos', files);
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...(data.photos || [])];
    updatedPhotos.splice(index, 1);
    onChange(floorNumber, 'photos', updatedPhotos);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300">
      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Building className="h-6 w-6 text-blue-500" />
        <span className="relative">
          {floorNumber === 0 ? 'Ground Floor Details' : `Floor ${floorNumber} Details`}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Floor Area (sq ft)
          </label>
          <input
            type="number"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={data.floorArea || ''}
            onChange={(e) => onChange(floorNumber, 'floorArea', e.target.value)}
            required
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Building Usage
          </label>
          <select
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={data.buildingUsage || ''}
            onChange={(e) => onChange(floorNumber, 'buildingUsage', e.target.value)}
            required
          >
            <option value="">Select Usage</option>
            {buildingUsageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            EB Number
          </label>
          <input
            type="number"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={data.ebNumber || ''}
            onChange={(e) => onChange(floorNumber, 'ebNumber', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Floor Photos (Max 3)
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              max="3"
            />
            <Camera className="h-8 w-8 text-gray-400" />
          </label>
          {data.photos && data.photos.map((photo, index) => (
            <div key={index} className="relative w-32 h-32">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Floor ${floorNumber} photo ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VerificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [ownerVerified, setOwnerVerified] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [buildingStructure, setBuildingStructure] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [totalFloors, setTotalFloors] = useState(0);
  const [floorDetails, setFloorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    zoneId: '',
    wardId: '',
    areaId: '',
    localityId: '',
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.authToken;
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await api.get(`/api/v1/asset/detail/${id}`, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        const propertyDetails = response.data.data;
        
        if (propertyDetails) {
          setPropertyData(propertyDetails);
          setFormData({
            zoneId: propertyDetails.zone_id,
            wardId: propertyDetails.ward_id,
            areaId: propertyDetails.area_id,
            localityId: propertyDetails.loc_id,
          });
          setMobileNumber(propertyDetails.mobile_number || '');
          setTotalArea(propertyDetails.build_area || '');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};

    if (!ownerVerified) {
      newErrors.ownerVerified = 'Please verify the owner';
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!totalArea) {
      newErrors.totalArea = 'Total area is required';
    }

    if (!buildingStructure) {
      newErrors.buildingStructure = 'Building structure is required';
    }

    if (!buildingType) {
      newErrors.buildingType = 'Building type is required';
    }

    // Validate floor details
    Object.keys(floorDetails).forEach(floor => {
      if (!floorDetails[floor].floorArea) {
        newErrors[`floor${floor}Area`] = 'Floor area is required';
      }
      if (!floorDetails[floor].buildingUsage) {
        newErrors[`floor${floor}Usage`] = 'Building usage is required';
      }
      if (!floorDetails[floor].ebNumber) {
        newErrors[`floor${floor}EbNumber`] = 'EB number is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => navigate(-1);
  
  const handleSubmit = () => {
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    const submitData = {
      ...formData,
      propertyId: id,
      ownerVerified,
      mobileNumber,
      totalArea,
      buildingStructure,
      buildingType,
      totalFloors,
      floorDetails,
    };
    
    console.log('Submitting data:', submitData);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      navigate(-1);
    }, 2000);
  };

  const handleFloorDetailsChange = (floorNumber, field, value) => {
    setFloorDetails(prev => ({
      ...prev,
      [floorNumber]: {
        ...prev[floorNumber],
        [field]: value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const floorNumbers = Array.from({ length: parseInt(totalFloors) + 1 }, (_, i) => i);

  if (loading || !propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-md backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg group"
              >
                <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <LayoutDashboard className="h-7 w-7 text-blue-500" />
                Property Details Verification
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Owner Verification Section */}
        <DetailSection title="Owner Verification">
          <div className="flex items-center gap-6 mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{propertyData.owner}</p>
          </div>
          <label className="flex items-center gap-4 cursor-pointer p-4 hover:bg-gray-50 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={ownerVerified}
              onChange={(e) => setOwnerVerified(e.target.checked)}
              className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition-colors"
            />
            <span className="text-gray-700 font-medium">I confirm this is the correct owner name</span>
          </label>
          {errors.ownerVerified && (
            <p className="text-red-500 mt-2">{errors.ownerVerified}</p>
          )}
        </DetailSection>

        {/* Property Information Section */}
        <DetailSection title="Property Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Location Details */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="grid gap-6">
                {[
                  { key: 'zoneId', label: 'Zone ID', value: propertyData.zone_id },
                  { key: 'wardId', label: 'Ward ID', value: propertyData.ward_id },
                  { key: 'areaId', label: 'Area ID', value: propertyData.area_id },
                  { key: 'localityId', label: 'Locality ID', value: propertyData.loc_id }
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-300"
                      value={field.value}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem 
                  label="Zone Name" 
                  value={propertyData.zone_name} 
                  icon={MapPin} 
                />
                <DetailItem 
                  label="Ward Name" 
                  value={propertyData.ward_name} 
                  icon={Building} 
                />
                <DetailItem 
                  label="Area Name" 
                  value={propertyData.area_name} 
                  icon={MapPin} 
                />
                <DetailItem 
                  label="Street Name" 
                  value={propertyData.street_name} 
                  icon={MapPin} 
                />
                <DetailItem 
                  label="Locality Name" 
                  value={propertyData.loc_name} 
                  icon={MapPin} 
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem 
                  label="Assessment Ref" 
                  value={propertyData.asst_ref}
                  icon={LayoutDashboard}
                />
                <DetailItem 
                  label="Door Number" 
                  value={propertyData.new_door} 
                  icon={Building} 
                />
                <DetailItem 
                  label="Usage Type" 
                  value={propertyData.usage_type} 
                  icon={Building} 
                />
                <DetailItem 
                  label="Building Area" 
                  value={`${propertyData.build_area} sq.ft`} 
                  icon={LayoutDashboard} 
                />
              </div>
            </div>
          </div>
        </DetailSection>

       {/* Additional Property Details Section */}
       <DetailSection title="Survey Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(value);
                }}
                required
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Total Area (sq ft)
              </label>
              <input
                type="number"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                required
              />
              {errors.totalArea && (
                <p className="text-red-500 text-sm mt-1">{errors.totalArea}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Assessment ID
              </label>
              <input
                type="text"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-300"
                value={propertyData.asst_id}
                readOnly
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Building Type
              </label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="row_house">Row House</option>
                <option value="independent">Independent House</option>
              </select>
              {errors.buildingType && (
                <p className="text-red-500 text-sm mt-1">{errors.buildingType}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Building Structure
              </label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={buildingStructure}
                onChange={(e) => setBuildingStructure(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="ac">AC Sheet</option>
                <option value="tatched">Tatched</option>
                <option value="rcc">RCC Sheet</option>
              </select>
              {errors.buildingStructure && (
                <p className="text-red-500 text-sm mt-1">{errors.buildingStructure}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Total Number of Floors
              </label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
                required
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </DetailSection>

        {/* Floor Details Section */}
        <DetailSection title="Floor-wise Details">
          <div className="grid grid-cols-1 gap-8">
            {floorNumbers.map((floorNumber) => (
              <FloorDetailsForm
                key={floorNumber}
                floorNumber={floorNumber}
                onChange={handleFloorDetailsChange}
                data={floorDetails[floorNumber] || {}}
              />
            ))}
          </div>
        </DetailSection>

        {/* Submit Button */}
        <div className="flex justify-center mt-12 mb-12">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 rounded-xl flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-lg font-semibold group"
          >
            <Check className="h-6 w-6 group-hover:scale-110 transition-transform" />
            Submit Verification
          </button>
        </div>

        {/* Success Notification Modal */}
        {showSuccessNotification && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-96 transform transition-all duration-300 animate-scaleIn">
              <div className="flex items-center justify-between px-8 py-6 border-b">
                <h3 className="text-2xl font-bold text-gray-800">Success</h3>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowSuccessNotification(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="px-8 py-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20 w-20 text-green-500 relative z-10"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xl text-center text-gray-700 font-medium">
                  Your data has been saved successfully!
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 rounded-b-2xl flex justify-end">
                <button
                  className="px-6 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => setShowSuccessNotification(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;