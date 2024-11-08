// SurveyDetailsSection.jsx
import React, { useState } from 'react';

const SurveyDetailsSection = ({
  mobileNumber,
  setMobileNumber,
  isMobileValid,
  setIsMobileValid,
  showMobileError,
  setShowMobileError,
  buildingType,
  setBuildingType,
  totalFloors,
  setTotalFloors,
  apartmentFloor,
  setApartmentFloor,
  buildingStructure,
  setBuildingStructure,
  errors
}) => {
  const validateMobileNumber = (number) => {
    const isValid = /^[6-9]\d{9}$/.test(number);
    setIsMobileValid(isValid);
    return isValid;
  };

  const [initialBuildingType, setInitialBuildingType] = useState('independent');

  const handleBuildingTypeChange = (e) => {
    const value = e.target.value;
    setBuildingType(value);
    setTotalFloors('');
    setApartmentFloor('');
  };

  const handleTotalFloorsChange = (e) => {
    setTotalFloors(e.target.value);
    setApartmentFloor('');
  };

  const handleApartmentFloorChange = (e) => {
    setApartmentFloor(e.target.value);
  };

  const handleBuildingStructureChange = (e) => {
    setBuildingStructure(e.target.value);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="h-8 w-1 bg-sky-500 rounded-full"></div>
        Survey Details
      </h3>
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

        {/* Building Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Building Type
          </label>
          <select
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            value={buildingType}
            onChange={handleBuildingTypeChange}
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

        {/* Apartment Specific Details */}
        {buildingType === 'apartment' && (
          <>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Total Number of Floors in Apartment
              </label>
              <select
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                value={totalFloors}
                onChange={handleTotalFloorsChange}
                required
              >
                <option value="">Select Total Floors</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    G+{i + 1}
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
                  onChange={handleApartmentFloorChange}
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

            {/* Roof Structure for Top Floor */}
            {totalFloors && apartmentFloor === totalFloors && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Roof Structure
                </label>
                <select
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  value={buildingStructure}
                  onChange={handleBuildingStructureChange}
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

        {/* Independent and Row House Roof Structure */}
        {(buildingType === 'independent' || buildingType === 'row_house') && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Roof Structure
            </label>
            <select
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              value={buildingStructure}
              onChange={handleBuildingStructureChange}
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
      </div>
    </div>
  );
};

export default SurveyDetailsSection;