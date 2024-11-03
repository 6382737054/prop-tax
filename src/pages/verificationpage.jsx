import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Check, Phone, Building, LayoutDashboard, MapPin } from 'lucide-react';
import filterData from './filterData.json';

// DetailSection Component with enhanced styling
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

// DetailItem Component with enhanced styling
const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-2">
      {Icon && <Icon className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />}
      <label className="text-sm font-semibold text-gray-600">{label}</label>
    </div>
    <p className="text-lg font-semibold text-gray-900 pl-8">{value}</p>
  </div>
);

// Enhanced Floor Details Form Component
const FloorDetailsForm = ({ floorNumber, onChange, data }) => {
  const buildingUsageOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "government", label: "Government" },
    { value: "residential", label: "Residential" },
    { value: "educational", label: "Educational" }
  ];

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
            type="text"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
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
        {/* Enhanced Owner Verification */}
        <DetailSection title="Owner Verification">
          <div className="flex items-center gap-6 mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{propertyData.Ownername}</p>
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
        </DetailSection>

        {/* Enhanced Property Information */}
        <DetailSection title="Property Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="grid gap-6">
                {['zoneId', 'wardId', 'areaId', 'localityId'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('Id', ' ID')}
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all duration-300"
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={`Enter ${field.replace('Id', ' ID')}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem label="Phone Number" value={propertyData.PhoneNumber} icon={Phone} />
                <DetailItem label="Street Name" value={propertyData.StreetName} icon={MapPin} />
                <DetailItem label="Ward Name" value={propertyData.WardName} icon={Building} />
                <DetailItem label="Area Name" value={propertyData.AreaName} icon={MapPin} />
                <DetailItem label="Locality Name" value={propertyData.LocalityName} icon={MapPin} />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <DetailItem 
                  label="Total Build Area" 
                  value={`${propertyData.TotalBuildArea} sq.ft`}
                  icon={LayoutDashboard}
                />
                <DetailItem label="Usage Type" value={propertyData.UsageName} icon={Building} />
                <DetailItem label="Door No" value={propertyData.DoorNo} icon={Building} />
              </div>
            </div>
          </div>
        </DetailSection>



{/* Only this section is modified, everything else stays exactly the same */}
<DetailSection title="Additional Property Details">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        label: "Mobile Number",
        type: "tel",
        value: mobileNumber,
        onChange: setMobileNumber,
      },
      {
        label: "Total Area (sq ft)",
        type: "number",
        value: totalArea,
        onChange: setTotalArea,
      },
      {
        label: "Assessment ID",
        type: "text",
        value: propertyData.AssesmentID,
        readOnly: true,
      }
    ].map((field) => (
      <div key={field.label} className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          {field.label}
        </label>
        <input
          type={field.type}
          className={`w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
            field.readOnly ? 'bg-gray-50' : ''
          }`}
          value={field.value}
          onChange={field.onChange ? (e) => field.onChange(e.target.value) : undefined}
          readOnly={field.readOnly}
        />
      </div>
    ))}

    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Building Structure
      </label>
      <select
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        value={buildingStructure}
        onChange={(e) => setBuildingStructure(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="ac">AC Sheet</option>
        <option value="tatched">Tatched</option>
        <option value="rcc">RCC Sheet</option>
      </select>
    </div>

    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Total Number of Floors
      </label>
      <select
        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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

        {/* Enhanced Submit Button */}
        <div className="flex justify-center mt-12 mb-12">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 rounded-xl flex items-center gap-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-lg font-semibold group"
          >
            <Check className="h-6 w-6 group-hover:scale-110 transition-transform" />
            Submit Verification
          </button>
        </div>
      
        {/* Enhanced Success Notification Modal */}
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

