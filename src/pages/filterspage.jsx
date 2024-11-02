import React, { useState, useEffect } from 'react';
import { 
  MapPin, Edit2, CheckCircle, AlertCircle, X, BuildingIcon, Phone, Home
} from 'lucide-react';
import filterData from './filterData.json';

// Reusable Input Components
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
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
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

const SuccessPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 animate-scaleIn">
      <button 
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </button>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 animate-bounce">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Success!</h3>
        <p className="mt-2 text-sm text-gray-600">Your changes have been saved successfully.</p>
        <button
          onClick={onClose}
          className="mt-6 w-full inline-flex justify-center px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const WardDataTable = ({ data, onEdit }) => (
  <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Door No
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Owner Name
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Street Name
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{row.NewDoorNo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.Ownername}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.StreetName}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => onEdit(row)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 group transition-colors duration-150"
              >
                <Edit2 size={16} className="group-hover:scale-110 transition-transform duration-150" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EditForm = ({ selectedRow, onSubmit }) => {
  const [editData, setEditData] = useState({
    ownerName: selectedRow?.Ownername || '',
    phoneNumber: '',
    buildingUsage: '',
    buildingStructure: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const buildingUsageOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Educational', label: 'Educational' },
    { value: 'Government', label: 'Government' }
  ];

  const buildingStructureOptions = [
    { value: 'RCC', label: 'RCC Sheet' },
    { value: 'THATCHED', label: 'Thatched' },
    { value: 'AC-SHEET', label: 'AC Sheet' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    onSubmit(editData);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Edit2 className="text-blue-500" size={20} />
          Edit Details
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <InputField
          label="Confirm Owner Name"
          id="ownerName"
          value={editData.ownerName}
          disabled
          icon={Home}
        />
        <InputField
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          value={editData.phoneNumber}
          onChange={(e) => setEditData(prev => ({...prev, phoneNumber: e.target.value}))}
          required
          icon={Phone}
        />
        <SelectField
          label="Building Usage"
          id="buildingUsage"
          value={editData.buildingUsage}
          onChange={(e) => setEditData(prev => ({...prev, buildingUsage: e.target.value}))}
          options={buildingUsageOptions}
          required
          icon={BuildingIcon}
        />
        <SelectField
          label="Building Structure"
          id="buildingStructure"
          value={editData.buildingStructure}
          onChange={(e) => setEditData(prev => ({...prev, buildingStructure: e.target.value}))}
          options={buildingStructureOptions}
          required
          icon={Home}
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Update Details
        </button>
      </form>
      
      {showSuccess && (
        <SuccessPopup 
          onClose={() => {
            setShowSuccess(false);
            setEditData({
              ownerName: '',
              phoneNumber: '',
              buildingUsage: '',
              buildingStructure: ''
            });
          }}
        />
      )}
    </div>
  );
};

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    wardName: '',
    streetName: '',
    localityName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredStreets, setFilteredStreets] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);

  useEffect(() => {
    if (formData.wardName) {
      const wardData = filterData.data.filter(item => item.WardName === formData.wardName);
      
      const streets = [...new Set(wardData.map(item => item.StreetName))].map(street => ({
        value: street,
        label: street
      }));
      setFilteredStreets(streets);

      const localities = [...new Set(wardData.map(item => item.LocalityName))].map(locality => ({
        value: locality,
        label: locality
      }));
      setFilteredLocalities(localities);
    }
  }, [formData.wardName]);

  const wardOptions = [...new Set(filterData.data.map(item => item.WardName))].map(ward => ({
    value: ward,
    label: ward
  }));

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

  const validateForm = () => {
    const errors = {};
    if (!formData.wardName) errors.wardName = 'Ward name is required';
    if (!formData.streetName) errors.streetName = 'Street name is required';
    if (!formData.localityName) errors.localityName = 'Locality name is required';
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const filtered = filterData.data.filter(item => 
        item.WardName === formData.wardName &&
        item.StreetName === formData.streetName &&
        item.LocalityName === formData.localityName
      );
      setFilteredData(filtered);
      setSubmitted(true);
      setSelectedRow(null);
    } else {
      setFormErrors(errors);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
  };

  const handleUpdateSubmit = (editData) => {
    console.log('Updated Data:', {
      ...selectedRow,
      ...editData
    });
    setFormData({
      wardName: '',
      streetName: '',
      localityName: ''
    });
    setFilteredData([]);
    setSubmitted(false);
    setSelectedRow(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="text-blue-500 h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Location Details</h2>
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
              icon={Home}
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
              icon={MapPin}
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
              icon={MapPin}
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg font-medium"
            >
              <span>Submit</span>
              <CheckCircle size={20} />
            </button>
          </div>
        </div>

        {submitted && (
          <div className="border-t border-gray-100">
            <div className="p-8">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertCircle size={20} />
                  <span className="font-medium">Showing results for selected location</span>
                </div>
              </div>
              
              <WardDataTable data={filteredData} onEdit={handleEdit} />
              
              {selectedRow && (
                <div className="mt-8">
                  <EditForm 
                    selectedRow={selectedRow}
                    onSubmit={handleUpdateSubmit}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Add some spacing at the bottom */}
      <div className="h-12" />
    </div>
  );
};

// Add some global styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
  }
`;
document.head.appendChild(style);

export default SurveyForm;