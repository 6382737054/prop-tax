import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, Phone, Building } from 'lucide-react';
import filterData from './filterData.json';

// DetailSection Component for consistent section styling
const DetailSection = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border mb-6 hover:shadow-xl transition-shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
    {children}
  </div>
);

// DetailItem Component for consistent styling
const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="h-4 w-4 text-blue-500" />}
      <label className="text-sm font-medium text-gray-600">{label}</label>
    </div>
    <p className="text-lg font-medium text-gray-900">{value}</p>
  </div>
);

// Floor Details Form Component
const FloorDetailsForm = ({ floorNumber, onChange, data }) => {
  const buildingUsageOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "government", label: "Government" },
    { value: "residential", label: "Residential" },
    { value: "educational", label: "Educational" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border mb-4 hover:shadow-lg transition-shadow">
      <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building className="h-5 w-5 text-blue-500" />
        {floorNumber === 0 ? 'Ground Floor Details' : `Floor ${floorNumber} Details`}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floor Area (sq ft)
          </label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={data.floorArea || ''}
            onChange={(e) => onChange(floorNumber, 'floorArea', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Usage
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={data.buildingUsage || ''}
            onChange={(e) => onChange(floorNumber, 'buildingUsage', e.target.value)}
          >
            <option value="">Select Usage</option>
            {buildingUsageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EB Number
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={data.ebNumber || ''}
            onChange={(e) => onChange(floorNumber, 'ebNumber', e.target.value)}
          />
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
  const [totalFloors, setTotalFloors] = useState(0);
  const [floorDetails, setFloorDetails] = useState({});
  const [formData, setFormData] = useState({
    zoneId: '',
    wardId: '',
    areaId: '',
    localityId: '',
  });

  useEffect(() => {
    const property = filterData.data.find(item => item.id === parseInt(id));
    if (property) {
      setPropertyData(property);
      setFormData({
        zoneId: property.ZoneID,
        wardId: property.WardID,
        areaId: property.AreaID,
        localityId: property.LocalityID,
      });
      setMobileNumber(property.PhoneNumber);
      setTotalArea(property.TotalBuildArea);
    }
  }, [id]);

  const handleBack = () => navigate(-1);
  
  const handleSubmit = () => {
    const submitData = {
      ...formData,
      propertyId: id,
      ownerVerified,
      mobileNumber,
      totalArea,
      buildingStructure,
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

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Property Details Verification</h1>
            </div>
            <div className="flex gap-4">
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Owner Verification */}
        <DetailSection title="Owner Verification">
          <div className="flex items-center gap-4 mb-4">
            <User className="h-8 w-8 text-blue-600" />
            <p className="text-2xl font-bold text-gray-900">{propertyData.Ownername}</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ownerVerified}
              onChange={(e) => setOwnerVerified(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">I confirm this is the correct owner name</span>
          </label>
        </DetailSection>

        {/* Property Information */}
        <DetailSection title="Property Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Details */}
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Zone ID
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={formData.zoneId}
                    onChange={(e) => handleInputChange('zoneId', e.target.value)}
                    placeholder="Enter Zone ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ward ID
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={formData.wardId}
                    onChange={(e) => handleInputChange('wardId', e.target.value)}
                    placeholder="Enter Ward ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Area ID
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={formData.areaId}
                    onChange={(e) => handleInputChange('areaId', e.target.value)}
                    placeholder="Enter Area ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Locality ID
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    value={formData.localityId}
                    onChange={(e) => handleInputChange('localityId', e.target.value)}
                    placeholder="Enter Locality ID"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem label="Phone Number" value={propertyData.PhoneNumber} icon={Phone} />
                <DetailItem label="Street Name" value={propertyData.StreetName} />
                <DetailItem label="Ward Name" value={propertyData.WardName} />
                <DetailItem label="Area Name" value={propertyData.AreaName} />
                <DetailItem label="Locality Name" value={propertyData.LocalityName} />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem 
                  label="Total Build Area" 
                  value={`${propertyData.TotalBuildArea} sq.ft`} 
                />
                <DetailItem label="Usage Type" value={propertyData.UsageName} />
                <DetailItem label="Door No" value={propertyData.DoorNo} />
              </div>
            </div>
          </div>
        </DetailSection>

        {/* Additional Details */}
        <DetailSection title="Additional Property Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Area (sq ft)
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Building Structure
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={buildingStructure}
                onChange={(e) => setBuildingStructure(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="ac">AC Sheet</option>
                <option value="tatched">Tatched</option>
                <option value="rcc">RCC Sheet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Number of Floors
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={totalFloors}
                onChange={(e) => setTotalFloors(e.target.value)}
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </DetailSection>

        {/* Floor Details */}
        <DetailSection title="Floor-wise Details">
          <div className="grid grid-cols-1 gap-6">
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

   ]{/* Submit Button - Centered */}
        <div className="flex justify-center mt-8 mb-8">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Check className="h-6 w-6" />
            Submit
          </button>
        </div>
      
        {/* Success Notification Modal */}
        {showSuccessNotification && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-gray-800">Success</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
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
              <div className="px-6 py-8">
                <div className="flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500"
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
                <p className="text-lg text-center text-gray-700">
                  Your data has been saved successfully!
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-100 text-right rounded-b-lg">
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => setShowSuccessNotification(false)}
                >
                  OK
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