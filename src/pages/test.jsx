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
  LayoutDashboard,
  ClipboardList,
  CheckCircle
} from 'lucide-react';
import api from '../apiConfig/api';
import { Link } from 'react-router-dom';

// SelectField component remains the same
const SelectField = ({ label, id, options, error, icon: Icon, ...props }) => (
  <div className="space-y-2 relative group">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-hover:text-sky-500 transition-colors">
          <Icon className="h-5 w-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
        </div>
      )}
      <select
        id={id}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 hover:border-blue-300 shadow-sm appearance-none text-gray-700 font-medium disabled:bg-gray-50 disabled:cursor-not-allowed`}
        {...props}
      >
        <option value="">Select {label}</option>
        {options?.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
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

// Tab component
const Tab = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
      active 
        ? 'text-sky-600 border-sky-600' 
        : 'text-gray-500 border-transparent hover:text-sky-600 hover:border-blue-300'
    }`}
  >
    <Icon className="h-5 w-5" />
    {label}
  </button>
);

// Dummy data for completed table
const completedData = [
  {
    id: 1,
    new_door: "123-A",
    owner: "John Doe",
    build_area: "1200",
    status: "Completed",
    completion_date: "2024-03-15"
  },
  {
    id: 2,
    new_door: "456-B",
    owner: "Jane Smith",
    build_area: "1500",
    status: "Completed",
    completion_date: "2024-03-14"
  },
  {
    id: 3,
    new_door: "789-C",
    owner: "Robert Johnson",
    build_area: "1800",
    status: "Completed",
    completion_date: "2024-03-13"
  }
];

const SurveyForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [formData, setFormData] = useState({
    ward_id: '',
    area_id: '',
    locality_id: '',
    street_id: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [userWards, setUserWards] = useState([]);
  const [userAreas, setUserAreas] = useState([]);
  const [userLocalities, setUserLocalities] = useState([]);
  const [userStreets, setUserStreets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userOrgName, setUserOrgName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);



  const fetchUserDataAndWards = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const orgName = userData?.data?.resp?.org;
      setUserOrgName(orgName);

      const userWards = userData?.data?.resp?.wards || [];
      if (Array.isArray(userWards)) {
        const formattedWards = userWards.map(ward => ({
          value: ward.ward_id,
          label: ward.ward_name
        }));
        setUserWards(formattedWards);
      }
    } catch (error) {
      console.error('Error processing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async (wardId) => {
    if (!wardId) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const orgName = userData?.data?.resp?.org;
      const response = await api.get(`/master/${orgName}/${wardId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.data) {
        const formattedAreas = response.data.data.map(area => ({
          value: area.area_id,
          label: area.area_name
        }));
        setUserAreas(formattedAreas);
      }
    } catch (error) {
      console.error('API Error:', error);
      setUserAreas([]);
    }
  };

  const fetchLocalities = async (wardId, areaId) => {
    if (!wardId || !areaId) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const orgName = userData?.data?.resp?.org;
      const response = await api.get(`/master/${orgName}/${wardId}/${areaId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.data) {
        const formattedLocalities = response.data.data.map(locality => ({
          value: locality.loc_id,
          label: locality.loc_name
        }));
        setUserLocalities(formattedLocalities);
      }
    } catch (error) {
      console.error('API Error:', error);
      setUserLocalities([]);
    }
  };

  const fetchStreets = async (wardId, areaId, localityId) => {
    if (!wardId || !areaId || !localityId) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const orgName = userData?.data?.resp?.org;
      const response = await api.get(`/master/${orgName}/${wardId}/${areaId}/${localityId}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.data) {
        const formattedStreets = response.data.data.map(street => ({
          value: street.street_id,
          label: street.street_name
        }));
        setUserStreets(formattedStreets);
      }
    } catch (error) {
      console.error('API Error:', error);
      setUserStreets([]);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData };
      newData[name] = value;
      
      switch (name) {
        case 'ward_id':
          newData.area_id = '';
          newData.locality_id = '';
          newData.street_id = '';
          if (value) fetchAreas(value);
          break;
          
        case 'area_id':
          newData.locality_id = '';
          newData.street_id = '';
          if (value) fetchLocalities(newData.ward_id, value);
          break;
          
        case 'locality_id':
          newData.street_id = '';
          if (value) fetchStreets(newData.ward_id, newData.area_id, value);
          break;
      }
      
      return newData;
    });

    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));

    setSearchResults([]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ward_id) errors.ward_id = 'Ward is required';
    if (!formData.area_id) errors.area_id = 'Area is required';
    if (!formData.locality_id) errors.locality_id = 'Locality is required';
    if (!formData.street_id) errors.street_id = 'Street is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSearchLoading(true);
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.authToken;
      setSearchLoading(true);
      setHasSearched(true);
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const url = `/asset?org_name=${encodeURIComponent(userOrgName)}&ward_id=${formData.ward_id}&area_id=${formData.area_id}&loc_id=${formData.locality_id}&street_id=${formData.street_id}`;

      const response = await api.get(url, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      setSearchResults(response.data?.data || []);
    } catch (error) {
      console.error('Search API Error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDataAndWards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 text-center mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const organizationName = userData?.data?.resp?.org || 'Organization';

  const renderTable = (data) => (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100 rounded-lg">
          <th className="text-left font-semibold px-6 py-4 border-b w-20">S.No</th>
          <th className="text-left font-semibold px-6 py-4 border-b w-1/4">Door Number</th>
          <th className="text-left font-semibold px-6 py-4 border-b w-1/3">Owner Name</th>
          <th className="text-left font-semibold px-6 py-4 border-b w-1/4">Total Area (Sq.ft)</th>
          {activeTab === 'completed' && (
            <th className="text-left font-semibold px-6 py-4 border-b w-1/4">Completion Date</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="px-6 py-4 align-middle">
              {String(index + 1).padStart(2, '0')}
            </td>
            <td className="px-6 py-4 align-middle">
              <Link 
                to={`/verify/${item.id}`}
                className="text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
              >
                {item.new_door || 'N/A'}
              </Link>
            </td>
            <td className="px-6 py-4 align-middle">{item.owner || 'N/A'}</td>
            <td className="px-6 py-4 align-middle">
              {item.build_area ? `${item.build_area} sq.ft` : 'N/A'}
            </td>
            {activeTab === 'completed' && (
              <td className="px-6 py-4 align-middle">{item.completion_date || 'N/A'}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100">
          {/* Organization and Zone Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
            <div className="flex items-center gap-3 p-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="h-5 w-5 text-[#75d1e3]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{organizationName}</h3>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6">
            <div className="p-2 bg-[#75d1e3]/10 rounded-lg">
  <LayoutDashboard className="h-5 w-5 text-[#75d1e3]" />
</div>
<div>
                <h3 className="text-lg font-semibold text-gray-800">Zone 1</h3>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <SelectField
                label="Ward"
                id="ward_id"
                name="ward_id"
                value={formData.ward_id}
                onChange={handleInputChange}
                options={userWards}
                error={formErrors.ward_id}
                icon={Home}
                disabled={loading}
              />
              <SelectField
                label="Area Name"
                id="area_id"
                name="area_id"
                value={formData.area_id}
                onChange={handleInputChange}
                options={userAreas}
                error={formErrors.area_id}
                disabled={!formData.ward_id}
                icon={Building}
              />
              <SelectField
                label="Locality Name"
                id="locality_id"
                name="locality_id"
                value={formData.locality_id}
                onChange={handleInputChange}
                options={userLocalities}
                error={formErrors.locality_id}
                disabled={!formData.area_id}
                icon={MapPin}
              />
              <SelectField
                label="Street Name"
                id="street_id"
                name="street_id"
                value={formData.street_id}
                onChange={handleInputChange}
                options={userStreets}
                error={formErrors.street_id}
                disabled={!formData.locality_id}
                icon={MapPin}
              />
              <div className="flex items-end">
              <button
  onClick={handleSearch}
  type="button"
  disabled={loading || searchLoading}
  className="w-full px-8 py-3.5 bg-[#75d1e3] text-white rounded-xl hover:bg-[#5dbdd0] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
>
  {searchLoading ? (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2  border-white"></div>
  ) : (
    <Search className="h-5 w-5 color" />
  )}
  Search
</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Results Section */}
        {(searchResults.length > 0 || activeTab === 'completed') && (
          <div className="bg-white shadow-md rounded-lg mt-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <Tab 
                  active={activeTab === 'pending'} 
                  icon={ClipboardList}
                  label="Pending"
                  onClick={() => setActiveTab('pending')}
                />
                <Tab 
                  active={activeTab === 'completed'} 
                  icon={CheckCircle}
                  label="Completed"
                  onClick={() => setActiveTab('completed')}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-full p-6">
                {activeTab === 'pending' ? (
                  renderTable(searchResults)
                ) : (
                  renderTable(completedData)
                )}
              </div>
            </div>
          </div>
        )}

{searchResults.length === 0 && hasSearched && !loading && !searchLoading && activeTab === 'pending' && (
  <div className="bg-white p-6 text-center rounded-lg shadow-md mt-6">
    <p className="text-gray-600">No pending properties found for the selected criteria.</p>
  </div>
)}
      </div>
    </div>
  );
};

export default SurveyForm;