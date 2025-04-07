'use client'; // Convert to Client Component

import React from 'react';

// Define props interface
interface StepAttendeeInfoProps {
    formData: { // Include relevant parts
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        therapy: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StepAttendeeInfo: React.FC<StepAttendeeInfoProps> = ({ formData, handleChange }) => {
    // Placeholder - these would ideally come from a config or API later
    const therapyOptions = [
        { id: 'therapy_1', name: 'Immune Boost IV' },
        { id: 'therapy_2', name: 'Energy Recharge IV' },
        { id: 'therapy_3', name: 'Hydration Deluxe IV' },
    ];

    return (
        <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">Please provide details for the primary attendee.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mb-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+27 12 345 6789"
                        className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                        required
                    />
                </div>
            </div>
            <div>
                <label htmlFor="therapy" className="block text-sm font-medium text-gray-700 mb-2">Select IV Therapy *</label>
                <select
                    id="therapy"
                    name="therapy"
                    value={formData.therapy}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-theme-brown focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm rounded-md shadow-sm"
                    required
                >
                    <option value="" disabled>Select Therapy...</option>
                    {therapyOptions.map((therapy) => (
                        <option key={therapy.id} value={therapy.id}>
                            {therapy.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default StepAttendeeInfo; 