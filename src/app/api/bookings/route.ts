import { NextResponse } from 'next/server';
import { LOUNGE_DATA_MAP, BOOKING_DURATION_MINUTES } from '@/lib/constants';

// v2 Booking API requires this specific date format
const CAL_API_VERSION = '2024-08-13';
const DEFAULT_TIMEZONE = 'Africa/Johannesburg';

// Define the expected structure of the incoming data (matches frontend FormData)
interface BookingRequestBody {
    destination: string;
    loungeId: string | null;
    appointmentSlot: string; // ISO start time string
    mainAttendee: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        therapy: string;
    };
    additionalAttendees: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        therapy: string;
    }[];
}

// No longer needed as duration is passed in payload
// function calculateEndTime(startTimeISO: string): string {
//     const startDate = new Date(startTimeISO);
//     const endDate = new Date(startDate.getTime() + BOOKING_DURATION_MINUTES * 60000);
//     return endDate.toISOString();
// }

export async function POST(request: Request) {
    // --- 1. Read Environment Variables --- 
    const calApiKey = process.env.CAL_API_KEY;
    console.log("Cal.com API Key available:", !!calApiKey); // Log if API key exists (but don't log the actual key)
    const zohoClientId = process.env.ZOHO_CLIENT_ID;
    // ... read other Zoho vars ...

    if (!calApiKey) {
        console.error("Cal.com API Key missing in environment variables.");
        return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }
    // Add checks for Zoho variables later

    try {
        const body: BookingRequestBody = await request.json();
        console.log("Received booking request (for v2 API):", body);

        // Validate required fields
        if (!body.appointmentSlot ||
            !body.mainAttendee?.email ||
            !body.mainAttendee?.firstName ||
            !body.mainAttendee?.lastName ||
            !body.mainAttendee?.therapy) {
            return NextResponse.json({
                message: "Missing required fields for main attendee or appointment slot",
            }, { status: 400 });
        }

        // Validate lounge booking
        if (body.destination === 'lounge' && !body.loungeId) {
            return NextResponse.json({
                message: "Missing lounge ID for lounge booking",
            }, { status: 400 });
        }

        // Get lounge data
        const loungeData = body.loungeId ? LOUNGE_DATA_MAP[body.loungeId] : null;
        if (body.destination === 'lounge' && !loungeData?.eventTypeId) {
            return NextResponse.json({
                message: "Invalid lounge selection or missing event type ID",
            }, { status: 400 });
        }

        // Prepare Cal.com v2 API Request Body
        const calV2BookingPayload = {
            start: body.appointmentSlot, // ISO String
            eventTypeId: loungeData?.eventTypeId, // Ensure this is required only for lounge bookings
            attendee: {
                name: `${body.mainAttendee.firstName} ${body.mainAttendee.lastName}`.trim(),
                email: body.mainAttendee.email,
                timeZone: DEFAULT_TIMEZONE,
                // phone is not a direct field in v2 attendee, put in metadata or notes if needed
            },
            // Map additional attendees to the guests array (emails only)
            guests: body.additionalAttendees.map(att => att.email).filter(email => !!email),
            // location: { type: "address" }, // Optional: Define if needed, e.g., using lounge address
            metadata: {
                primaryPhone: body.mainAttendee.phone,
                primaryTherapy: body.mainAttendee.therapy,
                destination: body.destination,
                // Add details for additional attendees if needed, Cal.com might not show this well
                additionalAttendeeDetails: JSON.stringify(body.additionalAttendees.map(a => ({ name: `${a.firstName} ${a.lastName}`, therapy: a.therapy, phone: a.phone })))
            },
            // Consider if notes are still needed or if metadata covers it
            // notes: `Primary Therapy: ${body.mainAttendee.therapy}...` 
        };

        console.log("Making Cal.com v2 booking with payload:", JSON.stringify(calV2BookingPayload, null, 2));

        // --- Call Cal.com v2 API --- 
        const calApiUrl = 'https://api.cal.com/v2/bookings'; // v2 endpoint

        const calResponse = await fetch(calApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cal-api-version': CAL_API_VERSION, // Add version header
                'Authorization': `Bearer ${calApiKey}` // Use Bearer token
            },
            body: JSON.stringify(calV2BookingPayload)
        });

        const calResult = await calResponse.json();

        if (!calResponse.ok) {
            console.error("Cal.com v2 Booking Error Response:", JSON.stringify(calResult, null, 2));
            // Assuming v2 error structure might be different, adjust parsing if needed
            const errorDetails = calResult.message || calResult.details || calResponse.statusText;
            // Map specific v2 error codes if known, e.g., seats full
            const userMessage = errorDetails.includes('full') || errorDetails.includes('capacity')
                ? "Sorry, the selected time slot just became full or does not have enough seats. Please choose another time."
                : `Failed to create booking: ${errorDetails}`;

            return NextResponse.json({
                message: userMessage,
                details: errorDetails,
                calError: calResult // Keep original error
            }, { status: calResponse.status }); // Use status from Cal.com response
        }

        console.log("Cal.com v2 Booking Success:", calResult);

        // --- 5. Zoho CRM Integration (Placeholder) --- 
        console.log("Proceeding to Zoho CRM integration (placeholder)...", body);
        // TODO: Implement Zoho Auth (get access token using refresh token)
        // TODO: Search Zoho Contact/Lead by email/phone (body.email, body.phone)
        // TODO: If exists, Update Zoho record with new booking details (appointment time, therapy, attendees?)
        // TODO: If not exists, Create new Zoho Lead with all details
        await new Promise(resolve => setTimeout(resolve, 500)); // Placeholder delay

        // --- 6. Return Success Response --- 
        // Adjust field names based on actual v2 success response if needed
        return NextResponse.json({
            message: "Booking confirmed successfully",
            bookingId: calResult.booking?.uid || calResult.uid, // Adapt based on v2 response structure
            startTime: calResult.booking?.startTime || body.appointmentSlot,
            endTime: calResult.booking?.endTime // v2 might return endTime directly
        }, { status: 200 });

    } catch (error) {
        console.error("Error processing booking:", error);
        return NextResponse.json({
            message: "Failed to process booking request",
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
} 