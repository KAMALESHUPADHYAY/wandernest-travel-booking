# WanderNest - Modern Travel & Trip Booking Platform

WanderNest is a production-quality, Booking.com-inspired travel and accommodation booking web platform built with a high-performance modern tech stack.

## Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Lucide Icons
- **Motion & Transitions**: Framer Motion
- **Data Fetching & State**: TanStack Query (React Query v5) + Context API
- **Charts**: Recharts
- **Maps**: Leaflet / OpenStreetMap

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

## Roadmap & Phases
- [x] **Phase 1**: Architecture, Monorepo Setup, Prisma Database & Auth System (JWT/bcrypt)
- [ ] **Phase 2**: Booking.com-Style Landing Page & Dynamic Navigation
- [ ] **Phase 3**: Hotel & Destination Search Engine with Interactive Leaflet Map
- [ ] **Phase 4**: Hotel & Room Detail Showcase System
- [ ] **Phase 5**: Flight Search & Booking Engine
- [ ] **Phase 6**: Multi-Step Checkout & Mock Payment Flow
- [ ] **Phase 7**: User Travel Dashboard, Wishlist & Reviews
- [ ] **Phase 8**: Admin Management Panel, Analytics & Production Polish
