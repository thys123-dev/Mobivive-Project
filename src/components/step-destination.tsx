'use client'; // Convert to Client Component

import React from 'react';

// Define props interface
interface StepDestinationProps {
    formData: { // Only include relevant parts of FormData
        destination: string;
        peopleCount: number;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StepDestination: React.FC<StepDestinationProps> = ({ formData, handleChange }) => {
    return (
        <div className="mb-8">
            <div className="mb-4">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">Choose Your Treatment Destination *</label>
                <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-theme-brown focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm rounded-md shadow-sm"
                    required
                >
                    <option value="" disabled>Select Destination...</option>
                    <option value="lounge">Our treatment lounge</option>
                    <option value="mobile">Your home, office...</option>
                </select>
            </div>
            <div>
                <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-2">How Many People Will Be Treated? *</label>
                <input
                    type="number"
                    id="peopleCount"
                    name="peopleCount"
                    min="1"
                    value={formData.peopleCount}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-3 py-2 border border-theme-brown rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                    required
                />
            </div>
        </div>
    );
};

export default StepDestination; 