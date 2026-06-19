# TalentDash — Career Intelligence Platform

TalentDash is a career intelligence platform that provides structured, comparable, and decision-ready compensation data. This repository contains the full-stack implementation fulfilling the **3-Day Engineering Trial Task**.

### 🔗 Live Deployments
- **Backend API (Render)**: [https://talentdash1.onrender.com](https://talentdash1.onrender.com)
- **Frontend App (Vercel)**: [https://talentdash1-frontend.vercel.app](https://talentdash1-frontend.vercel.app) *(Note: Replace with exact Vercel URL upon deploy)*
- **Database**: Neon Serverless PostgreSQL

---

## 🚀 Quick Start (Under 5 Minutes)

We have engineered this repository to be up and running locally with live data in under 5 minutes. 

### 1. Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL database (Local or Neon)

### 2. Environment Variables
Create a `.env` file in the **`backend`** directory:
```env
# backend/.env
PORT=4000
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
FRONTEND_URL="http://localhost:8080"
```

Create a `.env` file in the **`frontend`** directory:
```env
# frontend/.env
VITE_API_URL="http://localhost:4000"
```

### 3. Database Setup & Seeding
Navigate to the backend and initialize the database:
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
```
> *The seed script generates 60+ realistic salary records across 12 tech companies, perfectly mapping FAANG, Unicorns, and WITCH companies to simulate production.*

### 4. Start the Application
Start the **Backend API** (Runs on port 4000):
```bash
cd backend
npm run dev
```

Start the **Frontend App** (Runs on port 8080):
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:8080` to experience the application.

---

## 🏗️ Architecture Decisions

### 1. Rendering Strategy (Static vs. ISR vs. Dynamic)
Because the business model relies heavily on Cloudflare caching and SEO (generating millions of zero-cost pages), the architecture must strictly align with caching heuristics:
- **/salaries (Static + Client Hydration)**: The global salaries table is an SPA/static shell that hydrates via the API. This gives sub-second interactivity when users apply dozens of overlapping filter combinations.
- **/companies/[slug] (Static/ISR Target)**: Company pages are rarely updated. In a Next.js environment, these would be built at deploy time (`generateStaticParams`) and updated via ISR. In this Vite SPA implementation, the shell is static and hydrates instantly, supported by our heavy caching on the API layer (`s-maxage=3600`).
- **/compare (Dynamic/Client)**: Comparison relies heavily on user-specific parameters (`s1` and `s2`). This cannot be prebuilt and is evaluated dynamically on the client.

### 2. Pagination (Page-Based vs Cursor-Based)
I chose **Page-Based Pagination** over Cursor-Based Pagination for the following reasons:
- **SEO & Sharability**: Users need to share links like `?page=4`. Cursor-based URLs contain opaque hashes which are terrible for sharing and SEO.
- **Table Navigation**: Users expect to jump directly to specific pages or accurately gauge the depth of the data ("Page 2 of 14"). Cursor pagination only supports "Next" and "Previous" efficiently.
- **Offset Penalty Mitigation**: While `OFFSET` degrades at millions of rows, the strict cap of 100 rows per query combined with targeted composite indexes (`company_id`, `level`, `location`) ensures `<200ms` performance even at scale.

### 3. API Cache TTL Choices
- `GET /api/salaries`: `Cache-Control: s-maxage=300, stale-while-revalidate=3600`
  *Why?* Salary searches are highly dynamic and frequently updated. A 5-minute CDN cache prevents database hugging during traffic spikes while ensuring users see relatively fresh ingested data.
- `GET /api/companies/:slug`: `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`
  *Why?* Company metadata and level distributions change very slowly. A 1-hour hard cache with a 24-hour stale window provides maximum CDN offloading and instant response times.

### 4. What I Would Build Differently With Another Day
- **Next.js App Router Integration**: I would port the frontend from a pure Vite SPA to Next.js 15 App Router to explicitly leverage `generateStaticParams` for hard static HTML generation, improving the raw initial TTFB for SEO crawlers.
- **Background Job Queue**: I would implement `BullMQ` + `Redis` for the ingestion pipeline to asynchronously batch calculate Medians and process scraping pipelines without blocking the primary Node thread.

### 5. What I Did NOT Build and Why
- **Typesense Search Phase 2**: I implemented robust `ILIKE` case-insensitive PostgreSQL searching. Typesense (typo-tolerance) was excluded due to the time pressure and because Postgres handles MVP scale perfectly well.
- **Authentication**: Authentication via Clerk was excluded as the trial focuses primarily on the core rendering, validation, and data pipeline contracts rather than administrative portals.

---

## 🛡️ Strict Validation & Data Integrity
Data integrity is treated as the primary product:
- **Computed TC**: `total_compensation` is never trusted from the frontend. It is rigidly recomputed server-side on ingest.
- **Zod Boundaries**: Negative experience years or salaries are instantly met with a `400 Bad Request`.
- **Enum Normalization**: Exact validation errors mapped to the integration contract (`"Level must be one of: L3, L4..."`). 
- **Deduplication**: Deep verification prevents identical record spamming within a 48-hour window.
