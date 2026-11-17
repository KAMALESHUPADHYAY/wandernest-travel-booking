# WanderNest - Modern Travel & Trip Booking Platform

WanderNest is a production-quality, Booking.com-inspired travel and accommodation booking web platform built with a high-performance modern tech stack.

## Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Design Tokens**: Booking.com Navy `#003B95`, Primary Blue `#0071C2`, Accent Gold `#FEBB02`
- **Motion & Transitions**: Framer Motion scroll animations
- **Data Fetching & State**: TanStack Query (React Query v5) + Context API
- **Charts**: Recharts
- **Maps**: Leaflet / OpenStreetMap with dynamic HTML price pins

### Backend (`/server`)
- **Runtime & Framework**: Node.js + Express + TypeScript
- **Database & ORM**: PostgreSQL / SQLite + Prisma ORM
- **API Documentation**: Swagger UI (`/api/docs`)
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens) + bcrypt password hashing

---

## Project Structure

```
wandernest/
├── client/          # Next.js App Router frontend
├── server/          # Node.js + Express REST API backend
├── .gitignore
├── CHANGELOG.md
└── README.md
```

---

## Getting Started

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npx prisma db push
npm run prisma:seed
npm run dev
```
Server runs at `http://localhost:5000`
Swagger API docs available at `http://localhost:5000/api/docs`

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```
Client runs at `http://localhost:3000`

---

## Roadmap & Progress
- [x] **Phase 1**: Architecture, Monorepo Setup, Prisma Database & Auth System (JWT/bcrypt)
- [x] **Phase 2**: Booking.com-Style Global Layout & 15-Section Dynamic Landing Page
- [x] **Phase 3**: Destinations & Hotel Search Engine with Interactive Leaflet Map, Multi-Criteria Filters, and Hotel Detail Showcase
- [ ] **Phase 4**: Hotel & Room Detail Showcase System
- [ ] **Phase 5**: Flight Search & Booking Engine
- [ ] **Phase 6**: Multi-Step Checkout & Mock Payment Flow
- [ ] **Phase 7**: User Travel Dashboard, Wishlist & Reviews
- [ ] **Phase 8**: Admin Management Panel, Analytics & Production Polish

---

## Phase 3 Search Engine & Detail Highlights
1. **Search Results Page (`/hotels`)**:
   - Collapsible filters sidebar (drawer on mobile) with price slider, star rating checkboxes (5, 4, 3 stars), guest review scores (4.8+, 4.5+, 4.0+), amenities (WiFi, Pool, Spa, Beachfront), and free cancellation filters.
   - Sort dropdown: Top Rated First, Price Low-to-High, Price High-to-Low, Popularity, and Property Class.
   - Shareable and refresh-safe: all filter criteria and sort options are synchronized to URL query parameters.
   - View mode toggle: List View vs Interactive Leaflet Map View with custom HTML price badges (`$380`).
   - Skeleton loading cards, dynamic pagination, and empty state with one-click "Clear All Filters".
2. **Hotel Detail Page (`/hotels/[id]`)**:
   - 5-image mosaic gallery with full-screen Lightbox modal and keyboard arrow navigation.
   - Property overview, popular perks, and cancellation policy breakdown.
   - Available room tiers with capacity, bed configurations, included breakfast/cancellation, and reserve actions.
   - Sticky Reservation card calculating live nights, guests, and price.
   - Embedded Leaflet map centered at exact hotel coordinates.
   - Verified guest reviews list with pros, cons, traveler types, and score breakdown.
