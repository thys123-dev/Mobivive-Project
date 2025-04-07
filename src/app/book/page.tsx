import React from 'react';
import BookingForm from '@/components/booking-form';

export default function BookPage() {
    return (
        <div className="w-full">
            <h1 className="text-4xl font-bold text-center mb-8 text-theme-brown">
                Book Your IV Therapy
            </h1>

            <div className="flex justify-center">
                <BookingForm />
            </div>

            {/* The redundant buttons previously here have been removed */}

        </div>
    );
} 