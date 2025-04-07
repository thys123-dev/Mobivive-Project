import React from 'react';

const StepConfirmation: React.FC = () => {
    return (
        <div className="mb-6 p-6 border border-green-400 bg-green-50 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold mb-3 text-green-800">Step 5: Booking Request Submitted!</h2>
            <p className="text-green-700">
                Thank you! Your booking request has been received. We will contact you shortly if any further details are needed.
            </p>
            {/* Maybe add a link back to the homepage or details about what happens next */}
        </div>
    );
};

export default StepConfirmation; 