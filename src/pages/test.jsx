import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Edit2, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Building, 
  Home, 
  Phone,
  ChevronDown,
  Search 
} from 'lucide-react';
import api from '../apiConfig/api';

const InputField = ({ label, id, error, icon: Icon, ...props }) => (
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
      <input
        id={id}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 shadow-sm`}
        {...props}
      />
    </div>
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

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

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    wardName: '',
    areaName: '',
    localityName: '',
    streetName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [filteredStreets, setFilteredStreets] = useState([]);
  const [userWards, setUserWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserWards = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const wards = userData?.data?.resp?.wards || [];
          const formattedWards = wards.map(ward => ({
            value: ward.ward_id.toString(),
            label: ward.ward_name // The API returns ward_name as "WARD-01", "WARD-02" etc.
          }));
          setUserWards(formattedWards);
        }
      } catch (error) {
        console.error('Error loading ward data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserWards();
  }, []);

  useEffect(() => {
    if (formData.areaName) {
      fetchLocalitiesByArea(formData.areaName);
    }
  }, [formData.areaName]);

  useEffect(() => {
    if (formData.localityName) {
      fetchStreetsByLocality(formData.localityName);
    }
  }, [formData.localityName]);

  const fetchLocalitiesByArea = async (areaId) => {
    try {
      const response = await api.get(`/master/detail/${areaId}/locality`);
      const localities = response.data.data.map(locality => ({
        value: locality.locality_id.toString(),
        label: locality.locality_name
      }));
      setFilteredLocalities(localities);
    } catch (error) {
      console.error('Error fetching localities:', error);
    }
  };

  const fetchStreetsByLocality = async (localityId) => {
    try {
      const response = await api.get(`/master/detail/${localityId}/streets`);
      const streets = response.data.data.map(street => ({
        value: street.street_id.toString(),
        label: street.street_name
      }));
      setFilteredStreets(streets);
    } catch (error) {
      console.error('Error fetching streets:', error);
    }
  };

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
        streetName: ''
      }));
    } else if (name === 'areaName') {
      setFormData(prev => ({
        ...prev,
        localityName: '',
        streetName: ''
      }));
    } else if (name === 'localityName') {
      setFormData(prev => ({
        ...prev,
        streetName: ''
      }));
    }
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
      setSubmitted(true);
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-8">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
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

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          Search <Search size={20} />
        </button>
      </div>
    </div>
  );
};
export default SurveyForm;