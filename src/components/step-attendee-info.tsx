'use client'; // Convert to Client Component

import React from 'react';
import { THERAPY_OPTIONS } from '@/lib/constants'; // Import therapy options

// Update props interface
interface StepAttendeeInfoProps {
    formData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        therapy: string;
        peopleCount: number; // Add peopleCount
        additionalAttendees: { firstName: string; lastName: string; therapy: string; email: string; phone: string; }[]; // Add therapy here
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleAdditionalAttendeeChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Add handler prop
}

const StepAttendeeInfo: React.FC<StepAttendeeInfoProps> = ({
    formData,
    handleChange,
    handleAdditionalAttendeeChange // Destructure new handler
}) => {
    // Use imported constant
    // const therapyOptions = [...]; // Remove hardcoded array

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
            <div className="mb-6">
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
                    {/* Map over imported THERAPY_OPTIONS */}
                    {THERAPY_OPTIONS.map((therapy) => (
                        <option key={therapy.id} value={therapy.id}>
                            {therapy.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Additional Attendees Section - Rendered Dynamically */}
            {formData.peopleCount > 1 && formData.additionalAttendees.map((attendee, index) => (
                <div key={`attendee-${index}`} className="mb-6 border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Attendee #{index + 2} Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                        {/* Additional Attendee First Name */}
                        <div>
                            <label htmlFor={`addFirstName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                            <input
                                type="text"
                                id={`addFirstName-${index}`}
                                name={`firstName`}
                                value={attendee.firstName}
                                onChange={(e) => handleAdditionalAttendeeChange(index, e)}
                                className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                                required
                            />
                        </div>
                        {/* Additional Attendee Last Name */}
                        <div>
                            <label htmlFor={`addLastName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input
                                type="text"
                                id={`addLastName-${index}`}
                                name={`lastName`}
                                value={attendee.lastName}
                                onChange={(e) => handleAdditionalAttendeeChange(index, e)}
                                className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                                required
                            />
                        </div>
                        {/* Additional Attendee Email */}
                        <div>
                            <label htmlFor={`addEmail-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input
                                type="email"
                                id={`addEmail-${index}`}
                                name={`email`}
                                value={attendee.email}
                                onChange={(e) => handleAdditionalAttendeeChange(index, e)}
                                className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                                required
                            />
                        </div>
                        {/* Additional Attendee Phone */}
                        <div>
                            <label htmlFor={`addPhone-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                id={`addPhone-${index}`}
                                name={`phone`}
                                value={attendee.phone}
                                onChange={(e) => handleAdditionalAttendeeChange(index, e)}
                                placeholder="+27 12 345 6789"
                                className="mt-1 block w-full border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                                required
                            />
                        </div>
                        {/* Additional Attendee Therapy Selection */}
                        <div className="md:col-span-2">
                            <label htmlFor={`addTherapy-${index}`} className="block text-sm font-medium text-gray-700 mb-2">Select IV Therapy *</label>
                            <select
                                id={`addTherapy-${index}`}
                                name={`therapy`}
                                value={attendee.therapy}
                                onChange={(e) => handleAdditionalAttendeeChange(index, e)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-theme-brown focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm rounded-md shadow-sm"
                                required
                            >
                                <option value="" disabled>Select Therapy...</option>
                                {THERAPY_OPTIONS.map((therapy) => (
                                    <option key={therapy.id} value={therapy.id}>
                                        {therapy.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StepAttendeeInfo; 