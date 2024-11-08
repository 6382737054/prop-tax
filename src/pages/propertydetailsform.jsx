// PropertyDetailsForm.jsx
import React, { useState } from 'react';
import { Building } from 'lucide-react';
import PhotoLocationCapture from '../components/photolocationcapture';

const PropertyDetailsForm = ({
  onChange,
  data,
  propertyPhotos,
  setPropertyPhotos,
  previousArea
}) => {
  const [hasProfessionalTax, setHasProfessionalTax] = useState(true);
  const [professionalTaxId, setProfessionalTaxId] = useState('');
  const [ebNumberError, setEbNumberError] = useState('');
  const [showEbError, setShowEbError] = useState(false);
  const [taxIdError, setTaxIdError] = useState('');
  const [showTaxIdError, setShowTaxIdError] = useState(false);
  const [employeeCounts, setEmployeeCounts] = useState({
    row1: 0, row2: 0, row3: 0, row4: 0, row5: 0, row6: 0
  });
  const buildingUsageOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "government", label: "Government" },
    { value: "residential", label: "Residential" },
    { value: "educational", label: "Educational" },
    { value: "mixed", label: "Mixed" }
  ];

  const validateTaxId = (value) => {
    if (hasProfessionalTax) {
      if (!value.trim()) {
        setTaxIdError('Professional Tax ID is required');
        return false;
      }
      if (value.length < 5) {
        setTaxIdError('Please enter a valid Professional Tax ID');
        return false;
      }
    }
    setTaxIdError('');
    return true;
  };

  const validateEbNumber = (value) => {
    if (!value) {
      setEbNumberError('Please enter EB number');
      return false;
    }
    if (value.length !== 12) {
      setEbNumberError('EB number must be 12 digits');
      return false;
    }
    setEbNumberError('');
    return true;
  };

  const calculateTax = (employeeCount, taxRate) => {
    if (!employeeCount || !taxRate) return 0;
    return employeeCount * taxRate;
  };

  const handleEmployeeCountChange = (rowKey, value) => {
    const numValue = value === '' ? '' : parseInt(value.replace(/^0+/, '')) || 0;
    setEmployeeCounts(prev => ({
      ...prev,
      [rowKey]: numValue
    }));
  };

  const shouldShowProfessionalTax = data.buildingUsage === 'commercial' || data.buildingUsage === 'mixed';

  const handleUsageChange = (e) => {
    const value = e.target.value;
    onChange('buildingUsage', value);
    if (value !== 'commercial' && value !== 'mixed') {
      setHasProfessionalTax(false);
      setProfessionalTaxId('');
      onChange('hasProfessionalTax', false);
      onChange('professionalTaxId', '');
      setTaxIdError('');
      setShowTaxIdError(false);
    }
  };

  const handleProfessionalTaxToggle = () => {
    const newValue = !hasProfessionalTax;
    setHasProfessionalTax(newValue);
    
    // Update parent state with both values
    onChange('hasProfessionalTax', newValue);
    if (!newValue) {
      setProfessionalTaxId('');
      onChange('professionalTaxId', '');
    }
  };

  const handleProfessionalTaxIdChange = (e) => {
    const value = e.target.value;
    setProfessionalTaxId(value);
    // Make sure to update parent state
    onChange('professionalTaxId', value);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-all duration-300">
      <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Building className="h-6 w-6 text-sky-500" />
        <span className="relative">Property Details</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Build Area as per Records (sq ft)</label>
            <input type="text" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed" value={previousArea || ''} disabled />
          </div>
        </div>
        <div className="md:col-span-1">
  <div className="flex flex-col h-full">
    <label className="block text-sm font-semibold text-gray-700 mb-2">Build Area as Observed (sq ft)</label>
    <input
      type="number"
      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
      value={data.floorArea || ''}
      onChange={(e) => onChange('floorArea', e.target.value)}
      required
      placeholder="Enter area"
    />
  </div>
</div>
<div className="md:col-span-1">
  <div className="flex flex-col h-full">
    <label className="block text-sm font-semibold text-gray-700 mb-2">EB Number</label>
    <input
      type="text"
      className={`w-full p-4 border ${ebNumberError && showEbError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
      value={data.ebNumber || ''}
      onChange={(e) => {
        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 12);
        onChange('ebNumber', value);
        if (value.length > 0) {
          setShowEbError(true);
          validateEbNumber(value);
        } else {
          setShowEbError(false);
          setEbNumberError('');
        }
      }}
      onBlur={() => {
        setShowEbError(true);
        validateEbNumber(data.ebNumber || '');
      }}
      onFocus={() => {
        if (!data.ebNumber) {
          setShowEbError(false);
        }
      }}
      maxLength={12}
      required
      placeholder="Enter 12 digit EB number"
    />
    {showEbError && ebNumberError && (
      <p className="text-red-500 text-sm mt-1">{ebNumberError}</p>
    )}
  </div>
</div>
        <div className="md:col-span-1">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usage</label>
            <select className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" value={data.buildingUsage || ''} onChange={handleUsageChange} required>
              <option value="">Select Usage</option>
              {buildingUsageOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {shouldShowProfessionalTax && (
  <div className="mt-8 border-t border-gray-200">
    <div className="pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-semibold text-gray-700">Have Professional Tax Registration?</label>
        <button
          type="button"
          onClick={handleProfessionalTaxToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 ${hasProfessionalTax ? 'bg-green-500' : 'bg-gray-200'} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${hasProfessionalTax ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      {hasProfessionalTax ? (
        <div className="w-full md:w-auto md:flex-1 md:max-w-md">
          <input
            type="text"
            className={`w-full md:w-[70%] p-4 border ${taxIdError && showTaxIdError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
            value={professionalTaxId}
            onChange={handleProfessionalTaxIdChange}
            onBlur={() => {
              setShowTaxIdError(true);
              validateTaxId(professionalTaxId);
            }}
            onFocus={() => {
              if (!professionalTaxId) {
                setShowTaxIdError(false);
              }
            }}
            required
            placeholder="Enter Professional Tax ID"
          />
          {showTaxIdError && taxIdError && (
            <p className="text-red-500 text-sm mt-1">{taxIdError}</p>
          )}
        </div>
      ) : (
        <div className="overflow-auto -mx-8 px-8 sm:mx-0 sm:px-0">
          <div className="min-w-[500px] sm:min-w-0 sm:max-w-2xl bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sl. No.</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Average Half-Yearly Income</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Half-Yearly Tax</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Number of Employees</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tax Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">1</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Upto Rs. 21,000/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Nil</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row1}
                      onChange={(e) => handleEmployeeCountChange('row1', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Nil</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 21,001/- to 30,000/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 135/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row2}
                      onChange={(e) => handleEmployeeCountChange('row2', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row2, 135)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 30,001/- to 45,000/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 315/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row3}
                      onChange={(e) => handleEmployeeCountChange('row3', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row3, 315)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">4</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 45,001/- to 60,000/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 690/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row4}
                      onChange={(e) => handleEmployeeCountChange('row4', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row4, 690)}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 60,001/- to 75,000/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 1025/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row5}
                      onChange={(e) => handleEmployeeCountChange('row5', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row5, 1025)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">6</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">From 75,001/- and above</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Rs. 1250/-</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    <input
                      type="number"
                      min="0"
                      className="w-20 p-1 border border-gray-200 rounded"
                      value={employeeCounts.row6}
                      onChange={(e) => handleEmployeeCountChange('row6', e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row6, 1250)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900 text-right">Total:</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {Object.values(employeeCounts).reduce((total, count) => total + (parseInt(count) || 0), 0)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {calculateTax(employeeCounts.row2, 135) + 
                     calculateTax(employeeCounts.row3, 315) + 
                     calculateTax(employeeCounts.row4, 690) + 
                     calculateTax(employeeCounts.row5, 1025) + 
                     calculateTax(employeeCounts.row6, 1250)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
)}
<div className="mt-8">
  <label className="block text-sm font-semibold text-gray-700 mb-4">Property Photos with Location (Max 3)</label>
  <PhotoLocationCapture 
    onPhotoCaptured={(photos) => {
      console.log('Photos captured:', photos);
      setPropertyPhotos(photos);
    }}
  />
</div>
</div>
);
};

export default PropertyDetailsForm;