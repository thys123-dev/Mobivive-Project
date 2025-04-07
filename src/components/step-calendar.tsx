import React from 'react';

const StepCalendar: React.FC = () => {
    return (
        <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Appointment Date & Time *</label>
            <div className="p-4 bg-gray-50 border border-theme-brown rounded-md min-h-[300px] flex items-center justify-center mt-1">
                <p className="text-gray-500 italic">Calendar loading...</p>
                {/* Cal.com iframe will be embedded here later */}
            </div>
        </div>
    );
};

export default StepCalendar; 