'use client';

import React, { useState } from 'react';
import StepDestination from '@/components/step-destination';
import StepLoungeSelect from '@/components/step-lounge-select';
import StepCalendar from '@/components/step-calendar';
import StepAttendeeInfo from '@/components/step-attendee-info';
import StepConfirmation from '@/components/step-confirmation';

// Define the structure for your form data
interface FormData {
    destination: string;
    peopleCount: number;
    loungeLocation: string;
    appointmentSlot: string | null; // Placeholder type for now
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    therapy: string;
}

const BookingForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        destination: '',
        peopleCount: 1,
        loungeLocation: '',
        appointmentSlot: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        therapy: '',
    });

    // Determine total steps based on destination choice
    // Lounge: 1(Dest) -> 2(Lounge) -> 3(Cal) -> 4(Info) -> 5(Confirm)
    // Mobile: 1(Dest) -> 3(Cal) -> 4(Info) -> 5(Confirm) - Skipping step 2
    // Note: We might adjust this later if Mobile needs a different step 3/4 flow
    const isLoungeBooking = formData.destination === 'lounge';
    const totalStepsBeforeConfirmation = isLoungeBooking ? 4 : 3; // Steps 1 to 4 (Lounge) or 1, 3, 4 (Mobile)
    const confirmationStepNumber = totalStepsBeforeConfirmation + 1; // e.g., 5 or 4

    // --- Navigation Logic ---
    const handleNext = () => {
        setCurrentStep((prev) => {
            // Skip step 2 if destination is 'mobile'
            if (prev === 1 && !isLoungeBooking) {
                return 3; // Go from Step 1 directly to Step 3
            }
            // Ensure not going past confirmation
            if (prev < confirmationStepNumber) {
                return prev + 1;
            }
            return prev; // Stay on confirmation
        });
    };

    const handleBack = () => {
        setCurrentStep((prev) => {
            // Skip step 2 when going back from step 3 if destination is 'mobile'
            if (prev === 3 && !isLoungeBooking) {
                return 1; // Go from Step 3 directly back to Step 1
            }
            // Ensure not going before step 1
            if (prev > 1) {
                return prev - 1;
            }
            return prev; // Stay on step 1
        });
    };

    // Placeholder function for form submission (to be implemented later)
    const handleSubmit = () => {
        console.log("Form Submitted:", formData);
        setCurrentStep(confirmationStepNumber);
    };

    // Input change handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let processedValue: string | number = value;

        // Handle number input specifically for peopleCount
        if (name === 'peopleCount') {
            processedValue = parseInt(value, 10) || 1; // Default to 1 if parsing fails
        }

        setFormData((prev) => ({
            ...prev,
            [name]: processedValue,
        }));

        // Reset lounge location if destination changes away from 'lounge'
        if (name === 'destination' && value !== 'lounge') {
            setFormData((prev) => ({ ...prev, loungeLocation: '' }));
        }
    };

    // --- Render Logic --- 
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepDestination formData={formData} handleChange={handleInputChange} />;
            case 2:
                // Only render if it's a lounge booking and we are on step 2
                return isLoungeBooking ? <StepLoungeSelect formData={formData} handleChange={handleInputChange} /> : null;
            case 3:
                // Calendar step - shown for both lounge and mobile (after skipping step 2 for mobile)
                return <StepCalendar />; // Placeholder for now
            case 4:
                // Info step - shown for both
                return <StepAttendeeInfo formData={formData} handleChange={handleInputChange} />;
            case confirmationStepNumber: // Dynamically use the calculated confirmation step number
                return <StepConfirmation />;
            default:
                // Should not happen, but default to step 1
                return <StepDestination formData={formData} handleChange={handleInputChange} />;
        }
    };

    // Determine if the current step is the last *before* confirmation
    const isLastInputStep = currentStep === totalStepsBeforeConfirmation;

    return (
        // Apply semi-transparent background using bg-white/XX syntax
        // Adjusted padding and max-width for better appearance on background
        <div className="bg-white/80 p-6 md:p-10 rounded-lg shadow-xl max-w-xl w-full">
            {/* Optional: Add the welcome message from the image */}
            {currentStep === 1 && (
                <p className="text-gray-700 mb-6 text-center font-medium"> {/* Darker text for better contrast */}
                    Welcome to mobiVIve Bookings! We hope to see you soon.
                </p>
            )}

            {renderStep()}

            {currentStep !== confirmationStepNumber && (
                <div className="flex justify-end mt-8"> {/* Align button to the right */}
                    {/* Back Button - keep grey or style differently? Let's keep it simple for now */}
                    {currentStep > 1 && ( // Only show Back button after step 1
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-2 mr-4 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300"
                        >
                            Back
                        </button>
                    )}

                    {/* Next/Submit Button */}
                    {isLastInputStep ? (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-8 py-2 bg-theme-brown text-white rounded-md shadow-sm hover:bg-theme-brown-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-brown"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={currentStep === 1 && !formData.destination}
                            className="px-8 py-2 bg-theme-brown text-white rounded-md shadow-sm hover:bg-theme-brown-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-brown disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingForm; 