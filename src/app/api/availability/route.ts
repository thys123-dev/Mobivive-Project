import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server'

// v2 API version header
const CAL_API_VERSION = '2024-08-13';
const DEFAULT_TIMEZONE = 'Africa/Johannesburg';

// Helper function to fetch event type details (including seats)
async function getEventTypeDetails(eventTypeId: string, apiKey: string): Promise<{ seatsPerTimeSlot: number } | null> {
    // --- Try v1 Endpoint First --- 
    const v1Url = `https://api.cal.com/v1/event-types/${eventTypeId}?apiKey=${apiKey}`;
    console.log(`Attempting to fetch event type details from v1: ${v1Url}`);
    try {
        const v1Response = await fetch(v1Url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (v1Response.ok) {
            const v1Data = await v1Response.json();
            console.log(`Successfully fetched event type details from v1 for ${eventTypeId}`);
            // Adjust path based on v1 response structure for seats
            // CORRECTED PATH: Use event_type (snake_case) then seatsPerTimeSlot (camelCase)
            const seats = v1Data?.event_type?.seatsPerTimeSlot;
            if (typeof seats === 'number' && seats > 0) {
                console.log(`Found seatsPerTimeSlot (${seats}) via v1 API.`);
                return { seatsPerTimeSlot: seats };
            }
            console.warn(`Could not find valid seatsPerTimeSlot in v1 response for event type ${eventTypeId}. Response:`, v1Data);
        } else {
            console.warn(`Failed to fetch event type ${eventTypeId} details from v1: Status ${v1Response.status}`, await v1Response.text());
        }

    } catch (error) {
        console.error(`Error fetching event type ${eventTypeId} details from v1:`, error);
    }

    // --- Fallback: Try v2 Endpoint (Original Attempt) --- 
    // Keep the v2 attempt as a fallback, although it failed previously
    const v2Url = `https://api.cal.com/v2/event-types/${eventTypeId}`;
    console.log(`Falling back to fetch event type details from v2: ${v2Url}`);
    try {
        const v2Response = await fetch(v2Url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cal-api-version': CAL_API_VERSION,
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!v2Response.ok) {
            console.error(`Failed to fetch event type ${eventTypeId} details from v2: Status ${v2Response.status}`, await v2Response.text());
            return null; // v2 also failed
        }
        const v2Data = await v2Response.json();
        console.log(`Successfully fetched event type details from v2 for ${eventTypeId}`);
        // Adjust path based on actual v2 response structure for seats
        const seats = v2Data?.eventType?.seats?.seatsPerTimeSlot;
        if (typeof seats === 'number' && seats > 0) {
            console.log(`Found seatsPerTimeSlot (${seats}) via v2 API.`);
            return { seatsPerTimeSlot: seats };
        } else {
            console.warn(`Could not find valid seatsPerTimeSlot in v2 response for event type ${eventTypeId}. Response:`, v2Data);
            return null; // Return null if seats not found or invalid in v2 response
        }
    } catch (error) {
        console.error(`Error fetching event type ${eventTypeId} details from v2:`, error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const calApiKey = process.env.CAL_API_KEY;
    if (!calApiKey) {
        console.error("Cal.com API Key missing in environment variables.");
        return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const eventTypeId = searchParams.get('eventTypeId');
    const startTime = searchParams.get('startTime'); // Expected format: YYYY-MM-DDTHH:mm:ssZ
    const endTime = searchParams.get('endTime'); // Expected format: YYYY-MM-DDTHH:mm:ssZ
    const requestedSeats = parseInt(searchParams.get('seats') || '1', 10); // Still need this from frontend

    if (!eventTypeId || !startTime || !endTime) {
        return NextResponse.json({ message: "Missing required query parameters: eventTypeId, startTime, endTime." }, { status: 400 });
    }

    try {
        // --- 1. Fetch Event Type Details (using v1 API via helper) --- 
        const eventDetails = await getEventTypeDetails(eventTypeId, calApiKey);
        if (!eventDetails) {
            console.error(`Could not determine seat capacity for event type ${eventTypeId}.`);
            return NextResponse.json({ message: `Configuration error: Could not determine seat capacity for event type ${eventTypeId}.` }, { status: 500 });
        }
        const seatsPerTimeSlot = eventDetails.seatsPerTimeSlot;
        console.log(`Determined seatsPerTimeSlot for event ${eventTypeId}: ${seatsPerTimeSlot} (via v1 event type details)`);

        // --- 2. Construct Cal.com v1 Slots API URL --- 
        const calSlotsUrl = new URL('https://api.cal.com/v1/slots');
        calSlotsUrl.searchParams.append('apiKey', calApiKey); // Use apiKey for v1
        calSlotsUrl.searchParams.append('eventTypeId', eventTypeId);
        calSlotsUrl.searchParams.append('startTime', startTime);
        calSlotsUrl.searchParams.append('endTime', endTime);
        calSlotsUrl.searchParams.append('timezone', DEFAULT_TIMEZONE);
        // Note: v1 /slots API *does* have a 'seats' param, but we will filter manually using accurate seatsPerTimeSlot
        // So, we don't add the 'seats' param here to get *all* slots for the period

        console.log(`Fetching Cal.com v1 slots for eventTypeId=${eventTypeId}`);
        console.log(`Time range: ${startTime} to ${endTime}`);
        console.log(`Full URL: ${calSlotsUrl.toString()}`);

        // --- 3. Call Cal.com v1 Slots API --- 
        const calResponse = await fetch(calSlotsUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // v1 Headers
            },
        });

        const calResult = await calResponse.json();

        if (!calResponse.ok) {
            console.error("Cal.com v1 Slots API Error:", JSON.stringify(calResult, null, 2));
            throw new Error(calResult.message || `Failed to fetch v1 availability: ${calResponse.statusText}`);
        }

        console.log("Cal.com v1 Raw API Response:", JSON.stringify(calResult, null, 2));

        // --- 4. Process v1 Slots Response --- 
        let availableSlots: Array<{ time: string; remainingSeats?: number }> = [];
        const requestedDate = startTime?.split('T')[0]; // YYYY-MM-DD

        if (calResult?.slots && typeof calResult.slots === 'object' && calResult.slots[requestedDate]) {
            const slotsForDate = calResult.slots[requestedDate];
            if (Array.isArray(slotsForDate)) {
                slotsForDate.forEach(slot => {
                    // Log raw v1 slot data
                    console.log(`Raw v1 slot data for ${slot.time}:`, JSON.stringify(slot, null, 2));

                    const currentAttendees = slot.attendees || 0; // Use v1 'attendees' field
                    const remainingSeats = seatsPerTimeSlot - currentAttendees; // Calculate based on accurate max seats

                    console.log(`Slot ${slot.time}: MaxSeats=${seatsPerTimeSlot}, Attendees=${currentAttendees}, Remaining=${remainingSeats}, Requested=${requestedSeats}`);

                    // Filter based on remaining seats AND the number requested by the user
                    if (remainingSeats >= requestedSeats) {
                        availableSlots.push({
                            time: slot.time, // Use v1 'time' field
                            remainingSeats: remainingSeats
                        });
                    } else {
                        console.log(`Filtered out slot ${slot.time} - Only ${remainingSeats} seats left, but ${requestedSeats} requested.`);
                    }
                });
            }
        }

        console.log("Processed v1 slots with remaining seats:", availableSlots);

        return NextResponse.json({ availableSlots }, { status: 200 });

    } catch (error) {
        console.error("API Error fetching v1 availability:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
        return NextResponse.json({ message: "Error fetching availability", error: errorMessage }, { status: 500 });
    }
} 