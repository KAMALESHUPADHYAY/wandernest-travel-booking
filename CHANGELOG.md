# Changelog

All notable changes to the WanderNest project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
