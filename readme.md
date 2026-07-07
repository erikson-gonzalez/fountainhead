# Fountainhead — Tom Geldschläger Website

## Overview

Full-stack premium website for Fountainhead (Tom Geldschläger), a Berlin-based guitarist, producer, and mixing engineer.

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24
- **Package manager**: pnpm
- **TypeScript**: 5.9 (strict mode)
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite (Wouter routing, Zustand cart state, Framer Motion)
- **UI**: Tailwind CSS v4 + Radix UI + shadcn/ui components
- **Forms**: React Hook Form + Zod resolvers

## Architecture

```text
monorepo/
├── apps/
│   ├── web/                # React + Vite frontend (port 3000)
│   └── api/                # Express API server (port 8080 → /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
└── scripts/
    └── src/seed.ts         # Database seed with real Fountainhead content
```

## Pages & Features

1. **/** — Hero landing with full-screen image, artist tagline, CTAs (Hire for Production, Book a Lesson)
2. **/about** — Bio, endorsements (Aristides, Steinberg, Engl, Neural DSP, Bareknuckle, Elixir, MONO), artist quotes
3. **/discography** — Album archive with role/genre filters, 15 real albums seeded
4. **/live** — Concert history by project (Belphegor, Defeated Sanity, Thunder & Lightning, India tour...)
5. **/news** — Blog posts with pagination (10 real posts seeded)
6. **/shop** — E-commerce with categories: Merch, Signature Picks, Courses, Sample Packs
7. **/book** — Booking system with calendar + service selector (lesson 45€/hr, coaching 50€/session, studio 200€/8hrs)
8. **/quote** — Step-by-step quote builder for mixing/mastering/production/arrangements
9. **/checkout** — Unified checkout for all cart items (products + bookings + sessions)
10. **/services** — Full prices table with all services
11. **/portal** — Student portal with streaming lessons, downloadable tabs, resources
12. **/portal/access** — Portal access request form

## Cart System

- Global Zustand cart store (persisted in localStorage)
- All services funnel to `/checkout`
- Products, bookings, and sessions can be mixed in a single order

## Database Schema

Tables: `albums`, `news`, `products`, `orders`, `bookings`, `quotes`, `testimonials`, `services`, `portal_lessons`, `portal_resources`, `portal_access`

## API Endpoints

- `GET/api/albums` — Albums with role/genre filter + pagination
- `GET /api/news` — News posts with pagination
- `GET /api/products` — Products with category filter
- `POST /api/orders` — Create order (checkout)
- `GET /api/bookings/availability` — Available time slots
- `POST /api/bookings` — Create booking
- `POST /api/quotes/estimate` — Get price estimate
- `POST /api/quotes` — Submit quote request
- `GET /api/testimonials` — Artist + student testimonials
- `GET /api/portal/lessons` — Portal video lessons (stream only)
- `GET /api/portal/resources` — Portal resources (tabs downloadable)
- `POST /api/portal/access` — Request portal access
- `GET /api/services` — All services with prices

## Design System

Moodboard palette (4 exact colors):
- `#100F0D` — near-black warm base (background)
- `#EAEAEA` — soft light gray (foreground / body text)
- `#8AB3D1` — steel blue (primary accent: buttons, active states, hero gradient)
- `#D5B584` — warm sand gold (secondary accent: labels, prices, decorative details)
- Premium serif typography for headings (Cinzel)
- Inter for body text

## Running

```bash
# Dev (API + Frontend)
pnpm run dev

# DB schema push
pnpm run push

# Seed database
pnpm run seed

# Codegen (after openapi.yaml changes)
pnpm run codegen
```

## Contact (from original site)

- **Email**: thefountainhead@gmx.net
- **Phone**: 03066300766
- **Address**: Scheiblerstrasse 4, 12437 Berlin
- **VAT**: 65 813 728 097 (Kleinunternehmer)
