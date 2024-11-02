

// SurveyForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Building, 
  Home, 
  ChevronDown,
  Search,
  AlertCircle 
} from 'lucide-react';
import filterData from './filterData.json';

const SelectField = ({ label, id, options, error, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <select
        id={id}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 shadow-sm appearance-none`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="h-5 w-5 text-gray-400" />
      </div>
    </div>
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const ResultsTable = ({ results }) => {
  const navigate = useNavigate();

  if (!results || results.length === 0) return (
    <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-gray-600">No results found. Please try different search criteria.</p>
    </div>
  );

  return (
    <div className="mt-8 bg-white rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 p-4 text-center font-semibold text-gray-900">
                S.No
              </th>
              <th className="border border-gray-300 bg-gray-50 p-4 text-center font-semibold text-gray-900">
                Door Number
              </th>
              <th className="border border-gray-300 bg-gray-50 p-4 text-center font-semibold text-gray-900">
                Owner Name
              </th>
              <th className="border border-gray-300 bg-gray-50 p-4 text-center font-semibold text-gray-900">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-4 text-center">
                  <span 
                    onClick={() => navigate(`/verify/${item.id}`)}
                    className="cursor-pointer hover:text-blue-800 transition-colors">
                    {item.DoorNo}
                  </span>
                </td>
                <td className="border border-gray-300 p-4 text-center">
                  {item.Ownername}
                </td>
                <td className="border border-gray-300 p-4 text-center">
                  {item.PhoneNumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    wardName: '',
    areaName: '',
    localityName: '',
    streetName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [filteredStreets, setFilteredStreets] = useState([]);
  const [userWards, setUserWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUserWards = async () => {
      try {
        const wards = [...new Set(filterData.data.map(item => item.WardName))];
        const formattedWards = wards.map(ward => ({
          value: ward,
          label: ward
        }));
        setUserWards(formattedWards);
      } catch (error) {
        console.error('Error loading ward data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserWards();
  }, []);

  useEffect(() => {
    if (formData.wardName) {
      const wardData = filterData.data.filter(item => 
        item.WardName.toLowerCase() === formData.wardName.toLowerCase()
      );
      
      const areas = [...new Set(wardData.map(item => item.AreaName))]
        .filter(Boolean)
        .map(area => ({
          value: area,
          label: area
        }));
      setFilteredData(areas);

      setFilteredLocalities([]);
      setFilteredStreets([]);
    }
  }, [formData.wardName]);

  useEffect(() => {
    if (formData.wardName && formData.areaName) {
      const areaData = filterData.data.filter(item => 
        item.WardName.toLowerCase() === formData.wardName.toLowerCase() &&
        item.AreaName.toLowerCase() === formData.areaName.toLowerCase()
      );

      const localities = [...new Set(areaData.map(item => item.LocalityName))]
        .filter(Boolean)
        .map(locality => ({
          value: locality,
          label: locality
        }));
      setFilteredLocalities(localities);

      setFilteredStreets([]);
    }
  }, [formData.wardName, formData.areaName]);

  useEffect(() => {
    if (formData.wardName && formData.areaName && formData.localityName) {
      const localityData = filterData.data.filter(item => 
        item.WardName.toLowerCase() === formData.wardName.toLowerCase() &&
        item.AreaName.toLowerCase() === formData.areaName.toLowerCase() &&
        item.LocalityName.toLowerCase() === formData.localityName.toLowerCase()
      );

      const streets = [...new Set(localityData.map(item => item.StreetName))]
        .filter(Boolean)
        .map(street => ({
          value: street,
          label: street
        }));
      setFilteredStreets(streets);
    }
  }, [formData.wardName, formData.areaName, formData.localityName]);

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

    if (name === 'wardName') {
      setFormData(prev => ({
        ...prev,
        areaName: '',
        localityName: '',
        streetName: '',
        [name]: value
      }));
    } else if (name === 'areaName') {
      setFormData(prev => ({
        ...prev,
        localityName: '',
        streetName: '',
        [name]: value
      }));
    } else if (name === 'localityName') {
      setFormData(prev => ({
        ...prev,
        streetName: '',
        [name]: value
      }));
    }
    setSearchResults([]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.wardName) errors.wardName = 'Ward name is required';
    if (!formData.areaName) errors.areaName = 'Area name is required';
    if (!formData.localityName) errors.localityName = 'Locality name is required';
    if (!formData.streetName) errors.streetName = 'Street name is required';
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const results = filterData.data.filter(item => 
        item.WardName.toLowerCase().trim() === formData.wardName.toLowerCase().trim() &&
        item.AreaName.toLowerCase().trim() === formData.areaName.toLowerCase().trim() &&
        item.LocalityName.toLowerCase().trim() === formData.localityName.toLowerCase().trim() &&
        item.StreetName.toLowerCase().trim() === formData.streetName.toLowerCase().trim()
      );
      setSearchResults(results);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="px-4 max-w-[98%] mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <SelectField
              label="Ward Name"
              id="wardName"
              name="wardName"
              value={formData.wardName}
              onChange={handleInputChange}
              options={userWards}
              error={formErrors.wardName}
              icon={Home}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <SelectField
              label="Area Name"
              id="areaName"
              name="areaName"
              value={formData.areaName}
              onChange={handleInputChange}
              options={filteredData}
              error={formErrors.areaName}
              disabled={!formData.wardName}
              icon={Building}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <SelectField
              label="Locality Name"
              id="localityName"
              name="localityName"
              value={formData.localityName}
              onChange={handleInputChange}
              options={filteredLocalities}
              error={formErrors.localityName}
              disabled={!formData.areaName}
              icon={MapPin}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <SelectField
              label="Street Name"
              id="streetName"
              name="streetName"
              value={formData.streetName}
              onChange={handleInputChange}
              options={filteredStreets}
              error={formErrors.streetName}
              disabled={!formData.localityName}
              icon={MapPin}
            />
          </div>
          <div className="pb-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      <ResultsTable results={searchResults} />
    </div>
  );
};

export default SurveyForm;

