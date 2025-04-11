// Define lounge data including Cal.com URLs and Event Type IDs

export const LOUNGES = [
    { id: 'table_bay', name: 'Table Bay Mall', calLink: 'https://cal.com/thys123/table-bay-mall-bookings', eventTypeId: 2230830 },
    { id: 'camps_bay', name: 'Camps Bay', calLink: 'https://cal.com/thys123/camps-bay-bookings', eventTypeId: 2231011 },
    { id: 'durbanville', name: 'Durbanville', calLink: 'https://cal.com/thys123/durbanville-bookings', eventTypeId: 2231049 },
    { id: 'paarl', name: 'Paarl', calLink: 'https://cal.com/thys123/paarl-bookings', eventTypeId: 2231140 },
    { id: 'somerset_west', name: 'Somerset West', calLink: 'https://cal.com/thys123/somerset-west-bookings', eventTypeId: 2231026 },
    { id: 'stellenbosch', name: 'Stellenbosch', calLink: 'https://cal.com/thys123/stellenbosch-bookings', eventTypeId: 2231061 },
    // Add placeholder for mobile booking if it needs a specific (different) Event Type ID later
    // { id: 'mobile', name: 'Mobile Service', calLink: '', eventTypeId: null },
];

// Create maps for easier lookup
export const LOUNGE_DATA_MAP: { [key: string]: { name: string; calLink: string; eventTypeId: number | null } } = LOUNGES.reduce((acc, lounge) => {
    acc[lounge.id] = { name: lounge.name, calLink: lounge.calLink, eventTypeId: lounge.eventTypeId };
    return acc;
}, {} as { [key: string]: { name: string; calLink: string; eventTypeId: number | null } });

// Booking Duration
export const BOOKING_DURATION_MINUTES = 30;

// Therapy Options (already exists)
export const THERAPY_OPTIONS = [
    { id: 'therapy_1', name: 'Immune Boost IV' },
    { id: 'therapy_2', name: 'Energy Recharge IV' },
    { id: 'therapy_3', name: 'Hydration Deluxe IV' },
]; 