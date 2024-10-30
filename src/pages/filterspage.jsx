import React, { useState, useEffect } from 'react'; 
import { 
  ArrowRight, Building2, MapPin, User, Phone, Buildings, 
  ChevronLeft, CheckCircle, Home, ClipboardCheck, Clock, 
  Users, FileText, ShieldCheck, ArrowLeft, Navigation, MapPinned,
  LayoutGrid, Building, AlertCircle
} from 'lucide-react';

// Feature Component for landing page
const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-center text-sm">{description}</p>
  </div>
);

// Step Indicator Component with active state
const StepIndicator = ({ number, title, description, isActive, isComplete }) => (
  <div className={`flex items-start space-x-4 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
    <div className={`
      flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center font-bold
      transition-all duration-200
      ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}
      text-white
    `}>
      {isComplete ? <CheckCircle size={16} /> : number}
    </div>
    <div>
      <h4 className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
        {title}
      </h4>
      <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-500'}`}>
        {description}
      </p>
    </div>
  </div>
);

// Location Confirmation Modal Component with enhanced UI
const ConfirmationModal = ({ isOpen, onClose, onConfirm, locationDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <MapPinned size={20} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Confirm Your Location</h3>
        </div>
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">Please verify that these coordinates are correct:</p>
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Latitude</span>
              <span className="text-sm font-semibold text-gray-900">{locationDetails.latitude}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Longitude</span>
              <span className="text-sm font-semibold text-gray-900">{locationDetails.longitude}</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <p>These coordinates will be used to mark your building's exact location.</p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm hover:shadow"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

// Summary Table Component with enhanced styling
const SummaryTable = ({ data }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Survey Details</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {Object.entries(data).map(([key, value], index) => (
        <div 
          key={key}
          className={`flex ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="w-1/3 px-6 py-4 text-sm font-medium text-gray-900">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </div>
          <div className="w-2/3 px-6 py-4 text-sm text-gray-500">
            {value || '-'}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ message }) => (
  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
    <AlertCircle size={14} />
    <span>{message}</span>
  </div>
);

// Form Field Components
const InputField = ({ label, id, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    />
  </div>
);

const SelectField = ({ label, id, options, ...props }) => (
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
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ progress, currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
    <div className="mt-2 flex justify-between items-center text-sm">
      <span className="text-gray-600">Progress</span>
      <span className="text-gray-600">Step {currentStep} of {totalSteps}</span>
    </div>
  </div>
);

// Back Button Component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
  >
    <ArrowLeft size={20} className="mr-2" />
    Back
  </button>
);

// Next Button Component
const NextButton = ({ onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      group relative flex items-center gap-2 px-6 py-3 text-white rounded-lg
      transform transition-all duration-200
      ${disabled 
        ? 'bg-gray-300 cursor-not-allowed' 
        : 'bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg'
      }
    `}
  >
    {loading ? (
      <>
        <span className="animate-spin">
          <Clock size={20} />
        </span>
        Processing...
      </>
    ) : (
      <>
        Next Step
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </>
    )}
  </button>
);

const SurveyPage = () => {
    // Constants and Data
    const dropdownOptions = {
      wardNames: ['North Wing', 'South Wing', 'East Wing'],
      streetNames: ['Oak Avenue', 'Maple Street', 'Pine Road'],
      localityNames: ['Green Park', 'River Valley', 'Hill Side'],
      totalFloors: Array.from({length: 10}, (_, i) => i + 1),
      buildingUsage: [
        'Residential',
        'Commercial',
        'Industrial',
        'Educational Institutions',
        'Government Building'
      ],
      buildingStructure: ['AC-SHEET', 'RCC', 'THATCHED']
    };
  
    const features = [
      {
        icon: ClipboardCheck,
        title: "Easy Registration",
        description: "Complete the building survey process in just a few simple steps"
      },
      {
        icon: Clock,
        title: "Quick Process",
        description: "Takes less than 5 minutes to complete all required information"
      },
      {
        icon: ShieldCheck,
        title: "Secure & Official",
        description: "Your data is safely stored in government databases"
      }
    ];
  
    const steps = [
      {
        number: 1,
        title: "Location Details",
        description: "Provide ward, street, and locality information"
      },
      {
        number: 2,
        title: "Owner Information",
        description: "Enter owner details and building specifications"
      },
      {
        number: 3,
        title: "GPS Coordinates",
        description: "Capture exact location coordinates"
      },
      {
        number: 4,
        title: "Building Details",
        description: "Enter building area and usage information"
      }
    ];
  
    // Form States
    const [showSurvey, setShowSurvey] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [showLocationConfirm, setShowLocationConfirm] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [formErrors, setFormErrors] = useState({});
  
    // Form Data States
    const [selectedFilters, setSelectedFilters] = useState({
      wardName: '',
      streetName: '',
      localityName: ''
    });
  
    const [ownerDetails, setOwnerDetails] = useState({
      ownerName: '',
      phoneNumber: '',
      totalFloors: ''
    });
  
    const [locationDetails, setLocationDetails] = useState({
      latitude: '',
      longitude: ''
    });
  
    const [buildingDetails, setBuildingDetails] = useState({
      areaSquareFeet: '',
      buildingUsage: '',
      buildingStructure: ''
    });
  
    // Form Validation
    const validateStep1 = () => {
      const errors = {};
      if (!selectedFilters.wardName) errors.wardName = 'Ward name is required';
      if (!selectedFilters.streetName) errors.streetName = 'Street name is required';
      if (!selectedFilters.localityName) errors.localityName = 'Locality name is required';
      return errors;
    };
  
    const validateStep2 = () => {
      const errors = {};
      if (!ownerDetails.ownerName) errors.ownerName = 'Owner name is required';
      if (!ownerDetails.phoneNumber) errors.phoneNumber = 'Phone number is required';
      else if (!/^\d{10}$/.test(ownerDetails.phoneNumber)) errors.phoneNumber = 'Invalid phone number';
      if (!ownerDetails.totalFloors) errors.totalFloors = 'Total floors is required';
      return errors;
    };
  
    const validateStep3 = () => {
      const errors = {};
      if (!locationDetails.latitude) errors.latitude = 'Latitude is required';
      if (!locationDetails.longitude) errors.longitude = 'Longitude is required';
      return errors;
    };
  
    const validateStep4 = () => {
      const errors = {};
      if (!buildingDetails.areaSquareFeet) errors.areaSquareFeet = 'Area is required';
      else if (isNaN(buildingDetails.areaSquareFeet) || buildingDetails.areaSquareFeet <= 0) 
        errors.areaSquareFeet = 'Please enter a valid area';
      if (!buildingDetails.buildingUsage) errors.buildingUsage = 'Building usage is required';
      if (!buildingDetails.buildingStructure) errors.buildingStructure = 'Building structure is required';
      return errors;
    };
  
    // Event Handlers
    const handleDropdownChange = (e) => {
      const { name, value } = e.target;
      setSelectedFilters(prev => ({
        ...prev,
        [name]: value
      }));
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  
    const handleOwnerDetailsChange = (e) => {
      const { name, value } = e.target;
      setOwnerDetails(prev => ({
        ...prev,
        [name]: value
      }));
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  
    const handleLocationChange = (e) => {
      const { name, value } = e.target;
      setLocationDetails(prev => ({
        ...prev,
        [name]: value
      }));
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  
    const handleBuildingDetailsChange = (e) => {
      const { name, value } = e.target;
      setBuildingDetails(prev => ({
        ...prev,
        [name]: value
      }));
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  
    const determineLocation = () => {
      setIsLoading(true);
      setLocationError('');
  
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser');
        setIsLoading(false);
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocationDetails = {
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          };
          setLocationDetails(newLocationDetails);
          setIsLoading(false);
          setShowLocationConfirm(true);
          setFormErrors({});
        },
        (error) => {
          setLocationError(
            error.code === error.PERMISSION_DENIED
              ? 'Location access denied. Please enable location access or enter coordinates manually.'
              : 'Unable to retrieve your location. Please try again or enter coordinates manually.'
          );
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    };
  
    const validateCurrentStep = () => {
      switch (step) {
        case 1:
          return validateStep1();
        case 2:
          return validateStep2();
        case 3:
          return validateStep3();
        case 4:
          return validateStep4();
        default:
          return {};
      }
    };
  
    const handleNext = () => {
      const errors = validateCurrentStep();
      if (Object.keys(errors).length === 0) {
        setStep(prevStep => prevStep + 1);
        setFormErrors({});
      } else {
        setFormErrors(errors);
      }
    };
  
    const handleBack = () => {
      if (step === 1) {
        setShowSurvey(false);
        setFormErrors({});
      } else {
        setStep(prevStep => prevStep - 1);
        setFormErrors({});
      }
    };
  
    const handleLocationConfirm = () => {
      setShowLocationConfirm(false);
      handleNext();
    };
  
    const handleSubmit = () => {
      const errors = validateStep4();
      if (Object.keys(errors).length === 0) {
        const formData = {
          ...selectedFilters,
          ...ownerDetails,
          ...locationDetails,
          ...buildingDetails
        };
        console.log('Form submitted:', formData);
        setShowSummary(true);
      } else {
        setFormErrors(errors);
      }
    };
  
    // Validation States
    const isStep1Valid = Object.keys(validateStep1()).length === 0;
    const isStep2Valid = Object.keys(validateStep2()).length === 0;
    const isStep3Valid = Object.keys(validateStep3()).length === 0;
    const isStep4Valid = Object.keys(validateStep4()).length === 0;
  
    const getProgress = () => {
      if (!showSurvey) return 0;
      if (step === 1) return isStep1Valid ? 25 : 15;
      if (step === 2) return isStep2Valid ? 50 : 40;
      if (step === 3) return isStep3Valid ? 75 : 65;
      return isStep4Valid ? 100 : 90;
    };
  
    // Summary Data Formatter
    const getSummaryData = () => {
      return {
        "Ward Name": selectedFilters.wardName,
        "Street Name": selectedFilters.streetName,
        "Locality Name": selectedFilters.localityName,
        "Owner Name": ownerDetails.ownerName,
        "Phone Number": ownerDetails.phoneNumber,
        "Total Floors": ownerDetails.totalFloors,
        "Latitude": locationDetails.latitude,
        "Longitude": locationDetails.longitude,
        "Area (sq ft)": buildingDetails.areaSquareFeet,
        "Building Usage": buildingDetails.buildingUsage,
        "Building Structure": buildingDetails.buildingStructure
      };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* Location Confirmation Modal */}
          <ConfirmationModal
            isOpen={showLocationConfirm}
            onClose={() => setShowLocationConfirm(false)}
            onConfirm={handleLocationConfirm}
            locationDetails={locationDetails}
          />
      
          {showSummary ? (
            <div className="max-w-4xl mx-auto py-12 px-4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Survey Complete</h2>
                      <p className="text-gray-600">Thank you for submitting your building details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowSurvey(false);
                      setShowSummary(false);
                      setStep(1);
                      // Reset all form data
                      setSelectedFilters({ wardName: '', streetName: '', localityName: '' });
                      setOwnerDetails({ ownerName: '', phoneNumber: '', totalFloors: '' });
                      setLocationDetails({ latitude: '', longitude: '' });
                      setBuildingDetails({ areaSquareFeet: '', buildingUsage: '', buildingStructure: '' });
                    }}
                    className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start New Survey
                  </button>
                </div>
                <SummaryTable data={getSummaryData()} />
              </div>
            </div>
          ) : !showSurvey ? (
            // Landing Page
            <div className="py-12 px-4">
              <div className="max-w-6xl mx-auto text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-8">
                  <ShieldCheck size={16} className="mr-2" />
                  Official Building Survey Portal
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                  Building Survey Registration
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Help us maintain accurate records of buildings in your area. Complete the survey in just a few minutes.
                </p>
                <button
                  onClick={() => setShowSurvey(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-150 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Building2 size={24} />
                    Start Building Survey
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
              </div>
      
              {/* Features Grid */}
              <div className="max-w-6xl mx-auto mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <Feature key={index} {...feature} />
                  ))}
                </div>
              </div>
      
              Steps Overview
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Survey Process
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {steps.map((stepItem, index) => (
                    <StepIndicator 
                      key={index} 
                      {...stepItem}
                      isActive={false}
                      isComplete={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Survey Form Container
            <div className="max-w-4xl mx-auto py-12 px-4">
              {/* Progress Bar
              <ProgressBar 
                progress={getProgress()}
                currentStep={step}
                totalSteps={4}
              /> */}
      
              <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
                {/* Back Button */}
                <BackButton onClick={handleBack} />
      
           
      
                {/* Form Steps */}
                {step === 1 ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
                      <MapPin className="text-blue-500" />
                      Location Details
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <SelectField
                        label="Ward Name"
                        id="wardName"
                        name="wardName"
                        value={selectedFilters.wardName}
                        onChange={handleDropdownChange}
                        options={dropdownOptions.wardNames}
                        error={formErrors.wardName}
                      />
                      
                      <SelectField
                        label="Street Name"
                        id="streetName"
                        name="streetName"
                        value={selectedFilters.streetName}
                        onChange={handleDropdownChange}
                        options={dropdownOptions.streetNames}
                        error={formErrors.streetName}
                      />
      
                      <SelectField
                        label="Locality Name"
                        id="localityName"
                        name="localityName"
                        value={selectedFilters.localityName}
                        onChange={handleDropdownChange}
                        options={dropdownOptions.localityNames}
                        error={formErrors.localityName}
                      />
                    </div>
      
      
                    <div className="flex justify-end pt-6">
                      <NextButton
                        onClick={handleNext}
                        disabled={!isStep1Valid}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Step 2 - Owner Details */}
{step === 2 ? (
  <div className="space-y-8">
    <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
      <User className="text-blue-500" />
      Owner Details
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <InputField
        label="Owner Name"
        id="ownerName"
        name="ownerName"
        type="text"
        value={ownerDetails.ownerName}
        onChange={handleOwnerDetailsChange}
        placeholder="Enter owner name"
        error={formErrors.ownerName}
      />

      <InputField
        label="Phone Number"
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        value={ownerDetails.phoneNumber}
        onChange={handleOwnerDetailsChange}
        placeholder="Enter 10-digit number"
        maxLength={10}
        error={formErrors.phoneNumber}
      />

      <SelectField
        label="Total Floors"
        id="totalFloors"
        name="totalFloors"
        value={ownerDetails.totalFloors}
        onChange={handleOwnerDetailsChange}
        options={dropdownOptions.totalFloors}
        error={formErrors.totalFloors}
      />
    </div>

   

    <div className="flex justify-end pt-6">
      <NextButton
        onClick={handleNext}
        disabled={!isStep2Valid}
      />
    </div>
  </div>
) : null}

{/* Step 3 - Location Coordinates */}
{step === 3 ? (
  <div className="space-y-8">
    <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
      <MapPinned className="text-blue-500" />
      Location Coordinates
    </div>

    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          label="Latitude"
          id="latitude"
          name="latitude"
          type="text"
          value={locationDetails.latitude}
          onChange={handleLocationChange}
          placeholder="Enter latitude"
          error={formErrors.latitude}
        />

        <InputField
          label="Longitude"
          id="longitude"
          name="longitude"
          type="text"
          value={locationDetails.longitude}
          onChange={handleLocationChange}
          placeholder="Enter longitude"
          error={formErrors.longitude}
        />
      </div>

      <div className="relative">
        <button
          onClick={determineLocation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <Navigation className={`${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Determining Location...' : 'Determine My Location'}
        </button>
        
        {locationError && (
          <div className="mt-3 flex items-start gap-2 text-red-500">
            <AlertCircle size={16} className="flex-shrink-0 mt-1" />
            <p className="text-sm">{locationError}</p>
          </div>
        )}
      </div>


    </div>

    <div className="flex justify-end pt-6">
      <NextButton
        onClick={handleNext}
        disabled={!isStep3Valid}
      />
    </div>
  </div>
) : null}

{/* Step 4 - Building Details */}
{step === 4 ? (
  <div className="space-y-8">
    <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
      <Building className="text-blue-500" />
      Building Details
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <InputField
        label="Area (in sq. ft)"
        id="areaSquareFeet"
        name="areaSquareFeet"
        type="number"
        min="0"
        value={buildingDetails.areaSquareFeet}
        onChange={handleBuildingDetailsChange}
        placeholder="Enter area"
        error={formErrors.areaSquareFeet}
      />

      <SelectField
        label="Building Usage"
        id="buildingUsage"
        name="buildingUsage"
        value={buildingDetails.buildingUsage}
        onChange={handleBuildingDetailsChange}
        options={dropdownOptions.buildingUsage}
        error={formErrors.buildingUsage}
      />

      <SelectField
        label="Building Structure"
        id="buildingStructure"
        name="buildingStructure"
        value={buildingDetails.buildingStructure}
        onChange={handleBuildingDetailsChange}
        options={dropdownOptions.buildingStructure}
        error={formErrors.buildingStructure}
      />
    </div>

   

    <div className="flex justify-end pt-6">
      <button
        onClick={handleSubmit}
        disabled={!isStep4Valid}
        className={`
          group relative flex items-center gap-2 px-6 py-3 text-white rounded-lg
          transform transition-all duration-200
          ${isStep4Valid 
            ? 'bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg' 
            : 'bg-gray-300 cursor-not-allowed'
          }
        `}
      >
        Submit Survey
        <CheckCircle className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  </div>
) : null}

        </div>
      </div>
    )}
  </div>
);
};

export default SurveyPage;