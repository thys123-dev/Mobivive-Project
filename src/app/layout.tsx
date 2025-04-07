import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "MobiBookings",
    description: "Book your appointment",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const bodyStyle: React.CSSProperties = {
        backgroundImage: `url('/images/lounge-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Keep the background fixed during scroll
        minHeight: '100vh', // Ensure body covers full viewport height
    };

    return (
        <html lang="en">
            {/* Apply inline styles for the background */}
            <body className={`${inter.className} antialiased`} style={bodyStyle}>
                {/* Change items-center to items-start and adjust top padding (e.g., pt-20) */}
                <div className="min-h-screen flex items-start justify-center pt-20 px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </body>
        </html>
    );
} 