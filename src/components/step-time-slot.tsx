'use client';

import React, { useState, useEffect } from 'react';
import { LOUNGE_DATA_MAP } from '@/lib/constants'; // Import lounge map for eventTypeId

interface TimeSlot {
    time: string;
    remainingSeats?: number;
}

// Define props (will need loungeId, peopleCount, selected date range, onSlotSelect callback)
interface StepTimeSlotProps {
    selectedLoungeId: string;
    peopleCount: number;
    selectedSlot: string | null; // Track which slot is chosen
    onSlotSelect: (slot: string | null) => void; // Callback when slot is clicked
}

const StepTimeSlot: React.FC<StepTimeSlotProps> = ({
    selectedLoungeId,
    peopleCount,
    selectedSlot,
    onSlotSelect
}) => {
    const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD format
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch available slots when lounge, peopleCount, OR selectedDate changes
    useEffect(() => {
        const fetchSlots = async () => {
            // Don't fetch if required info is missing
            if (!selectedLoungeId || !selectedDate) {
                setAvailableSlots([]);
                return;
            }

            const loungeData = LOUNGE_DATA_MAP[selectedLoungeId];
            const eventTypeId = loungeData?.eventTypeId;

            if (!eventTypeId) {
                setError("Configuration error: Event Type ID not found for selected lounge.");
                setAvailableSlots([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Construct startTime and endTime for the selected date in UTC
                // Adjust based on desired time zone handling if needed
                const startTimeUTC = `${selectedDate}T00:00:00Z`;
                const endTimeUTC = `${selectedDate}T23:59:59Z`;

                const apiUrl = new URL('/api/availability', window.location.origin); // Use relative URL
                apiUrl.searchParams.append('eventTypeId', eventTypeId.toString());
                apiUrl.searchParams.append('startTime', startTimeUTC);
                apiUrl.searchParams.append('endTime', endTimeUTC);
                apiUrl.searchParams.append('seats', peopleCount.toString()); // Pass seats parameter

                console.log(`Fetching slots from API: ${apiUrl.toString()}`);

                const response = await fetch(apiUrl.toString());
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch slots');
                }

                setAvailableSlots(data.availableSlots || []);
                if (!data.availableSlots || data.availableSlots.length === 0) {
                    console.log("No slots returned from API for", selectedDate);
                }

                // Log the slots we received
                console.log("Received slots with remaining seats:", data.availableSlots);

            } catch (err) {
                console.error("Error fetching slots:", err);
                setError(err instanceof Error ? err.message : 'Could not load times');
                setAvailableSlots([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();

    }, [selectedLoungeId, peopleCount, selectedDate]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        onSlotSelect(null); // Clear selected slot when date changes
    };

    // Basic date formatting (can be improved)
    const formatTime = (isoString: string): string => {
        try {
            return new Date(isoString).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return isoString;
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Step 3: Select Date & Time</h3>

            {/* Date Picker */}
            <div className="mb-6">
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">Select Date *</label>
                <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getTodayDateString()} // Prevent selecting past dates
                    className="mt-1 block w-full md:w-1/2 border border-theme-brown rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-theme-brown focus:border-theme-brown sm:text-sm"
                    required
                />
            </div>

            {/* Time Slot Display (conditional) */}
            {selectedDate && (
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-1">Available Times for {selectedDate}:</h4>
                    <p className="text-sm text-gray-600 mb-3">Showing times with at least {peopleCount} seat(s) available.</p>

                    {isLoading && <p className="text-gray-500 italic">Loading available times...</p>}
                    {error && <p className="text-red-600">Error loading times: {error}</p>}

                    {!isLoading && !error && availableSlots.length === 0 && (
                        <p className="text-gray-500">No available slots found for this date. Please select another date.</p>
                    )}

                    {!isLoading && !error && availableSlots.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                            {availableSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    type="button"
                                    onClick={() => onSlotSelect(slot.time)}
                                    className={`p-3 border rounded-md text-center text-sm transition-colors ${selectedSlot === slot.time
                                        ? 'bg-theme-brown text-white border-theme-brown ring-2 ring-theme-brown ring-offset-1'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    <div>{formatTime(slot.time)}</div>
                                    {slot.remainingSeats !== undefined && (
                                        <div className="text-xs mt-1">
                                            {slot.remainingSeats} seats left
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StepTimeSlot; 