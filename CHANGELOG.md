# Changelog

All notable changes to the WanderNest project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-17
### Added
- Monorepo repository setup (`/client` and `/server`).
- Complete Prisma ORM schema for 11 entities (User, Destination, Hotel, Room, Flight, Booking, Payment, Review, Wishlist, Offer, Newsletter).
- Express TypeScript backend server with Zod validation, JWT authentication, and Swagger UI docs (`/api/docs`).
- Database seed script with realistic travel data across worldwide destinations (Paris, Tokyo, Bali, New York, Swiss Alps, Rome, Dubai, Santorini).
- Next.js 14 App Router frontend with Tailwind CSS, shadcn/ui components, and Booking.com design tokens.
- Authentication UI with login/register modal, quick-fill demo credentials, JWT persistence, and user profile state.
- Connected remote repository `https://github.com/KAMALESHUPADHYAY/wandernest-travel-booking`.
