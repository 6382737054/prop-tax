// OwnerVerificationSection.jsx
import React, { useState } from 'react';
import { User } from 'lucide-react';

const OwnerVerificationSection = ({ propertyData, ownerVerified, setOwnerVerified, newOwnerName, setNewOwnerName }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <div className="h-8 w-1 bg-sky-500 rounded-full"></div>
        Owner Verification
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-xl">
          <div className="h-12 w-12 bg-sky-500 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{propertyData.owner}</h3>
          </div>
        </div>

        <div className="space-y-4 max-w-full md:max-w-[30%] md:mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center ">
              <p className="text-sm text-gray-600 ml-2 ">Is this owner name correct</p>
              <button
                onClick={() => {
                  setOwnerVerified(!ownerVerified);
                  if (!ownerVerified) setNewOwnerName('');
                }}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full ml-3
                  ${ownerVerified ? 'bg-green-500' : 'bg-gray-200'}
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                `}
              >
                <span className="sr-only">Toggle owner verification</span>
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
                    ${ownerVerified ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
              <span className="ml-2 text-sm text-gray-600">
                {ownerVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <input
              type="text"
              value={newOwnerName}
              onChange={(e) => {
                // Only allow letters and spaces
                const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                setNewOwnerName(value);
              }}
              onKeyPress={(e) => {
                // Prevent typing numbers and special characters
                if (!/[A-Za-z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              disabled={ownerVerified}
              className={`flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm ${
                ownerVerified ? 'bg-gray-100' : 'bg-white'
              }`}
              pattern="[A-Za-z\s]+"
              placeholder="Enter owner name"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerVerificationSection;