# Changelog

All notable changes to the WanderNest project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-11-17
### Added
- **Flight Search Engine (`/flights`)**:
  - Interactive search header supporting One-way and Round-trip toggling, origin/destination inputs with quick-swap button (`ArrowRightLeft`), depart/return date selectors, and cabin class dropdown (Economy, Business, First).
  - Flexible Date Price Calendar strip displaying neighboring 7-day prices with an automated "Cheapest-day" highlight pill.
  - Comprehensive Flight Filter sidebar (and mobile slide-out drawer) supporting stops (Non-stop, 1 Stop, 2+ Stops), departure time slots (Before 6 AM, 6 AM - 12 PM, 12 PM - 6 PM, After 6 PM), airline checkboxes with count indicators, and max price slider in INR (`₹`).
  - Sort toolbar with dynamic sorting options: Cheapest first, Fastest duration, and Earliest departure.
  - Flight cards showing airline name & logo, flight number, departure & arrival times, flight duration trajectory line with stops indicator, baggage allowance badge (`7kg Cabin + 15kg Check-in`), low-seat availability alerts, INR pricing, and "Select flight" button with instant checkout storage and feedback toast.
  - Skeletons, empty search state with suggested hub routes (e.g. Mumbai ➔ Goa, Delhi ➔ Goa), and network retry buttons.
- **Destinations Guide & Directory (`/destinations`)**:
  - Real-time destination search bar with instant keyword matching across city, country, and landmark names.
  - Theme category filter pills (All, Beach, Mountains, City, Adventure, Honeymoon, Family) with custom Lucide iconography.
  - Region toggle tabs (All Regions, India, International).
  - Destination cards with zoom hover imagery, rating badges, category tags, hotel count, and "From ₹X / night" price tags.
- **Destination Detail Showcase (`/destinations/[slug]`)**:
  - Breadcrumbs navigation (`Home > Destinations > [Name]`).
  - Multi-image mosaic gallery with full-screen lightbox modal.
  - Best time to visit badge with climate and season recommendations.
  - **Live Weather Widget**: Powered by Open-Meteo's free weather API with zero API keys required, displaying real-time temperature in °C, weather condition icons, relative humidity percentage, and wind speed.
  - Curated top attractions cards parsed from database JSON.
  - Interactive Leaflet OpenStreetMap centered on destination coordinates with hotel price pins and popups.
  - Nearby hotels showcase linking directly to property pages with INR room rates.
  - Popular arriving flights card grid linking directly to flight search.
- **Backend API Extensions**:
  - Enhanced `GET /api/flights` with `from`, `to`, `cabinClass`, `stops`, `airlines`, `departureTimeWindow`, `minPrice`, `maxPrice`, `sortBy`, and pagination.
  - Added `GET /api/flights/airports` returning all distinct airport codes and cities for autocomplete.
  - Added `GET /api/flights/:id` returning single flight details.
  - Enhanced `GET /api/destinations` with `category`, `region` (India vs International), and `search`.
  - Added `GET /api/destinations/:slug` returning destination details, parsed attractions, gallery, nearby hotels, and arriving flights.
- **Design & Currency**:
  - Maintained INR (`₹`) as the primary default currency format across stays, flights, and price calendars.

## [0.3.0] - 2026-11-17
### Added
- **Hotel & Destination Search Engine (`/hotels`)**:
  - Interactive search modify bar pre-populated from hero search queries (city, dates, guests, rooms).
  - Collapsible desktop filter sidebar and mobile slide-over drawer with price range, star class (3, 4, 5 stars), minimum guest scores (4.0+, 4.5+, 4.8+), popular amenities, and free cancellation toggle.
  - 100% shareable URL query state syncing for all filters, sorting, and pagination.
  - Interactive Leaflet / OpenStreetMap view mode with dynamic HTML price pins (`$380`), cluster centering, and property popup cards.
  - Sort toolbar with count summary, active filter removal tags, and multi-option sort dropdown.
  - Polished empty state with filter reset action and skeleton card loaders.
- **Hotel Detail Showcase Page (`/hotels/[id]`)**:
  - 5-photo mosaic image grid with lightbox modal gallery.
  - Property overview, star ratings, and amenities icon grid.
  - Interactive Room Selection list with bed configurations, capacity, perks, and pricing.
  - Sticky Reservation sidebar card with live night calculations, guest selectors, and checkout routing.
  - Embedded Leaflet location map with exact marker.
  - Verified guest reviews with score breakdown and pros/cons tags.
- **Backend API Extensions**:
  - Enhanced `GET /api/hotels` with destination/city search, price range filters, star class filtering, review score threshold, free cancellation filtering, amenities parsing, multi-tier sorting, and pagination metadata.
  - Added `GET /api/hotels/:id` to retrieve comprehensive hotel details with rooms, destination, reviews, and review counts.

## [0.2.0] - 2026-11-17
### Added
- Global Sticky Layout with Booking.com dark navy navbar (`#003B95`), multi-column footer, and currency selector.
- 15 dynamic landing page sections in exact sequence, fully powered by backend REST API.
- Live database seed with Indian (Goa, Jaipur, Kerala, Manali) and International destinations.

## [0.1.0] - 2026-11-17
### Added
- Monorepo repository setup (`/client` and `/server`).
- Complete Prisma ORM schema for 11 entities (User, Destination, Hotel, Room, Flight, Booking, Payment, Review, Wishlist, Offer, Newsletter).
- Express TypeScript backend server with Zod validation, JWT authentication, and Swagger UI docs (`/api/docs`).
- Database seed script with realistic travel data across worldwide destinations.
- Next.js 14 App Router frontend with Tailwind CSS, shadcn/ui components, and Booking.com design tokens.
