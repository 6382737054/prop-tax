import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, Phone, Building, LayoutDashboard, MapPin, Camera, X, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../apiConfig/api';
import LocationMap from '../components/locationmap';

// Keep DetailSection Component exactly the same
// Update DetailSection Component
const DetailSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      <div className="h-8 w-1 bg-sky-500 rounded-full"></div> {/* Changed from bg-blue-500 to bg-sky-500 */}
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
      {Icon && <Icon className="h-5 w-5 text-sky-500 group-hover:scale-110 transition-transform duration-300" />}
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    <p className="text-lg font-semibold text-gray-900 pl-8">{value}</p>
  </div>
);

// Updated PropertyDetailsForm Component with photo upload
const PropertyDetailsForm = ({ onChange, data }) => {
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
    onChange('photos', files);
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...(data.photos || [])];
    updatedPhotos.splice(index, 1);
    onChange('photos', updatedPhotos);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300">
      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Building className="h-6 w-6 text-sky-500" />
        <span className="relative">
        
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total  Area (sq ft)
          </label>
          <input
            type="number"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={data.floorArea || ''}
            onChange={(e) => onChange('floorArea', e.target.value)}
            required
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Usage
          </label>
          <select
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={data.buildingUsage || ''}
            onChange={(e) => onChange('buildingUsage', e.target.value)}
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
            onChange={(e) => onChange('ebNumber', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Property Photos (Max 3)
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
                alt={`Property photo ${index + 1}`}
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
  const [ownerVerified, setOwnerVerified] = useState(true);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [buildingStructure, setBuildingStructure] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [apartmentFloor, setApartmentFloor] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [showMobileError, setShowMobileError] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New states for building/non-building flow
  const [isBuilding, setIsBuilding] = useState(true);
  const [currentUsage, setCurrentUsage] = useState('');
  const [currentStructure, setCurrentStructure] = useState('');
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  
  const [formData, setFormData] = useState({
    zoneId: '',
    wardId: '',
    areaId: '',
    localityId: '',
  });

  const validateMobileNumber = (number) => {
    const isValid = /^\d{10}$/.test(number);
    setIsMobileValid(isValid);
    return isValid;
  };

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

        const response = await api.get(`/asset/detail/${id}`, {
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
          const mobileNum = propertyDetails.mobile_number || '';
          setMobileNumber(mobileNum);
          validateMobileNumber(mobileNum);
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

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('You can only upload up to 3 photos');
      return;
    }
    setPropertyPhotos(files);
  };

  const handleOwnerUpdate = () => {
    if (newOwnerName.trim()) {
      // Here you can add the API call to update the owner name
      console.log('Updating owner name to:', newOwnerName);
      // After successful update:
      setOwnerVerified(true);
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...propertyPhotos];
    updatedPhotos.splice(index, 1);
    setPropertyPhotos(updatedPhotos);
  };

  const validateForm = () => {
    const newErrors = {};
    let errorMessage = '';
  
    // Owner Verification
    if (!ownerVerified) {
      errorMessage += '- Please verify the owner\n';
    }
  
    // Mobile Number
    if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
      errorMessage += '- Please enter a valid 10-digit mobile number\n';
    }
  
    // // Total Area
    // if (!totalArea) {
    //   errorMessage += '- Total area is required\n';
    // }
  
    // Location
    if (!userLocation) {
      errorMessage += '- Please detect your current location\n';
    }
  
    // Building Related Validations
    if (isBuilding) {
      // Building Type
      if (!buildingType) {
        errorMessage += '- Please select a building type\n';
      }
  
      // Apartment Specific Validations
      if (buildingType === 'apartment') {
        if (!totalFloors) {
          errorMessage += '- Please select total number of floors\n';
        }
        if (!apartmentFloor) {
          errorMessage += '- Please select the floor number\n';
        }
        if (!propertyDetails.floorArea) {
          errorMessage += '- Total floor area is required\n';
        }
        if (!propertyDetails.buildingUsage) {
          errorMessage += '- Building usage is required\n';
        }
        if (!propertyDetails.ebNumber) {
          errorMessage += '- EB number is required\n';
        }
        if (!propertyDetails.photos || propertyDetails.photos.length === 0) {
          errorMessage += '- At least one property photo is required\n';
        }
        // Roof Structure for top floor
        if (apartmentFloor === totalFloors && !buildingStructure) {
          errorMessage += '- Roof structure is required for top floor\n';
        }
      }
  
      // Independent or Row House Validations
      if (buildingType === 'independent' || buildingType === 'row_house') {
        if (!buildingStructure) {
          errorMessage += '- Building structure is required\n';
        }
        if (!propertyDetails.floorArea) {
          errorMessage += '- Total floor area is required\n';
        }
        if (!propertyDetails.buildingUsage) {
          errorMessage += '- Building usage is required\n';
        }
        if (!propertyDetails.ebNumber) {
          errorMessage += '- EB number is required\n';
        }
        if (!propertyDetails.photos || propertyDetails.photos.length === 0) {
          errorMessage += '- At least one property photo is required\n';
        }
      }
    } else {
      // Non-Building Validations
      // if (!currentUsage) {
      //   errorMessage += '- Please select current usage\n';
      // }
      // if (!currentStructure) {
      //   errorMessage += '- Please select current structure\n';
      // }
      if (!propertyPhotos || propertyPhotos.length === 0) {
        errorMessage += '- At least one property photo is required\n';
      }
    }
  
    // If there are any errors, show them and return true (has errors)
    if (errorMessage) {
      alert('Please fix the following issues:\n' + errorMessage);
      setErrors(newErrors);
      return true;
    }
  
    // Return false if there are no errors
    setErrors({});
    return false;
  };
  const handleBack = () => navigate(-1);
  const handleSubmit = async () => {
    if (validateForm()) {
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Get auth token
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
  
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }
  
      // Prepare the payload
      const payload = {
        asst_det_id: parseInt(id),
        owner_det: {
          name: ownerVerified ? propertyData.owner : newOwnerName,
          mobile: mobileNumber
        },
        str_det: isBuilding ? {
          type: buildingType === 'apartment' ? 'Apartment' :
                buildingType === 'row_house' ? 'Row House' : 'Independent',
          floors: buildingType === 'apartment' ? `${totalFloors} Floors` : null,
          prop_floor: buildingType === 'apartment' ? 
                     `${apartmentFloor === '0' ? 'Ground' : 
                       apartmentFloor === '1' ? '1st' :
                       apartmentFloor === '2' ? '2nd' :
                       apartmentFloor === '3' ? '3rd' :
                       `${apartmentFloor}th`} Floor` : null
        } : null,
        area: totalArea ? totalArea.toString() : "",
        usage: propertyDetails.buildingUsage || "Residential",
        eb_num: propertyDetails.ebNumber || "",
        images: {}
      };
  
      // Store the filter values before making API call
      const filterValues = {
        ward_id: propertyData.ward_id,
        area_id: propertyData.area_id,
        locality_id: propertyData.loc_id,
        street_id: propertyData.street_id
      };
  
      // Save filter values and set reload flag
      localStorage.setItem('surveyFilters', JSON.stringify(filterValues));
      localStorage.setItem('shouldReloadSurvey', 'true');
  
      console.log("Sending data:", payload);
  
      const response = await fetch('https://dmapt.onlinetn.com/api/v1/survey', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        alert('Verification submitted successfully!');
        // Here we're going back to survey form with saved filters
        navigate(-1);
      } else {
        alert('Failed to submit verification: ' + (data.message || 'Unknown error'));
      }
  
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to convert File to base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64,
      reader.onerror = error => reject(error);
    });
  };
  const handlePropertyDetailsChange = (field, value) => {
    setPropertyDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading || !propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  const handleVerificationSubmit = async () => {
    try {
        const response = await fetch('https://dmapt.onlinetn.com/api/v1/survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Add any required data here, for example:
                // key1: value1,
                // key2: value2,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success:", data);
            // Handle successful response here (e.g., show a success message)
        } else {
            console.log("Error:", response.status);
            // Handle error response here (e.g., show an error message)
        }
    } catch (error) {
        console.error("Request failed:", error);
        // Handle network or other errors here
    }
};


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
                <LayoutDashboard className="h-7 w-7 text-sky-500" />
                Property Details Verification
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">


{/* Property Information */}
<DetailSection title="Property Information">
  <button 
    className="lg:hidden w-full flex items-center justify-between p-2 mb-3 text-gray-700 bg-gray-100 rounded-lg"
    onClick={() => setIsMobileExpanded(!isMobileExpanded)}
  >
    <span className="font-semibold">Property Details</span>
    {isMobileExpanded ? (
      <ChevronUp className="h-4 w-4 text-gray-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-500" />
    )}
  </button>

  <div className={`${!isMobileExpanded ? 'hidden lg:block' : ''}`}>
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-x-4 md:gap-y-3">
        {/* First Column - spans full width on mobile, 2 cols on desktop */}
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-x-3 md:gap-y-3">
            <div>
              <p className="text-sm font-bold text-gray-700">Assessment ID</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.asst_ref}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Zone</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.zone_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Zone ID</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.zone_id}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Ward</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.ward_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Ward ID</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.ward_id}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Area</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.area_name}</p>
            </div>
          </div>
        </div>

        {/* Second Column - spans full width on mobile, 2 cols on desktop */}
        <div className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-x-3 md:gap-y-3">
            <div>
              <p className="text-sm font-bold text-gray-700">Area ID</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.area_id}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Street</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.street_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Locality ID</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.loc_id}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Locality</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.loc_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Door No</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.new_door}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Usage</p>
              <p className="text-xs font-medium text-gray-500">{propertyData.usage_type}</p>
            </div>
          </div>
        </div>

        {/* Build Area - spans full width on mobile, 1 col on desktop */}
        <div className="col-span-1">
          <div>
            <p className="text-sm font-bold text-gray-700">Build Area</p>
            <p className="text-xs font-medium text-gray-500">{propertyData.build_area} sq.ft</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</DetailSection>

{/* Owner Verification */}
<DetailSection title="Owner Verification">
  <div className="space-y-4">
    <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-xl">
      <div className="h-12 w-12 bg-sky-500 rounded-full flex items-center justify-center">
        <User className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{propertyData.owner}</h3>
      </div>
    </div>

    <div className="space-y-4 max-w-full md:max-w-[800px] md:mt-4">
      {/* Owner Name Verification with Mobile Input */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-600 ml-2">Is this owner name correct?</p>
          <div className="flex gap-2 ml-3">
            <button
              onClick={() => {
                setOwnerVerified(true);
                setNewOwnerName('');
              }}
              className="px-4 py-1 text-sm font-medium text-white bg-green-500 rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={() => setOwnerVerified(false)}
              className="px-4 py-1 text-sm font-medium text-white bg-red-500 rounded-lg"
            >
              No
            </button>
          </div>
        </div>

        {/* Mobile Number Input - Now at the right end */}
        {/* <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">Enter mobile number:</p>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) setMobileNumber(value);
            }}
            className="w-40 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            placeholder="Enter mobile number"
            maxLength="10"
          />
        </div> */}
      </div>

      {/* Owner Name Input (Conditional) */}
      {!ownerVerified && (
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
          <input
            type="text"
            value={newOwnerName}
            onChange={(e) => setNewOwnerName(e.target.value)}
            className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
            placeholder="Enter correct owner name"
          />
        </div>
      )}
    </div>
  </div>
</DetailSection>
        {/* Survey Details Section */}
        <DetailSection title="Survey Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Mobile Number As Per Property Tax Records
              </label>
              <input
                type="tel"
                pattern="[0-9]{10}"
                className={`w-full p-4 border ${!isMobileValid ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 ${
                  isMobileValid ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'
                } transition-all duration-300`}
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(value);
                  if (value.length === 10) {
                    validateMobileNumber(value);
                  } else {
                    setIsMobileValid(false);
                  }
                }}
                onBlur={() => {
                  validateMobileNumber(mobileNumber);
                  setShowMobileError(true);
                }}
                required
              />
              {(!isMobileValid && showMobileError) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid 10-digit mobile number</p>
              )}
            </div>

            {/* <div className="space-y-3">
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
            </div> */}

            {/* <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Assessment ID
              </label>
              <input
                type="text"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-300"
                value={propertyData.asst_id}
                readOnly
              />
            </div> */}

            {/* Building Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Is this a Building?
              </label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={isBuilding.toString()}
                onChange={(e) => setIsBuilding(e.target.value === 'true')}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {isBuilding ? (
  <>
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Building Type
      </label>
      <select
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        value={buildingType}
        onChange={(e) => {
          setBuildingType(e.target.value);
          setTotalFloors('');
          setApartmentFloor('');
        }}
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
    
    {buildingType === 'apartment' && (
      <>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Total Number of Floors in Apartment
          </label>
          <select
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={totalFloors}
            onChange={(e) => {
              setTotalFloors(e.target.value);
              setApartmentFloor(''); // Reset floor selection when total floors changes
            }}
            required
          >
            <option value="">Select Total Floors</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Floor{i > 0 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {totalFloors && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              In which floor property is present?
            </label>
            <select
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={apartmentFloor}
              onChange={(e) => setApartmentFloor(e.target.value)}
              required
            >
              <option value="">Select Floor</option>
              <option value="0">Ground Floor</option>
              {[...Array(parseInt(totalFloors))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}{i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} Floor
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Show Roof Structure only if selected floor equals total floors */}
        {totalFloors && apartmentFloor === totalFloors && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Roof Structure
            </label>
            <select
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={buildingStructure}
              onChange={(e) => setBuildingStructure(e.target.value)}
              required
            >
              <option value="">Select Type</option>
              <option value="ac">AC Sheet</option>
              <option value="thatched">Thatched</option>
              <option value="rcc">RCC Sheet</option>
            </select>
            {errors.buildingStructure && (
              <p className="text-red-500 text-sm mt-1">{errors.buildingStructure}</p>
            )}
          </div>
        )}
      </>
    )}

    {/* Show Roof Structure directly for independent and row house */}
    {(buildingType === 'independent' || buildingType === 'row_house') && (
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Roof Structure
        </label>
        <select
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          value={buildingStructure}
          onChange={(e) => setBuildingStructure(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="ac">AC Sheet</option>
          <option value="thatched">Thatched</option>
          <option value="rcc">RCC Sheet</option>
        </select>
        {errors.buildingStructure && (
          <p className="text-red-500 text-sm mt-1">{errors.buildingStructure}</p>
        )}
      </div>
    )}
  </>
) : (
  <>
    {/* <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Current Usage
      </label>
      <select
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        value={currentUsage}
        onChange={(e) => setCurrentUsage(e.target.value)}
        required
      >
        <option value="">Select Usage</option>
        <option value="parking">Parking</option>
        <option value="garden">Garden</option>
        <option value="playground">Playground</option>
        <option value="vacant">Vacant Land</option>
      </select>
      {errors.currentUsage && (
        <p className="text-red-500 text-sm mt-1">{errors.currentUsage}</p>
      )}
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Current Structure
      </label>
      <select
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        value={currentStructure}
        onChange={(e) => setCurrentStructure(e.target.value)}
        required
      >
        <option value="">Select Structure</option>
        <option value="open">Open Land</option>
        <option value="fenced">Fenced</option>
        <option value="paved">Paved</option>
        <option value="landscaped">Landscaped</option>
      </select>
      {errors.currentStructure && (
        <p className="text-red-500 text-sm mt-1">{errors.currentStructure}</p>
      )}
    </div> */}

    {/* Added EB Number field */}
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        EB Number
      </label>
      <input
        type="text"
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        value={propertyDetails.ebNumber || ''}
        onChange={(e) => handlePropertyDetailsChange('ebNumber', e.target.value)}
        required
      />
      {errors.ebNumber && (
        <p className="text-red-500 text-sm mt-1">{errors.ebNumber}</p>
      )}
    </div>

                {/* Photo Upload for Non-Building */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Property Photos (1-3)
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
                    {propertyPhotos.map((photo, index) => (
                      <div key={index} className="relative w-32 h-32">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Property photo ${index + 1}`}
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
                  {errors.propertyPhotos && (
                    <p className="text-red-500 text-sm mt-1">{errors.propertyPhotos}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </DetailSection>

    {/* Property Details Section - Only show if isBuilding is true */}
{isBuilding && (
  <DetailSection title="Property Details as Observed">
    <PropertyDetailsForm
      onChange={handlePropertyDetailsChange}
      data={propertyDetails}
    />
  </DetailSection>
)}

{/* Location Map Section */}
<DetailSection title="Location Verification">
  <LocationMap
    onLocationSelect={(location) => {
      setUserLocation(location);
      console.log("Selected location:", location);
    }}
  />
</DetailSection>

{/* Submit Button */}
<div className="flex justify-center mt-12 mb-12">
<button
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-5 py-2 rounded-xl flex items-center gap-3 bg-sky-600 text-white 
  hover:bg-sky-700 transition-all duration-300 transform hover:-translate-y-1 
  hover:shadow-lg text-lg font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? (
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
  ) : (
    <Check className="h-6 w-6 group-hover:scale-110 transition-transform" />
  )}
  {isSubmitting ? 'Submitting...' : 'Submit Verification'}
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