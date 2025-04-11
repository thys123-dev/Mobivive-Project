'use client';

import React, { useState } from 'react';
import StepDestination from '@/components/step-destination';
import StepLoungeSelect from '@/components/step-lounge-select';
import StepTimeSlot from '@/components/step-time-slot';
import StepAttendeeInfo from '@/components/step-attendee-info';
import StepConfirmation from '@/components/step-confirmation';

// Define the structure for your form data
export interface AdditionalAttendee {
    firstName: string;
    lastName: string;
    therapy: string;
    email: string; // Add email
    phone: string; // Add phone
}

export interface Attendee {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    therapy: string;
}

export interface StepDestinationProps {
    destination: string;
    peopleCount: number;
    onDestinationSelect: (destination: string) => void;
    onPeopleCountChange: (count: number) => void;
}

export interface StepLoungeSelectProps {
    loungeId: string | null;
    onLoungeSelect: (id: string) => void;
}

export interface StepTimeSlotProps {
    loungeId: string | null;
    peopleCount: number;
    selectedSlot: string;
    onSlotSelect: (slot: string | null) => void;
}

export interface StepAttendeeInfoProps {
    peopleCount: number;
    attendees: Attendee[];
    onAttendeesChange: (attendees: Attendee[]) => void;
}

export interface FormData {
    destination: string;
    loungeId: string | null;
    peopleCount: number;
    appointmentSlot: string | null;
    attendees: Attendee[];
}

const initialFormData: FormData = {
    destination: '',
    loungeId: null,
    peopleCount: 1,
    appointmentSlot: null,
    attendees: [{
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        therapy: ''
    }]
};

const BookingForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bookingConfirmation, setBookingConfirmation] = useState<{ bookingId: string; startTime: string; endTime: string } | null>(null);

    // Determine steps (NEW API FLOW)
    // Lounge: 1(Dest) -> 2(Lounge) -> 3(Slot) -> 4(Info) -> 5(Confirm)
    // Mobile: 1(Dest) -> 3(Slot) -> 4(Info) -> 5(Confirm) - Skipping step 2
    const isLoungeBooking = formData.destination === 'lounge';
    const timeSlotStepNumber = isLoungeBooking ? 3 : 2; // Step 3 or 2
    const attendeeInfoStepNumber = timeSlotStepNumber + 1; // Step 4 or 3
    const confirmationStepNumber = attendeeInfoStepNumber + 1; // Step 5 or 4
    const totalInputSteps = attendeeInfoStepNumber; // All steps before confirmation

    // --- Navigation Logic --- 
    const handleNext = () => {
        setCurrentStep((prev) => {
            if (prev === 1 && !isLoungeBooking) {
                return timeSlotStepNumber; // Skip Lounge to Slot Select
            }
            // Add check: ensure slot is selected before moving from TimeSlotStep
            if (prev === timeSlotStepNumber && !formData.appointmentSlot) {
                console.warn('Cannot proceed without selecting a time slot.');
                return prev;
            }
            // Add check: ensure attendee info is valid before moving from AttendeeInfoStep
            if (prev === attendeeInfoStepNumber && !areAttendeesValid()) {
                console.warn('Cannot proceed without valid attendee info.');
                return prev;
            }
            // Increment step if not yet at confirmation
            if (prev < confirmationStepNumber) {
                return prev + 1;
            }
            return prev;
        });
    };

    const handleBack = () => {
        setCurrentStep((prev) => {
            if (prev === timeSlotStepNumber && !isLoungeBooking) {
                return 1; // Back from Slot Select (Mobile) to Destination
            }
            // Clear selected slot if going back from Attendee Info step
            if (prev === attendeeInfoStepNumber) {
                setFormData(f => ({ ...f, appointmentSlot: null }));
            }
            if (prev > 1) {
                return prev - 1;
            }
            return prev;
        });
    };

    // Handler for selecting a time slot
    const handleSlotSelect = (slot: string | null) => {
        setFormData(prev => ({
            ...prev,
            appointmentSlot: slot
        }));
    };

    // Input change handler for primary fields and peopleCount
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'peopleCount') {
            const count = parseInt(value, 10) || 1;
            const finalCount = count < 1 ? 1 : count;

            setFormData((prev) => {
                const currentAttendees = prev.attendees;
                const requiredAttendees = Math.max(0, finalCount - 1);
                let newAttendees = [...currentAttendees];

                if (newAttendees.length < requiredAttendees) {
                    for (let i = newAttendees.length; i < requiredAttendees; i++) {
                        newAttendees.push({ firstName: '', lastName: '', therapy: '', email: '', phone: '' });
                    }
                } else if (newAttendees.length > requiredAttendees) {
                    newAttendees = newAttendees.slice(0, requiredAttendees);
                }

                return {
                    ...prev,
                    peopleCount: finalCount,
                    attendees: newAttendees,
                };
            });
        } else if (['firstName', 'lastName', 'email', 'phone', 'therapy'].includes(name)) {
            // Update the primary attendee's information (first item in the attendees array)
            setFormData((prev) => ({
                ...prev,
                attendees: [
                    { ...prev.attendees[0], [name]: value },
                    ...prev.attendees.slice(1)
                ]
            }));
        } else {
            // Handle other form fields if any
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handler for changes in additional attendee fields (should handle therapy now)
    const handleAdditionalAttendeeChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updatedAttendees = [...prev.attendees];
            if (updatedAttendees[index]) {
                updatedAttendees[index] = {
                    ...updatedAttendees[index],
                    [name]: value, // Updates firstName, lastName, or therapy based on name
                };
            }
            return { ...prev, attendees: updatedAttendees };
        });
    };

    // --- Form Submission (Triggered after Attendee Info step) --- 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null); // Clear previous errors

        const [mainAttendee, ...additionalAttendees] = formData.attendees;

        const requestBody = {
            destination: formData.destination,
            loungeId: formData.loungeId,
            appointmentSlot: formData.appointmentSlot,
            mainAttendee,
            additionalAttendees
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json(); // Always parse the JSON response

            if (!response.ok) {
                // Extract specific error message from the backend response
                const errorMessage = result.calError?.message === 'booking_seats_full_error'
                    ? "Sorry, the selected time slot just became full. Please choose another time."
                    : result.details || result.message || 'Booking failed. Please try again.';

                console.error("API Error Response:", result); // Log the full error details
                throw new Error(errorMessage); // Throw specific error message
            }

            // Handle successful booking
            setBookingConfirmation({ // Assuming result has these fields on success
                bookingId: result.bookingId,
                startTime: result.startTime,
                endTime: result.endTime,
            })
            setCurrentStep(confirmationStepNumber); // Move to confirmation step

        } catch (error) {
            console.error('Error submitting booking:', error);
            // Set the specific error message for display
            setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if all required attendee fields are filled
    const areAttendeesValid = () => {
        return formData.attendees.every(attendee =>
            attendee.firstName &&
            attendee.lastName &&
            attendee.email &&
            attendee.phone &&
            attendee.therapy
        );
    };

    // --- Render Logic --- 
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepDestination
                        formData={{
                            destination: formData.destination,
                            peopleCount: formData.peopleCount
                        }}
                        handleChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <StepLoungeSelect
                        formData={{
                            loungeLocation: formData.loungeId || ''
                        }}
                        handleChange={(e) => {
                            const { value } = e.target;
                            setFormData(prev => ({ ...prev, loungeId: value }));
                        }}
                    />
                );
            case 3:
                return (
                    <StepTimeSlot
                        selectedLoungeId={formData.loungeId || ''}
                        peopleCount={formData.peopleCount}
                        selectedSlot={formData.appointmentSlot || ''}
                        onSlotSelect={handleSlotSelect}
                    />
                );
            case 4:
                return (
                    <StepAttendeeInfo
                        formData={{
                            firstName: formData.attendees[0]?.firstName || '',
                            lastName: formData.attendees[0]?.lastName || '',
                            email: formData.attendees[0]?.email || '',
                            phone: formData.attendees[0]?.phone || '',
                            therapy: formData.attendees[0]?.therapy || '',
                            peopleCount: formData.peopleCount,
                            additionalAttendees: formData.attendees.slice(1).map(attendee => ({
                                firstName: attendee.firstName,
                                lastName: attendee.lastName,
                                email: attendee.email,
                                phone: attendee.phone,
                                therapy: attendee.therapy
                            }))
                        }}
                        handleChange={handleInputChange}
                        handleAdditionalAttendeeChange={handleAdditionalAttendeeChange}
                    />
                );
            case 5:
                return <StepConfirmation />;
            default:
                return null;
        }
    };

    const isLastInputStep = currentStep === attendeeInfoStepNumber; // Last step before confirmation

    return (
        <div className="bg-white/80 p-6 md:p-10 rounded-lg shadow-xl max-w-3xl w-full">
            {/* Optional: Add the welcome message from the image */}
            {currentStep === 1 && (
                <p className="text-gray-700 mb-6 text-center font-medium"> {/* Darker text for better contrast */}
                    Welcome to mobiVIve Bookings! We hope to see you soon.
                </p>
            )}

            {/* Display submission error if present */}
            {submitError && currentStep === totalInputSteps && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p><strong>Booking Error:</strong> {submitError}</p>
                </div>
            )}

            {renderStep()}

            {currentStep !== confirmationStepNumber && (
                <div className="flex justify-end mt-8">
                    {/* Back Button */}
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="px-6 py-2 mr-4 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 disabled:opacity-50"
                        >
                            Back
                        </button>
                    )}

                    {/* Next or Submit Button */}
                    {isLastInputStep ? (
                        // Show Submit button on the Attendee Info step
                        <div className="flex flex-col items-end"> {/* Container for button */}
                            <button
                                type="button"
                                onClick={handleSubmit} // Submit triggers backend booking
                                disabled={!areAttendeesValid() || !formData.appointmentSlot || isSubmitting} // Check slot selected and attendee validity
                                className="px-8 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                            </button>
                        </div>
                    ) : (
                        // Show Next button on earlier steps
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !formData.destination) ||
                                (currentStep === 2 && isLoungeBooking && !formData.loungeId) ||
                                (currentStep === timeSlotStepNumber && !formData.appointmentSlot) // Disable if slot not selected (date check implied)
                            }
                            className="px-8 py-2 bg-theme-brown text-white rounded-md shadow-sm hover:bg-theme-brown-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-brown disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentStep === timeSlotStepNumber ? 'Next: Enter Details' : 'Next'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookingForm; 