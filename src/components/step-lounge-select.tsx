'use client'; // Convert to Client Component

import React from 'react';

// Define props interface
interface StepLoungeSelectProps {
    formData: { // Only include relevant parts of FormData
        loungeLocation: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StepLoungeSelect: React.FC<StepLoungeSelectProps> = ({ formData, handleChange }) => {
    const lounges = [
        { id: 'table_bay', name: 'Table Bay Mall' },
        { id: 'camps_bay', name: 'Camps Bay' },
        { id: 'durbanville', name: 'Durbanville' },
        { id: 'paarl', name: 'Paarl' },
        { id: 'somerset_west', name: 'Somerset West' },
        { id: 'stellenbosch', name: 'Stellenbosch' },
    ];

    return (
        <div className="mb-8">
            <div>
                <label htmlFor="loungeLocation" className="block text-sm font-medium text-gray-700 mb-2">Select Lounge *</label>
                <select
                    id="loungeLocation"
                    name="loungeLocation"
                    value={formData.loungeLocation}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-theme-brown focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm rounded-md shadow-sm"
                    required
                >
                    <option value="" disabled>Select Lounge...</option>
                    {lounges.map((lounge) => (
                        <option key={lounge.id} value={lounge.id}>
                            {lounge.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default StepLoungeSelect; 