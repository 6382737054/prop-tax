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
import { Link } from 'react-router-dom';

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
        {options?.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
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

  useEffect(() => {
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

    fetchUserDataAndWards();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      let token = null;
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        token = userData?.authToken;
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const orgName = userData?.data?.resp?.org;

        if (orgName && formData.ward_id) {
          const areasResponse = await api.get(`api/v1/master/${orgName}/${formData.ward_id}`, {
            headers: {
              'Authorization': `${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (areasResponse.data && Array.isArray(areasResponse.data.data)) {
            const formattedAreas = areasResponse.data.data.map(area => ({
              value: area.area_id,
              label: area.area_name
            }));
            setUserAreas(formattedAreas);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [formData.ward_id]);

  useEffect(() => {
    const fetchLocalities = async () => {
      let token = null;
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        token = userData?.authToken;
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const orgName = userData?.data?.resp?.org;

        if (orgName && formData.ward_id && formData.area_id) {
          const localitiesResponse = await api.get(`api/v1/master/${orgName}/${formData.ward_id}/${formData.area_id}`, {
            headers: {
              'Authorization': `${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (localitiesResponse.data && Array.isArray(localitiesResponse.data.data)) {
            const formattedLocalities = localitiesResponse.data.data.map(locality => ({
              value: locality.loc_id,
              label: locality.loc_name
            }));
            setUserLocalities(formattedLocalities);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalities();
  }, [formData.area_id]);

  useEffect(() => {
    const fetchStreets = async () => {
      let token = null;
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        token = userData?.authToken;
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const orgName = userData?.data?.resp?.org;

        if (orgName && formData.ward_id && formData.area_id && formData.locality_id) {
          const streetsResponse = await api.get(`api/v1/master/${orgName}/${formData.ward_id}/${formData.area_id}/${formData.locality_id}`, {
            headers: {
              'Authorization': `${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (streetsResponse.data && Array.isArray(streetsResponse.data.data)) {
            const formattedStreets = streetsResponse.data.data.map(street => ({
              value: street.street_id,
              label: street.street_name
            }));
            setUserStreets(formattedStreets);
          }
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreets();
  }, [formData.locality_id]);

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

    if (name === 'ward_id') {
      setFormData(prev => ({
        ...prev,
        area_id: '',
        locality_id: '',
        street_id: '',
        [name]: value
      }));
    }
    
    if (name === 'area_id') {
      setFormData(prev => ({
        ...prev,
        locality_id: '',
        street_id: '',
        [name]: value
      }));
    }

    if (name === 'locality_id') {
      setFormData(prev => ({
        ...prev,
        street_id: '',
        [name]: value
      }));
    }

    setSearchResults([]);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.ward_id) {
      errors.ward_id = 'Ward is required';
    }
    if (!formData.area_id) {
      errors.area_id = 'Area is required';
    }
    if (!formData.locality_id) {
      errors.locality_id = 'Locality is required';
    }
    if (!formData.street_id) {
      errors.street_id = 'Street is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setSearchLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const token = userData?.authToken;
        
        if (!token) {
          console.error('No auth token found');
          return;
        }

        // Using template literals for better readability
        const url = `/api/v1/asset?org_name=${encodeURIComponent(userOrgName)}&ward_id=${formData.ward_id}&area_id=${formData.area_id}&loc_id=${formData.locality_id}&street_id=${formData.street_id}`;

        const response = await api.get(url, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (response.data?.data) {
          setSearchResults(response.data.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search API Error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

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
                onClick={handleSubmit}
                disabled={loading || searchLoading}
                className="w-full px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
              >
                {searchLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

    

 {/* Properly Aligned Table */}
 {searchResults.length > 0 && (
          <div className="bg-white shadow-md rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                Search Results ({searchResults.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left font-semibold px-6 py-4 border-b w-20">
                      S.No
                    </th>
                    <th className="text-left font-semibold px-6 py-4 border-b w-1/4">
                      Door Number
                    </th>
                    <th className="text-left font-semibold px-6 py-4 border-b w-1/3">
                      Owner Name
                    </th>
                    <th className="text-left font-semibold px-6 py-4 border-b w-1/4">
                      Total Area (Sq.ft)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 align-middle">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <Link 
                          to={`/verify/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          {item.new_door || 'N/A'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {item.owner || 'N/A'}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {item.build_area ? `${item.build_area} sq.ft` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Simple No Results Message */}
        {searchResults.length === 0 && !loading && !searchLoading && formData.street_id && (
          <div className="bg-white p-6 text-center rounded-lg shadow-md">
            <p className="text-gray-600">No properties found for the selected criteria.</p>
          </div>
        )}



      </div>
    </div>
  );
};

export default SurveyForm;
                   