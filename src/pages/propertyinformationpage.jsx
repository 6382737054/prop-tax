// PropertyInformationSection.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PropertyInformationSection = ({ propertyData }) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="h-8 w-1 bg-sky-500 rounded-full"></div>
        Property Information
      </h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformationSection;