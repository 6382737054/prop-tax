import React, { useState, useEffect } from 'react';
import { 
  MapPin, User, Building, Navigation, AlertCircle, 
  MapPinned, CheckCircle
} from 'lucide-react';
import filterData from './filterData.json';

const InputField = ({ label, id, error, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    />
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const SelectField = ({ label, id, options, error, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const SurveyForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [filteredStreets, setFilteredStreets] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [filteredPhoneNumbers, setFilteredPhoneNumbers] = useState([]);
  const [filteredBuildingUsages, setFilteredBuildingUsages] = useState([
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Government', label: 'Government' },
    { value: 'Educational', label: 'Educational' }
  ]);
  const [filteredBuildingStructures, setFilteredBuildingStructures] = useState([]);

  // Get unique ward names from data
  const wardOptions = [...new Set(filterData.data.map(item => item.WardName))].map(ward => ({
    value: ward,
    label: ward
  }));

  // Get unique building structures from data
  const buildingStructureOptions = [...new Set(filterData.data.map(item => item.BuildingType))].map(structure => ({
    value: structure,
    label: structure
  }));

  const [formData, setFormData] = useState({
    wardName: '',
    streetName: '',
    localityName: '',
    ownerName: '',
    phoneNumber: '',
    totalFloors: '',
    latitude: '',
    longitude: '',
    buildingUsage: '',
    buildingStructure: ''
  });

  // Update available streets, localities, owners, and phone numbers when ward changes
  useEffect(() => {
    if (formData.wardName) {
      const filteredData = filterData.data.filter(
        item => item.WardName === formData.wardName
      );
      
      const streets = [...new Set(filteredData.map(item => item.StreetName))].map(street => ({
        value: street,
        label: street
      }));
      setFilteredStreets(streets);

      const localities = [...new Set(filteredData.map(item => item.LocalityName))].map(locality => ({
        value: locality,
        label: locality
      }));
      setFilteredLocalities(localities);

      const owners = [...new Set(filteredData.filter(
        item => item.WardName === formData.wardName
      ).map(item => item.Ownername))].map(owner => ({
        value: owner,
        label: owner
      }));
      setFilteredOwners(owners);

      const phoneNumbers = [...new Set(filteredData.filter(
        item => item.WardName === formData.wardName && item.Ownername === formData.ownerName
      ).map(item => item.PhoneNumber))].map(phoneNumber => ({
        value: phoneNumber,
        label: phoneNumber
      }));
      setFilteredPhoneNumbers(phoneNumbers);
    }
  }, [formData.wardName, formData.ownerName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    // Update phone number based on selected owner
    const filteredData = filterData.data.filter(
      item => item.WardName === formData.wardName && item.Ownername === value
    );
    const phoneNumbers = [...new Set(filteredData.map(item => item.PhoneNumber))].map(phoneNumber => ({
      value: phoneNumber,
      label: phoneNumber
    }));
    setFilteredPhoneNumbers(phoneNumbers);
    setFormData(prev => ({
      ...prev,
      phoneNumber: phoneNumbers.length > 0 ? phoneNumbers[0].value : ''
    }));
  };

  const validateStep = (currentStep) => {
    const errors = {};
    switch (currentStep) {
      case 1:
        if (!formData.wardName) errors.wardName = 'Ward name is required';
        if (!formData.streetName) errors.streetName = 'Street name is required';
        if (!formData.localityName) errors.localityName = 'Locality name is required';
        break;
      case 2:
        if (!formData.ownerName) errors.ownerName = 'Owner name is required';
        if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
        if (!/^\d{10}$/.test(formData.phoneNumber)) errors.phoneNumber = 'Invalid phone number';
        if (!formData.totalFloors) errors.totalFloors = 'Total floors is required';
        break;
      case 3:
        if (!formData.latitude) errors.latitude = 'Latitude is required';
        if (!formData.longitude) errors.longitude = 'Longitude is required';
        break;
      case 4:
        if (!formData.buildingUsage) errors.buildingUsage = 'Building usage is required';
        if (!formData.buildingStructure) errors.buildingStructure = 'Building structure is required';
        break;
      default:
        break;
    }
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length === 0) {
      if (step === 4) {
        handleSubmit();
      } else {
        setStep((prevStep) => prevStep + 1);
        setFormErrors({});
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
      setFormErrors({});
    }
  };

  const determineLocation = () => {
    setIsLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setIsLoading(false);
      },
      (error) => {
        setLocationError('Unable to retrieve location');
        setIsLoading(false);
      }
    );
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-36">
      <div className="bg-white rounded-lg shadow-lg p-8">
      {step > 1 && (
          <button
            onClick={handleBack}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
              <MapPin className="text-blue-500" />
              Location Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectField
                label="Ward Name"
                id="wardName"
                name="wardName"
                value={formData.wardName}
                onChange={handleInputChange}
                options={wardOptions}
                error={formErrors.wardName}
              />
              <SelectField
                label="Street Name"
                id="streetName"
                name="streetName"
                value={formData.streetName}
                onChange={handleInputChange}
                options={filteredStreets}
                error={formErrors.streetName}
                disabled={!formData.wardName}
              />
              <SelectField
                label="Locality Name"
                id="localityName"
                name="localityName"
                value={formData.localityName}
                onChange={handleInputChange}
                options={filteredLocalities}
                error={formErrors.localityName}
                disabled={!formData.wardName}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
              <User className="text-blue-500" />
              Owner Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectField
                label="Owner Name"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                options={filteredOwners}
                error={formErrors.ownerName}
                disabled={!formData.wardName}
              />
              <SelectField
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                options={filteredPhoneNumbers}
                error={formErrors.phoneNumber}
                disabled={!formData.ownerName}
              />
              <SelectField
                label="Total Floors"
                id="totalFloors"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                  { value: '4', label: '4' },
                  { value: '5', label: '5' },
                  { value: '6', label: '6' },
                  { value: '7', label: '7' },
                  { value: '8', label: '8' },
                  { value: '9', label: '9' },
                  { value: '10', label: '10' }
                ]}
                error={formErrors.totalFloors}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
              <MapPinned className="text-blue-500" />
              Location Coordinates
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Latitude"
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleInputChange}
                error={formErrors.latitude}
              />
              <InputField
                label="Longitude"
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleInputChange}
                error={formErrors.longitude}
              />
            </div>
            <button
              onClick={determineLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Navigation className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Getting Location...' : 'Get My Location'}
            </button>
            {locationError && (
              <div className="text-red-500 text-sm">{locationError}</div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
              <Building className="text-blue-500" />
              Building Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Building Usage"
                id="buildingUsage"
                name="buildingUsage"
                value={formData.buildingUsage}
                onChange={handleInputChange}
                options={filteredBuildingUsages}
                error={formErrors.buildingUsage}
              />
              <SelectField
                label="Building Structure"
                id="buildingStructure"
                name="buildingStructure"
                value={formData.buildingStructure}
                onChange={handleInputChange}
                options={buildingStructureOptions}
                error={formErrors.buildingStructure}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg text-white
              ${step === 4 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}
              transition-colors
            `}
          >
            {step === 4 ? (
              <>Submit <CheckCircle size={20} /></>
            ) : (
              <>Next Step →</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;