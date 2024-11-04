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
  User
} from 'lucide-react';
import api from '../apiConfig/api';

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

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    ward_name: '',
    area_name: '',
    locality_name: '',
    street_name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [userWards, setUserWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchWards = async () => {
      let token = null;
      try {
        setLoading(true);
        setApiError(null);
        const userData = JSON.parse(localStorage.getItem('userData'));
        token = userData?.authToken;
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Encode the municipality name properly for the URL
        const municipalityName = encodeURIComponent('ADIRAMPATTINAM MUNICIPALITY');
        
        const response = await api.get(`api/v1/master/${municipalityName}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Added Bearer prefix
            'Content-Type': 'application/json'
          },
          timeout: 10000 // Increased timeout to 10 seconds
        });

        if (response.data && Array.isArray(response.data.data)) {
          const formattedWards = response.data.data.map(ward => ({
            value: ward.ward_name,
            label: `${ward.ward_name}`, // Format the label as needed
          }));
          setUserWards(formattedWards);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('API Error:', error);
        setApiError(error.response?.data?.message || error.message || 'Failed to fetch wards');
        
        // Log detailed error information for debugging
        if (error.response) {
          console.log('Error Response:', {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, []);

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

    if (name === 'ward_name') {
      setFormData(prev => ({
        ...prev,
        area_name: '',
        locality_name: '',
        street_name: '',
        [name]: value
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted with:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[96%] mx-auto space-y-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Search className="h-6 w-6 text-blue-500" />
              Property Search
            </h2>
            <p className="text-gray-500 mt-2">Please fill in the details to search for properties</p>
          </div>
          
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{apiError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SelectField
              label="Ward Name"
              id="ward_name"
              name="ward_name"
              value={formData.ward_name}
              onChange={handleInputChange}
              options={userWards}
              error={formErrors.ward_name}
              icon={Home}
              disabled={loading}
            />
            <SelectField
              label="Area Name"
              id="area_name"
              name="area_name"
              value={formData.area_name}
              onChange={handleInputChange}
              options={[]}
              error={formErrors.area_name}
              disabled={!formData.ward_name}
              icon={Building}
            />
            <SelectField
              label="Locality Name"
              id="locality_name"
              name="locality_name"
              value={formData.locality_name}
              onChange={handleInputChange}
              options={[]}
              error={formErrors.locality_name}
              disabled={!formData.area_name}
              icon={MapPin}
            />
            <SelectField
              label="Street Name"
              id="street_name"
              name="street_name"
              value={formData.street_name}
              onChange={handleInputChange}
              options={[]}
              error={formErrors.street_name}
              disabled={!formData.locality_name}
              icon={MapPin}
            />
            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;