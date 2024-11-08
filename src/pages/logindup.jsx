import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, Phone, Building, LayoutDashboard, MapPin, Camera, X, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../apiConfig/api';
import LocationMap from '../components/locationmap';
import PhotoLocationCapture from '../components/photolocationcapture';

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
const PropertyDetailsForm = ({ onChange, data, propertyPhotos, setPropertyPhotos, previousArea }) => {
  const [hasProfessionalTax, setHasProfessionalTax] = useState(true);
  const [professionalTaxId, setProfessionalTaxId] = useState('');
  const [ebNumberError, setEbNumberError] = useState('');
  const [showEbError, setShowEbError] = useState(false);
  const [taxIdError, setTaxIdError] = useState('');
  const [showTaxIdError, setShowTaxIdError] = useState(false);
  const [employeeCounts, setEmployeeCounts] = useState({
    row1: 0, row2: 0, row3: 0, row4: 0, row5: 0, row6: 0
  });
  const buildingUsageOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "government", label: "Government" },
    { value: "residential", label: "Residential" },
    { value: "educational", label: "Educational" },
    { value: "mixed", label: "Mixed" }
  ];
  const validateTaxId = (value) => {
    if (hasProfessionalTax) {
      if (!value.trim()) {
        setTaxIdError('Professional Tax ID is required');
        return false;
      }
      if (value.length < 5) {
        setTaxIdError('Please enter a valid Professional Tax ID');
        return false;
      }
    }
    setTaxIdError('');
    return true;
  };
  const validateEbNumber = (value) => {
    if (!value) {
      setEbNumberError('Please enter EB number');
      return false;
    }
    if (value.length !== 12) {
      setEbNumberError('EB number must be 12 digits');
      return false;
    }
    setEbNumberError('');
    return true;
  };
  const calculateTax = (employeeCount, taxRate) => {
    if (!employeeCount || !taxRate) return 0;
    return employeeCount * taxRate;
  };
  const handleEmployeeCountChange = (rowKey, value) => {
    const numValue = value === '' ? '' : parseInt(value.replace(/^0+/, '')) || 0;
    setEmployeeCounts(prev => ({
      ...prev,
      [rowKey]: numValue
    }));
  };
  const shouldShowProfessionalTax = data.buildingUsage === 'commercial' || data.buildingUsage === 'mixed';
  const handleUsageChange = (e) => {
    const value = e.target.value;
    onChange('buildingUsage', value);
    if (value !== 'commercial' && value !== 'mixed') {
      setHasProfessionalTax(false);
      setProfessionalTaxId('');
      onChange('hasProfessionalTax', false);
      onChange('professionalTaxId', '');
      setTaxIdError('');
      setShowTaxIdError(false);
    }
  };
  const handleProfessionalTaxToggle = () => {
    const newValue = !hasProfessionalTax;
    setHasProfessionalTax(newValue);
    
    // Update parent state with both values
    onChange('hasProfessionalTax', newValue);
    if (!newValue) {
      setProfessionalTaxId('');
      onChange('professionalTaxId', '');
    }
  };
  
  const handleProfessionalTaxIdChange = (e) => {
    const value = e.target.value;
    setProfessionalTaxId(value);
    // Make sure to update parent state
    onChange('professionalTaxId', value);
  };
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300">
      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Building className="h-6 w-6 text-sky-500" />
        <span className="relative">Property Details</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Build Area as per Records (sq ft)</label>
            <input type="text" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed" value={previousArea || ''} disabled />
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Build Area as Observed (sq ft)</label>
            <input type="number" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" value={data.floorArea || ''} onChange={(e) => onChange('floorArea', e.target.value)} required placeholder="Enter area" />
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">EB Number</label>
            <input
              type="text"
              className={`w-full p-4 border ${ebNumberError && showEbError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
              value={data.ebNumber || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '').slice(0, 12);
                onChange('ebNumber', value);
                if (value.length > 0) {
                  setShowEbError(true);
                  validateEbNumber(value);
                } else {
                  setShowEbError(false);
                  setEbNumberError('');
                }
              }}
              onBlur={() => {
                setShowEbError(true);
                validateEbNumber(data.ebNumber || '');
              }}
              onFocus={() => {
                if (!data.ebNumber) {
                  setShowEbError(false);
                }
              }}
              maxLength={12}
              required
              placeholder="Enter 12 digit EB number"
            />
            {showEbError && ebNumberError && (
              <p className="text-red-500 text-sm mt-1">{ebNumberError}</p>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usage</label>
            <select className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" value={data.buildingUsage || ''} onChange={handleUsageChange} required>
              <option value="">Select Usage</option>
              {buildingUsageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {shouldShowProfessionalTax && (
        <div className="mt-8 border-t border-gray-200">
          <div className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Have Professional Tax Registration?</label>
              <button
                type="button"
                onClick={handleProfessionalTaxToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 ${hasProfessionalTax ? 'bg-green-500' : 'bg-gray-200'} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${hasProfessionalTax ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {hasProfessionalTax ? (
              <div className="w-full md:w-auto md:flex-1 md:max-w-md">
                <input
                  type="text"
                  className={`w-full md:w-[70%] p-4 border ${taxIdError && showTaxIdError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
                  value={professionalTaxId}
                  onChange={handleProfessionalTaxIdChange}
                  onBlur={() => {
                    setShowTaxIdError(true);
                    validateTaxId(professionalTaxId);
                  }}
                  onFocus={() => {
                    if (!professionalTaxId) {
                      setShowTaxIdError(false);
                    }
                  }}
                  required
                  placeholder="Enter Professional Tax ID"
                />
                {showTaxIdError && taxIdError && (
                  <p className="text-red-500 text-sm mt-1">{taxIdError}</p>
                )}
              </div>
            ) : (
              <div className="overflow-auto -mx-8 px-8 sm:mx-0 sm:px-0">
                <div className="min-w-[500px] sm:min-w-0 sm:max-w-2xl bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sl. No.</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Average Half-Yearly Income</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Half-Yearly Tax</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Number of Employees</th>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">1</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Upto Rs. 21,000/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Nil</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row1}
                            onChange={(e) => handleEmployeeCountChange('row1', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Nil</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 21,001/- to 30,000/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 135/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row2}
                            onChange={(e) => handleEmployeeCountChange('row2', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row2, 135)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 30,001/- to 45,000/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 315/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row3}
                            onChange={(e) => handleEmployeeCountChange('row3', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row3, 315)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">4</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 45,001/- to 60,000/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 690/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row4}
                            onChange={(e) => handleEmployeeCountChange('row4', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row4, 690)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 60,001/- to 75,000/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 1025/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row5}
                            onChange={(e) => handleEmployeeCountChange('row5', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row5, 1025)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">6</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 75,001/- and above</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 1250/-</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="number"
                            min="0"
                            className="w-20 p-1 border border-gray-200 rounded"
                            value={employeeCounts.row6}
                            onChange={(e) => handleEmployeeCountChange('row6', e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row6, 1250)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 text-right">Total:</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {Object.values(employeeCounts).reduce((total, count) => total + (parseInt(count) || 0), 0)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          {calculateTax(employeeCounts.row2, 135) + 
                           calculateTax(employeeCounts.row3, 315) + 
                           calculateTax(employeeCounts.row4, 690) + 
                           calculateTax(employeeCounts.row5, 1025) + 
                           calculateTax(employeeCounts.row6, 1250)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Property Photos with Location (Max 3)</label>
        <PhotoLocationCapture 
          onPhotoCaptured={(photos) => {
            console.log('Photos captured:', photos);
            setPropertyPhotos(photos);
          }}
        />
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
  const [buildingStructure, setBuildingStructure] = useState('ac');
  const [buildingType, setBuildingType] = useState('independent');
  const [apartmentFloor, setApartmentFloor] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({
    floorArea: '',
    buildingUsage: '',
    ebNumber: '',
    hasProfessionalTax: false, // Add this
    professionalTaxId: ''      // Add this
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [showMobileError, setShowMobileError] = useState(false);

  const [totalFloors, setTotalFloors] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');
  
  // New states for building/non-building flow
  const [isBuilding, setIsBuilding] = useState(true);
  const [currentUsage, setCurrentUsage] = useState('');

  const [propertyPhotos, setPropertyPhotos] = useState([]);

  
  const [formData, setFormData] = useState({
    zoneId: '',
    wardId: '',
    areaId: '',
    localityId: '',
  });
  const validateMobileNumber = (number) => {
    const isValid = /^[6-9]\d{9}$/.test(number);
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

 // Update the owner verification section in VerificationPage component

 const validateForm = () => {
  const newErrors = {};
  let errorMessage = '';

  // Owner verification check
  if (!ownerVerified && !newOwnerName.trim()) {
    errorMessage += '- Please enter the new owner name\n';
  }

  // Mobile Number validation
  if (!mobileNumber || !validateMobileNumber(mobileNumber)) {
    errorMessage += '- Please enter a valid 10-digit mobile number\n';
  }

  if (isBuilding) {
    // Common Building Validations
    if (!propertyDetails.floorArea) {
      errorMessage += '- Build Area as Observed is required\n';
    }

    if (!propertyDetails.buildingUsage) {
      errorMessage += '- Building usage is required\n';
    }

    if (!propertyDetails.ebNumber || propertyDetails.ebNumber.length !== 12) {
      errorMessage += '- Please enter a valid 12-digit EB number\n';
    }

    // Professional Tax Validation for Commercial/Mixed Usage
    if (propertyDetails.buildingUsage === 'commercial' || propertyDetails.buildingUsage === 'mixed') {
      if (propertyDetails.hasProfessionalTax === true) {
        if (!propertyDetails.professionalTaxId || !propertyDetails.professionalTaxId.trim()) {
          errorMessage += '- Professional Tax ID is required when Professional Tax is enabled\n';
        }
      }
    }

    // Building Type validation
    if (!buildingType) {
      errorMessage += '- Please select a building type\n';
    }

    // Apartment Specific Validations
    if (buildingType === 'apartment') {
      if (!totalFloors) {
        errorMessage += '- Please select total number of floors\n';
      }
      
      if (!apartmentFloor && apartmentFloor !== '0') {
        errorMessage += '- Please select the floor number\n';
      }

      // Roof Structure validation for top floor
      if (apartmentFloor === totalFloors && !buildingStructure) {
        errorMessage += '- Roof structure is required for top floor\n';
      }
    }

    // Independent or Row House Validations
    if (buildingType === 'independent' || buildingType === 'row_house') {
      if (!buildingStructure) {
        errorMessage += '- Roof structure is required\n';
      }
    }

    // Photo validation for all building types
    if (!propertyPhotos || propertyPhotos.length === 0) {
      errorMessage += '- At least one property photo is required\n';
    }

  } else {
    // Non-Building Validations
    if (!currentUsage) {
      errorMessage += '- Please select current usage\n';
    }

    if (!propertyPhotos || propertyPhotos.length === 0) {
      errorMessage += '- At least one property photo is required\n';
    }
  }

  // Handle errors
  if (errorMessage) {
    alert('Please fix the following issues:\n' + errorMessage);
    setErrors(newErrors);
    return true;
  }

  // Clear errors if everything is valid
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
  
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
  
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      // Log current state values
      console.log('Current State Values:', {
        id,
        buildingType,
        totalFloors,
        apartmentFloor,
        propertyDetails,
        mobileNumber,
        propertyPhotos,
        ownerVerified,
        newOwnerName,
        propertyData
      });
  
      // Create payload with validation
      const payload = {
        asst_det_id: parseInt(id),
        owner_det: {
          name: (ownerVerified ? propertyData?.owner : newOwnerName)?.trim() || '',
          mobile: mobileNumber?.toString()?.trim() || ''
        },
        str_det: {
          type: buildingType === 'independent' ? 'Individual House' :
                buildingType === 'row_house' ? 'Row House' : 'Apartment',
          floors: totalFloors ? `${totalFloors} Floors` : '0 Floors',
          prop_floor: apartmentFloor === '0' ? 'Ground Floor' :
                     apartmentFloor ? `${apartmentFloor}${
                       apartmentFloor === '1' ? 'st' :
                       apartmentFloor === '2' ? 'nd' :
                       apartmentFloor === '3' ? 'rd' : 'th'} Floor` : 'Ground Floor'
        },
        area: (propertyDetails?.floorArea || '0').toString(),
        usage: (propertyDetails?.buildingUsage === 'residential' ? 'Residential' :
               propertyDetails?.buildingUsage === 'commercial' ? 'Commercial' :
               propertyDetails?.buildingUsage === 'mixed' ? 'Mixed' :
               propertyDetails?.buildingUsage === 'government' ? 'Government' :
               propertyDetails?.buildingUsage === 'educational' ? 'Educational' : 'Residential'),
        eb_num: (propertyDetails?.ebNumber || '').toString(),
        images: {
          image1: '',
          image2: ''
        }
      };
  
      // If there's professional tax info, add it
      if (['commercial', 'mixed'].includes(propertyDetails?.buildingUsage?.toLowerCase())) {
        payload.prof_tax = {
          has_tax: Boolean(propertyDetails?.hasProfessionalTax),
          tax_id: propertyDetails?.professionalTaxId?.toString() || ''
        };
      }
  
      // Log the final payload
      console.log('Final Payload:', JSON.stringify(payload, null, 2));
  
      // Make the request
      const response = await api.post('/survey', payload, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
  
      // Log the response
      console.log('API Response:', response);
  
      if (!response.data.error) {
        // Store form data before navigating
        localStorage.setItem('formData', JSON.stringify({
          ward_id: propertyData.ward_id,
          area_id: propertyData.area_id,
          locality_id: propertyData.loc_id,
          street_id: propertyData.street_id
        }));

        // Set flag to indicate we're coming from verification
        sessionStorage.setItem('fromVerification', 'true');

        setShowSuccessNotification(true);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to submit');
      }
  
    } catch (error) {
      // Enhanced error logging
      console.error('Complete Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
        config: error.config
      });
  
      // Log the request that caused the error
      if (error.config) {
        console.log('Failed Request Config:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: JSON.parse(error.config.data) // Assuming data is JSON string
        });
      }
  
      if (error.response) {
        console.log('Error Response:', error.response.data);
        alert(`Server error: ${error.response.data?.message || 'Unknown server error occurred'}`);
      } else if (error.request) {
        console.log('No Response Received:', error.request);
        alert('No response received from server. Please try again.');
      } else {
        console.log('Error Setup:', error.message);
        alert(error.message || 'Failed to submit verification. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // Make sure these helper functions are present
  const compressImage = async (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Target size
        const maxWidth = 800;
        const maxHeight = 800;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate dimensions
        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress with relatively low quality
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = dataUrl;
    });
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
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
      <div className="grid grid-cols-1 gap-4">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-bold text-gray-700">Zone Name</p>
            <p className="text-xs font-medium text-gray-500">{propertyData.zone_name}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Area</p>
            <p className="text-xs font-medium text-gray-500">{propertyData.area_name}</p>
          </div>
          <div>
        <p className="text-sm font-bold text-gray-700">Locality</p>
        <p className="text-xs font-medium text-gray-500">{propertyData.loc_name}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">Ward Number</p>
        <p className="text-xs font-medium text-gray-500">{propertyData.ward_name}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">Street</p>
        <p className="text-xs font-medium text-gray-500">{propertyData.street_name}</p>
      </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Assessment Number</p>
            <p className="text-xs font-medium text-gray-500">{propertyData.asst_ref}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Door No</p>
            <p className="text-xs font-medium text-gray-500">{propertyData.new_door}</p>
          </div>
          <div>
        <p className="text-sm font-bold text-gray-700">Usage</p>
        <p className="text-xs font-medium text-gray-500">{propertyData.usage_type}</p>
      </div>
          <div>
        <p className="text-sm font-bold text-gray-700">Build Area</p>
        <p className="text-xs font-medium text-gray-500">{propertyData.build_area} sq.ft</p>
      </div>
        </div>
        
    
        
        {/* Second Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
  
  
     
    </div>

    {/* Third Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    
   
    </div>
  </div>
</div>
</div>
</DetailSection>
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

    {/* Changed max-w-[800px] to max-w-[50%] */}
    <div className="space-y-4 max-w-full md:max-w-[30%] md:mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center ">
          <p className="text-sm text-gray-600 ml-2 ">Is this owner name correct</p>
          <button
            onClick={() => {
              setOwnerVerified(!ownerVerified);
              if (!ownerVerified) setNewOwnerName('');
            }}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full ml-3
              ${ownerVerified ? 'bg-green-500' : 'bg-gray-200'}
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
            `}
          >
            <span className="sr-only">Toggle owner verification</span>
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
                ${ownerVerified ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
          <span className="ml-2 text-sm text-gray-600">
            {ownerVerified ? 'Yes' : 'No'}
          </span>
        </div>
      </div>


      {/* Owner Name Input (Always visible but conditionally disabled) */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
  <input
    type="text"
    value={newOwnerName}
    onChange={(e) => {
      // Only allow letters and spaces
      const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
      setNewOwnerName(value);
    }}
    onKeyPress={(e) => {
      // Prevent typing numbers and special characters
      if (!/[A-Za-z\s]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    disabled={ownerVerified}
    className={`flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm ${
      ownerVerified ? 'bg-gray-100' : 'bg-white'
    }`}
    pattern="[A-Za-z\s]+"
    placeholder="Enter owner name"
  />
</div>
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
        <option value="independent">Induvidual House</option>
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
    setApartmentFloor('');
  }}
  required
>
<option value="">Select Total Floors</option>
      {[...Array(9)].map((_, i) => ( // Changed from 10 to 9 and start index from 1
        <option key={i + 1} value={i + 1}>
          G+{i + 1}  {/* Changed to start from G+1 */}
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
    { <div className="space-y-3">
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
    </div>}



    {/* Added EB Number field */}
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        EB Numbers
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
        {isBuilding && (
  <DetailSection title="Property Details as Observed">
    <PropertyDetailsForm
      onChange={handlePropertyDetailsChange}
      data={propertyDetails}
      propertyPhotos={propertyPhotos}
      setPropertyPhotos={setPropertyPhotos}
      previousArea={propertyData.build_area} // Add this to pass build area
    />
  </DetailSection>
)}


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