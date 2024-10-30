import React, { useState, useEffect } from 'react';
import { 
  MapPin, Edit2, CheckCircle, AlertCircle, X
} from 'lucide-react';
import filterData from './filterData.json';

// Reusable Input Components
const InputField = ({ label, id, error, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      {...props}
    />
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const SelectField = ({ label, id, options, error, ...props }) => (
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
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <AlertCircle size={14} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const SuccessPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Thanks for submitting!</h3>
        <p className="text-sm text-gray-500 mb-6">Your changes have been saved successfully.</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const WardDataTable = ({ data, onEdit }) => (
  <div className="mt-8 overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Door No
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Owner Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Street Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row) => (
          <tr key={row.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">{row.NewDoorNo}</td>
            <td className="px-6 py-4 whitespace-nowrap">{row.Ownername}</td>
            <td className="px-6 py-4 whitespace-nowrap">{row.StreetName}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => onEdit(row)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit2 size={16} />
                <span className="underline">Edit</span>
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
    phoneNumber: selectedRow?.PhoneNumber || '',
    buildingUsage: selectedRow?.UsageName || '',
    buildingStructure: selectedRow?.BuildingType || ''
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
  };

  const handleClosePopup = () => {
    setShowSuccess(false);
    onSubmit(editData);
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Details</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Confirm Owner Name"
          id="ownerName"
          value={editData.ownerName}
          disabled
        />
        <InputField
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          value={editData.phoneNumber}
          onChange={(e) => setEditData(prev => ({...prev, phoneNumber: e.target.value}))}
          required
        />
        <SelectField
          label="Building Usage"
          id="buildingUsage"
          value={editData.buildingUsage}
          onChange={(e) => setEditData(prev => ({...prev, buildingUsage: e.target.value}))}
          options={buildingUsageOptions}
          required
        />
        <SelectField
          label="Building Structure"
          id="buildingStructure"
          value={editData.buildingStructure}
          onChange={(e) => setEditData(prev => ({...prev, buildingStructure: e.target.value}))}
          options={buildingStructureOptions}
          required
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Update Details
        </button>
      </form>
      
      {showSuccess && (
        <SuccessPopup onClose={handleClosePopup} />
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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-700 mb-6">
            <MapPin className="text-blue-500" />
            Location Details
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
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            Submit <CheckCircle size={20} />
          </button>
        </div>

        {submitted && (
          <>
            <WardDataTable data={filteredData} onEdit={handleEdit} />
            {selectedRow && (
              <EditForm 
                selectedRow={selectedRow}
                onSubmit={handleUpdateSubmit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyForm;