import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Building, 
  Home, 
  ChevronDown,
  Search,
  AlertCircle,
  Table,
  Phone,
  User,
  ArrowRight
} from 'lucide-react';
import filterData from './filterData.json';

// Enhanced SelectField with better styling and animations
const SelectField = ({ label, id, options, error, icon: Icon, ...props }) => (
  <div className="space-y-2 relative group">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-hover:text-blue-500 transition-colors">
          <Icon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      )}
      <select
        id={id}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-blue-300 shadow-sm appearance-none text-gray-700 font-medium disabled:bg-gray-50 disabled:cursor-not-allowed`}
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
        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
    {error && (
      <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-red-500 text-sm animate-fadeIn">
        <AlertCircle size={14} />
        <span className="font-medium">{error}</span>
      </div>
    )}
  </div>
);

// Enhanced ResultsTable with better styling and animations
const ResultsTable = ({ results }) => {
  const navigate = useNavigate();

  if (!results || results.length === 0) return (
    <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border border-gray-200 shadow-sm">
      <div className="max-w-md mx-auto space-y-4">
        <Search className="h-12 w-12 text-gray-400 mx-auto" />
        <p className="text-gray-600 font-medium">No results found. Please try different search criteria.</p>
      </div>
    </div>
  );

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Table className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          </div>
          <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {results.length} Results Found
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Door Number
              </th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Owner Name
              </th>
              <th className="px-6 py-4 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((item, index) => (
              <tr 
                key={index} 
                className="hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/verify/${item.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      {item.DoorNo}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {item.Ownername}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {item.PhoneNumber}
                    </span>
                  </div>
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

  // Keep all existing useEffect hooks and handlers exactly the same
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Search Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Search className="h-6 w-6 text-blue-500" />
              Property Search
            </h2>
            <p className="text-gray-500 mt-2">Please fill in the details to search for properties</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transform font-semibold"
            >
              <Search className="h-5 w-5" />
              Search Properties
              <ArrowRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>

        <ResultsTable results={searchResults} />
      </div>
    </div>
  );
};

export default SurveyForm;

