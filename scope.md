Project Scope Document: mobiViVe Online Booking Page (Version 4 - with API Docs Reminder & Locations)

1. Project Overview

Project Title: mobiViVe Multi-Location Online Booking System with Cal.com & Zoho CRM Integration (Next.js 14 Implementation)

Objectives:

Develop a user-friendly, multi-step online booking page for mobiViVe IV therapy services using Next.js 14.

Allow users to choose between booking at one of 6 physical lounge locations or requesting mobile service (home/office). The specific lounge locations are: Table Bay Mall, Camps Bay, Durbanville, Paarl, Somerset West, and Stellenbosch.

Integrate Cal.com to manage real-time appointment availability for each of the 6 lounge locations independently, preventing double bookings by greying out unavailable slots.

Integrate Zoho CRM via secure, server-side API calls to:

Check if a booking user (based on email/phone) already exists as a Contact/Lead.

If exists: Update the existing record with the new appointment details.

If not exists: Create a new Lead in Zoho CRM.

Provide a seamless and intuitive booking experience reflecting positively on the mobiViVe brand.

Target Audience: Individuals seeking IV therapy treatments via online booking.

Scope:

In Scope: Frontend development of the multi-step booking form UI/UX following Next.js 14 App Router conventions; JavaScript/TypeScript for form logic, navigation, and conditional display; Dynamic embedding and interaction with Cal.com; Backend development (via Next.js API Routes) for handling form submissions; Secure server-side API integration with Zoho CRM; Adherence to specified technical guidelines (project structure, data fetching, error handling, TypeScript). Includes logic for the 6 specified lounges and the initial selection for mobile service.

Out of Scope (Initially): User account creation/login system; Payment processing integration; Complex scheduling/routing logic for the "Your home/office" option beyond initial selection; Full website redesign; Admin panel for managing locations/treatments (assumed managed in Cal.com/Zoho).

Business Value: This booking page is a primary customer acquisition channel. A smooth, reliable, and technically sound booking process is critical for customer satisfaction, operational efficiency, and business success.

2. Core Functionalities (Based on Guide)

User Requirements (Prioritized):

Essential (Must-Have):

Select Treatment Destination (Dropdown: "Our treatment lounge", "Your home, office...").

Specify Number of People Attending (Number Input).

If Lounge: Select specific Lounge Location (Dropdown: Table Bay Mall, Camps Bay, Durbanville, Paarl, Somerset West, Stellenbosch).

If Lounge: View real-time availability calendar specific to the selected lounge (via Cal.com).

If Lounge: Select an available Date & Time slot (unavailable slots visually indicated/disabled).

Enter Attendee Information (Person 1): First Name, Last Name, Email, Phone Number (with country code input).

Select desired IV Therapy (Dropdown).

Submit the complete booking request.

Receive clear confirmation or error feedback upon submission.

Important (Should-Have):

Intuitive multi-step form navigation (Next/Back buttons).

Mobile-responsive design for accessibility on various devices.

Secure data handling (HTTPS, backend validation).

Optional (Could-Have / Future):

Functionality to input details for multiple attendees if Number of People > 1.

Advanced workflow for "Your home/office" bookings (e.g., address capture, service area validation).

Primary Functions:

Multi-step Form Navigation (Client-side logic).

Conditional Logic (Client-side).

Dynamic Content Loading (Cal.com calendar - potentially requires client-side updates based on selection).

Appointment Slot Selection & Booking (via Cal.com embed interaction).

User Data Capture (Client-side form state).

Form Data Submission (Client-side triggers call to internal Next.js API route).

Backend (Next.js API Route): Zoho CRM Client Lookup (Server-side API call).

Backend (Next.js API Route): Zoho CRM Lead Creation (Server-side API call).

Backend (Next.js API Route): Zoho CRM Contact/Lead Update (Server-side API call).

User Interface (UI):

Layout: Multi-step form within a Next.js Page component (/app). Reusable UI elements as Components (/components).

Components: Dropdowns, Number Input, Text Inputs, Embedded Calendar (Cal.com iframe), Buttons. Implement using React components, marking interactive ones with 'use client'.

Design: Clean, professional, matching mobiViVe branding. Consistent visual feedback (loading states, success/error messages handled in client components).

Accessibility: Mobile-responsive. Aim for WCAG 2.1 Level AA.

Data Management:

Initial Data: Any static data (e.g., list of lounges, therapy options if not dynamic) can be fetched in Server Components and passed as props.

Form State: Managed within Client Components using React hooks (useState).

Submission: Client Components send collected form state to internal Next.js API routes.

External Data (Zoho/Cal.com): Fetched/Mutated exclusively via server-side logic within Next.js API routes (/app/api/...).

Storage: Data primarily stored in Zoho CRM / Cal.com.

Mapping: Clear mapping between form fields and Zoho CRM Lead/Contact fields (including custom fields if needed for Appointment Date/Time, Location, Treatment, People Count).

Privacy: Handle PII (Name, Email, Phone) securely according to relevant regulations (e.g., POPIA, GDPR if applicable).

Interactivity and User Engagement:

Dynamic form changes based on user selection (Destination -> Lounge List).

Dynamic loading of the appropriate Cal.com calendar.

Real-time availability shown by Cal.com (greyed-out slots).

Clear success/error messages post-submission.

Backend Functionalities (Implemented as Next.js API Routes in /app/api/...):

API Routes: Create dedicated API routes (e.g., /api/bookings) to handle form submissions and encapsulate Zoho interactions.

Server-Side Only Logic: All communication with Zoho CRM API occurs strictly within these API routes. Client-side code never interacts directly with Zoho.

Zoho CRM API Integration:

Utilize Zoho CRM API (latest version).

Implement OAuth 2.0 for authentication server-side.

Logic (within API Route): Receive data -> Search Zoho -> Create/Update -> Return response.

Handle API rate limits and errors.

API Client Initialization: Initialize Zoho API client(s) securely within the server-side environment (API routes or dedicated server modules). Include checks for proper initialization.

Performance and Scalability:

Leverage Next.js features (Server Components, Route Handlers) for efficient rendering and backend logic.

Primary scaling dependencies remain Cal.com and Zoho CRM.

Security:

HTTPS enforced.

Server-side validation of all incoming data within API routes.

Environment Variables: Store Zoho API keys and other secrets in .env.local (add to .gitignore) for local development. Access only via process.env in server-side code (API routes, Server Components). For production (Vercel etc.), configure environment variables via the platform's settings. Do not use the NEXT_PUBLIC_ prefix for sensitive keys.

Protection against basic web vulnerabilities (framework defaults or manual checks).

Testing and Debugging Capabilities:

Server-Side Logging: Implement comprehensive logging within API routes, especially for Zoho interactions and errors.

Client-Side Error Display: Show user-friendly error messages based on API route responses.

Manual end-to-end testing.

User Feedback Mechanisms: (Out of scope for initial build, rely on existing website contact methods).

Localization and Accessibility:

Language: English (initially).

Accessibility: Strive for WCAG 2.1 Level AA compliance where feasible (semantic HTML, contrasts, keyboard navigation).

3. Technology Stack

Framework: Next.js 14 (App Router)

Language: TypeScript

Frontend: React (Server Components & Client Components), HTML5, CSS3 (Tailwind CSS recommended, or standard CSS modules).

Calendar Integration: Cal.com (Embedded iframe).

CRM Integration: Zoho CRM (REST API via server-side calls).

State Management (Client): React Hooks (useState, useContext if needed).

Hosting: Vercel (recommended for Next.js) or similar platform supporting Node.js.

4. Development Guidelines & Technical Specifications

API Documentation: Always consult the official API documentation for Cal.com (embedding, postMessage API if used) and Zoho CRM (relevant modules, authentication, request/response formats) before and during implementation. Assume documentation is the source of truth for API behavior.

Project Structure: Follow the suggested file structure (Section 5).

Component Types:

Default to Server Components for data fetching and passing data down as props.

Use Client Components ('use client' directive at the top) for interactivity, state management (hooks like useState, useEffect), and browser-only APIs.

Data Fetching:

Initial/static data fetching primarily in Server Components.

Client-side initiated data fetching (e.g., form submission, dynamic updates based on interaction) should call internal Next.js API routes (/app/api/...). Use hooks like useEffect (carefully, to avoid unnecessary calls) or event handlers for this in Client Components. Implement loading states and error handling visually.

API Interactions: All external API calls (Zoho) MUST occur server-side within Next.js API routes (/app/api/...). Client components fetch data through these internal routes.

Environment Variables:

Use .env.local for local secrets, ensure it's in .gitignore.

Access server-side secrets via process.env.

Use platform's environment variable settings for production.

Public variables (if any) can use NEXT_PUBLIC_ prefix and be configured in next.config.mjs if needed, but avoid for sensitive data.

Error Handling: Implement try...catch blocks in API routes and data fetching functions. Log errors server-side. Provide clear user feedback client-side.

Type Safety: Strictly use TypeScript. Define interfaces/types for all data structures, especially API responses and props. Avoid any.

Configuration: Utilize next.config.mjs as needed for Next.js specific configurations.

5. Suggested File Structure

Based on Next.js 14 App Router conventions and project requirements:

I:\AIVoice\Projects\Mobivive\mobibookings
├── app\                     # Next.js App Router Directory
│   ├── api\                 # API Routes (Server-Side Logic)
│   │   └── bookings\        # Specific endpoint for booking logic
│   │       └── route.ts     # Handles POST requests for creating bookings (Zoho interaction)
│   ├── book\                # Route for the main booking page (e.g., /book)
│   │   └── page.tsx         # Main Server Component for the booking page route
│   ├── layout.tsx           # Root layout component (applies to all routes)
│   ├── page.tsx             # Root page component (e.g., homepage, could redirect to /book)
│   └── globals.css          # Global styles (or setup for Tailwind base)
│
├── components\              # Reusable UI Components (as requested, at the root)
│   ├── booking-form.tsx     # Main client component orchestrating the multi-step form
│   ├── step-destination.tsx # Component for Step 1 (Destination, People)
│   ├── step-lounge-select.tsx# Component for Step 2 (Lounge Selection - Needs to handle the 6 specific lounge options)
│   ├── step-calendar.tsx    # Component for Step 3 (Displays Cal.com embed)
│   ├── step-attendee-info.tsx# Component for Step 4 (User Details, Treatment)
│   ├── step-confirmation.tsx # Component for Step 5 (Success Message)
│   ├── ui\                  # Optional: Sub-directory for generic UI elements
│   │   ├── button.tsx       # Reusable Button component
│   │   ├── dropdown.tsx     # Reusable Dropdown component
│   │   ├── input-field.tsx  # Reusable Input component
│   │   └── loading-spinner.tsx # Reusable Loading indicator
│   └── cal-embed.tsx        # Specific component to manage the Cal.com iframe logic (Needs logic to load correct embed based on 6 lounges)
│
├── lib\                     # Shared utilities, helpers, types, API client logic
│   ├── zoho.ts              # Functions for interacting with Zoho CRM API (server-side only)
│   ├── types.ts             # Shared TypeScript interfaces and types (e.g., BookingData, ApiResponse)
│   ├── constants.ts         # Project constants (e.g., lounge names/IDs, therapy options if static)
│   └── utils.ts             # General utility functions (e.g., date formatting, validation helpers)
│
├── public\                  # Static assets served directly
│   ├── images\              # Project images (logos, backgrounds)
│   │   └── logo.png
│   └── favicon.ico
│
├── .env.local               # Local environment variables (API Keys - MUST be in .gitignore!)
├── .gitignore               # Specifies intentionally untracked files (node_modules, .env*, .next)
├── next.config.mjs          # Next.js configuration file
├── package.json             # Project dependencies and scripts
├── tailwind.config.js       # Optional: Tailwind CSS configuration (if used)
├── postcss.config.js        # Optional: PostCSS configuration (often needed for Tailwind)
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
Use code with caution.
Key Structure Points:

app/: Contains routing, page layouts, and API Route Handlers.

app/api/: Server-side endpoints handling external API communication (Zoho).

app/book/page.tsx: Likely a Server Component rendering the main client booking form.

components/: Reusable React components (Client & Server as appropriate). booking-form.tsx is the primary client component managing state.

lib/: Utility functions, types, constants, and critically, the server-side only Zoho API interaction logic (zoho.ts). constants.ts is a good place to define the list of 6 lounge names/IDs for consistent use.

public/: Static assets.

Root: Configuration files.

6. Phased Development Priorities (Roadmap - Aligned with Next.js)

Phase 1: Project Setup & Static UI:

Initialize Next.js 14 project with TypeScript.

Set up folder structure (/app, /components).

Build static HTML/React components for all form steps in /components and assemble in an /app page.

Implement basic CSS styling.

Phase 2: Client-Side Interactivity & Navigation:

Convert necessary components to Client Components ('use client').

Implement state management (useState) for form inputs.

Write client-side JS/TS for multi-step navigation and conditional logic (showing/hiding steps/elements). Ensure Lounge Selection handles 6 options.

Phase 3: Cal.com Integration (Client-Side Update):

Write client-side logic to dynamically update the src of the Cal.com iframe based on the selected lounge state (using the 6 specific Cal.com embed URLs).

Ensure the correct calendar loads. Define how to proceed after selection.

Phase 4: Backend API Route & Form Submission:

Create the Next.js API route (e.g., /app/api/bookings/route.ts).

Implement client-side logic (fetch in an event handler) to POST form state data to the API route.

Implement basic server-side logic in the API route to receive data, validate (basic), and return a placeholder success/error response.

Implement client-side handling of loading states and API responses (success/error messages).

Phase 5: Zoho CRM Integration (Server-Side in API Route):

Set up environment variables for Zoho credentials securely.

Implement Zoho API authentication (OAuth 2.0) server-side. Consult Zoho API docs.

Add Zoho client initialization logic (server-side).

Implement API calls within the route: Search -> Create/Update Logic. Consult Zoho API docs for correct endpoint/payload structure.

Add robust server-side error handling and logging for Zoho interactions.

Refine API route response structure.

Phase 6: Finalization, Testing & Deployment:

Refine UI/UX, styling, responsiveness.

Thorough end-to-end testing (all flows, all 6 locations, new/existing Zoho logic).

Deploy to Vercel or chosen platform, configuring production environment variables.