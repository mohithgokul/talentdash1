# TalentDash - Compensation Intelligence Engine

TalentDash is a Next.js 15 full-stack application providing structured, comparable, decision-ready career data served at internet scale.

## Architecture Decisions

### 1. Hybrid Rendering Strategy (SSG + Client Components)
- **Static Generation (SSG)**: Core pages like the Homepage and Company Profile pages (`/companies/[slug]`) are statically generated at build time using `generateStaticParams`. This ensures near-zero TTFB (Time to First Byte) and perfect SEO since JSON-LD and meta tags are fully baked into the initial HTML.
- **Client Components**: The Compare Page (`/compare`) and the FilterBar on the Salaries page (`/salaries`) use Client Components (`'use client'`). The URL parameters (`?s1=...&s2=...`) act as the single source of truth for the state, enabling deep-linking and back-button support without needing complex global state management like Redux.
- **React Server Components (RSC)**: The main Salaries Table is an RSC that renders purely on the server. Sorting logic uses query params (`?sort=tc_desc`), keeping the client bundle size extremely small.

### 2. Data Integrity & Validation at the Boundary
- **Strict Typing & Validation**: The ingestion endpoint (`POST /api/ingest-salary`) uses Zod for Pydantic-style strict runtime validation. It rejects invalid levels, missing locations, or negative salaries at the boundary.
- **Server-Side Computation**: The `total_compensation` field is never trusted from the client. It is strictly computed on the server during ingestion as `base + bonus + stock` to prevent data manipulation.
- **Level Standardization**: A strict union type (enum) is enforced for levels (`L3`, `L4`, `SDE-II`, etc.) ensuring accurate data comparison across companies.

### 3. SEO & JSON-LD Implementation
- Standardized `Metadata` objects are exported on every page.
- `application/ld+json` blocks are injected into the DOM for structured data:
  - Homepage: `WebSite` schema
  - Salaries Page: `Dataset` schema
  - Company Page: `Organization` schema

### 4. Zero-Dependency Custom UI
- Built completely from scratch using modern Tailwind CSS v4.
- No bulky UI libraries (MUI, ShadCN) were used. The design tokens (colors, font sizing, spacing) are strictly enforced through CSS variables in `globals.css` and custom components (`LevelBadge`, `SalariesTable`).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Inter Font
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Validation**: Zod
- **Deployment Ready**: Vercel / Cloudflare Pages

## Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Ensure you have a PostgreSQL database (e.g., Neon).
   Set your `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   ```

3. **Initialize Prisma & Seed Data**
   ```bash
   npx prisma db push
   npx prisma generate
   npx tsx prisma/seed.ts
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Trade-offs & Future Improvements
- **Trade-off**: The `salaryRecords` mock data is still used directly in `generateStaticParams` for simplicity in the trial, but the Prisma schema and API endpoints are fully implemented.
- **Improvement**: Replace static file data with direct Prisma queries inside Server Components for dynamic production data fetching.
- **Improvement**: Add Incremental Static Regeneration (ISR) using `revalidate` on the company pages to periodically update static data when new salaries are ingested.
