# Changelog

All notable changes to the WanderNest project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-17
### Added
- **Global Sticky Layout**: Sticky navy navbar (`#003B95`) with Stays, Flights, Destinations, Deals links, currency selector (`USD`, `INR`, `EUR`, `GBP`), dark mode toggle, and user avatar dropdown menu.
- **Rich Multi-column Footer**: Navigation across destinations, property types, support, accepted payments strip (Visa, MC, Amex, PayPal, UPI, Apple Pay), and language/currency indicator.
- **15 Dynamic Landing Page Sections**:
  1. Hero with tabbed search widget (`Stays` | `Flights`) featuring live destination autocomplete, date range pickers, and guests/rooms selector popover.
  2. Trust badges strip highlighting verified properties, free cancellation, and 24/7 care.
  3. Trending Destinations image cards with hover zoom and dynamic starting prices.
  4. Popular Hotels grid with star ratings, guest score badges, and live wishlist heart toggle.
  5. Flight Deals cards featuring airline logos, route durations, and direct search CTAs.
  6. Browse by Property Type (Hotels, Villas, Resorts, Apartments, Chalets, Glamping).
  7. Explore by Theme (Beach, Mountains, City, Adventure, Honeymoon, Family).
  8. Top Destinations tabs (`India Escapes` vs `International`).
  9. Special Offers banner with active tick-by-tick countdown timer (`HH:MM:SS`) and copyable promo codes (`SUMMER25`).
  10. How It Works 3-step walkthrough.
  11. Testimonials carousel displaying verified guest reviews, ratings, and pros/cons.
  12. Travel Inspiration editorial cards with read-time and category badges.
  13. Animated stats counters (2.5M+ stays, 150+ countries, 4.9/5 rating).
  14. Newsletter subscription system connected to backend database `POST /api/newsletter`.
  15. FAQ accordion addressing cancellation policies, Genius rewards, and invoices.
- **Backend REST API Endpoints**:
  - `GET /api/destinations` (supports `popular`, `featured`, `region`, `search`)
  - `GET /api/destinations/autocomplete`
  - `GET /api/hotels` and `GET /api/hotels/property-types`
  - `GET /api/flights` (supports `deals`, `featured`, `departureCity`, `arrivalCity`)
  - `GET /api/offers`
  - `GET /api/reviews`
  - `POST /api/newsletter`
  - `POST /api/wishlist/toggle` and `GET /api/wishlist`
- Seeded additional Indian destinations (Goa, Jaipur, Kerala, Manali) and luxury resorts into the database.

## [0.1.0] - 2026-11-17
### Added
- Monorepo repository setup (`/client` and `/server`).
- Complete Prisma ORM schema for 11 entities (User, Destination, Hotel, Room, Flight, Booking, Payment, Review, Wishlist, Offer, Newsletter).
- Express TypeScript backend server with Zod validation, JWT authentication, and Swagger UI docs (`/api/docs`).
- Database seed script with realistic travel data across worldwide destinations.
- Next.js 14 App Router frontend with Tailwind CSS, shadcn/ui components, and Booking.com design tokens.
- Authentication UI with login/register modal, quick-fill demo credentials, JWT persistence, and user profile state.
