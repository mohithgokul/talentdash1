<div align="center">
  
# 🚀 TalentDash | Career Intelligence Platform

> **Structured, comparable, and decision-ready compensation data for tech professionals.** ⚡

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

[![Stars](https://img.shields.io/github/stars/mohithgokul/talentdash1?style=social)](https://github.com/mohithgokul/talentdash1/stargazers)
[![Issues](https://img.shields.io/github/issues/mohithgokul/talentdash1)](https://github.com/mohithgokul/talentdash1/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## 🔗 Quick Links

| Section | Link |
|---------|------|
| 📖 **About the Project** | [What is TalentDash?](#-what-is-talentdash) |
| ✨ **Features** | [Key Features](#-core-features) |
| 🛠️ **Tech Stack** | [Technologies Used](#%EF%B8%8F-tech-stack) |
| 🏗️ **Architecture** | [Architecture Overview](#-architecture--data-flow) |
| 🗄️ **Database Schema** | [Prisma Collections](#%EF%B8%8F-database-schema) |
| 🚀 **Getting Started** | [Installation Guide](#-getting-started-under-5-minutes) |
| 📡 **API Reference** | [REST API Docs](#-api-reference) |
| 🧠 **Engineering Decisions** | [Architecture Decisions](#-architecture-decisions) |

---

## 📖 What is TalentDash?

TalentDash is a comprehensive career intelligence platform that processes and normalizes massive amounts of compensation data to empower candidates. Unlike traditional job boards or basic review sites, TalentDash strictly normalizes company names, job levels, and salary ranges to provide **structured, highly comparable datasets** via a blazing-fast user interface.

### 🔗 Live Deployments
- **Frontend App (Vercel)**: [https://talentdash1.vercel.app](https://talentdash1.vercel.app/)
- **Backend API (Render)**: [https://talentdash1.onrender.com](https://talentdash1.onrender.com)

---

## ✨ Core Features

- **Salary Insights & Heatmaps**: Browse through 160+ verified records across 12 top tech companies with geographic salary density visualization.
- **Company Profiles & Workplace Index**: Detailed pages featuring the true statistical Median Total Compensation, exact level distributions, and the comprehensive **Workplace Index** (scoring WLB, Culture, Compensation).
- **Reviews & Interviews Tracking**: Native support for employee reviews and interview experiences with difficulty tags.
- **Compensation Offers & Tools**: Track new offer data and access tools like take-home calculators and ESPP modeling.
- **Intelligent Deduplication**: Auto-rejects duplicate records submitted within 48 hours to preserve database integrity.

---

## 🛠️ Tech Stack

**Frontend Layer**
- **Framework**: React.js with Vite (Lightning-fast SPA)
- **Routing**: TanStack Router (Type-safe client-side routing)
- **Styling**: Tailwind CSS v4 (No component libraries; fully bespoke UI)
- **Deployment**: Vercel

**Backend Layer**
- **Framework**: Node.js & Express.js
- **Validation**: Zod (Strict schema boundary enforcement)
- **Database**: PostgreSQL via Neon Serverless
- **ORM**: Prisma Client
- **Deployment**: Render

---

## 🎨 Design System

TalentDash utilizes a highly analytical, data-first visual identity heavily prioritizing trust and clarity:

| Token | Value | Usage |
|-------|-------|-------|
| **Primary Accent** | `#FF5A5F` | CTAs, active states, highlights |
| **Data Blue** | `#0369A1` | Large salary figures and critical comparisons |
| **Deep Text** | `#222222` | Primary headings, company names |
| **Body Text** | `#484848` | Standard paragraphs, metadata |
| **Muted Text** | `#717171` | Secondary labels, table headers |
| **Success** | `#008A05` | Positive deltas, verified badges |
| **Error** | `#D93025` | Negative deltas, rejection indicators |
| **Background** | `#F7F7F7` | Core application backdrop |

**Typography**: Inter (Google Fonts) — H1 (36px, 700w), H2 (28px, 700w), Body (16px, 400w).

---

## 🚀 Getting Started (Under 5 Minutes)

### Prerequisites
- Node.js (v18+)
- npm
- A PostgreSQL Database URL (Local or Neon Serverless)

### 1. Clone & Install
```bash
git clone https://github.com/mohithgokul/talentdash1.git
cd talentdash
```

### 2. Environment Variables
Create a `.env` file in the **`backend`** directory:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
FRONTEND_URL="http://localhost:8080"
```

Create a `.env` file in the **`frontend`** directory:
```env
VITE_API_URL="http://localhost:4000"
```

### 3. Database Setup & Seeding (Run from `/backend`)
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
```
> *The seed script will populate your database with exactly 60 realistic records testing edge cases (e.g., zero bonus, PRINCIPAL levels, and duplicate name normalization).*

### 4. Run Locally
**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:8080` to experience the application.

---

## 🏗 Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│                   Vite + React SPA                     │
│  (Hydrates static UI rapidly, executing client-side)   │
├──────────┬──────────┬──────────┬───────────────────────┤
│  Home    │ /salaries│/companies│   /jobs /reviews      │
│  (SPA)   │ (Filters)│  [slug]  │   /interviews         │
├──────────┴──────────┴──────────┴───────────────────────┤
│               HTTP Boundary (CORS Allowed)             │
├────────────────────────────────────────────────────────┤
│                 Express.js Backend API                 │
│  POST /api/ingest-salary (Validation & BigInt Parsing) │
│  GET  /api/salaries, /api/salaries/heatmap             │
│  GET  /api/companies/[slug] (Median & Workplace Index) │
│  GET  /api/reviews, /api/interviews, /api/discussions  │
│  GET  /api/workplace-index, /api/offers, /api/tools    │
├────────────────────────────────────────────────────────┤
│             Prisma ORM (Strict Type Safety)            │
├────────────────────────────────────────────────────────┤
│             Neon Serverless PostgreSQL DB              │
└────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

The relational structure prioritizes strict relationships over flat documents. It has been recently overhauled from 2 models to 8 advanced models:

- **Company Model**: Stores exact metadata (`slug`, `normalized_name`, `industry`, `headcount_range`). Serves as the single source of truth for canonical company pages.
- **Salary Model**: Tied to companies via `company_id`. Uses exact native enums (`L3`, `SDE_I`, `PRINCIPAL`) for leveling. `base_salary`, `bonus`, and `stock` are stored as `BigInt` to prevent floating-point precision loss. `total_compensation` is completely managed server-side.
- **WorkplaceIndex**: Deeply integrated 1:1 with `Company` to provide multi-vector scoring for Culture, WLB, and Compensation.
- **Review, Interview, Discussion, Offer**: 4 distinct models providing immense data-depth for company profiles, securely linked via foreign keys.

---

## 📡 API Reference

- **`POST /api/ingest-salary`**
  Submits a new salary record. Extremely strict validation. Rejects negative numbers. Recomputes `total_compensation`.
- **`GET /api/salaries` & `GET /api/salaries/heatmap`**
  Fetch salary records with case-insensitive `ILIKE` filters, pagination (`page`, `limit` capped at 100), and custom sorting. The heatmap endpoint returns geographic data.
- **`GET /api/companies/[slug]`**
  Retrieves company metadata, a full salary list, and dynamically computed `median_total_compensation`, `level_distribution`, and the `WorkplaceIndex`.
- **`GET /api/reviews` & `GET /api/interviews` & `GET /api/offers`**
  Specialized endpoints that query high-depth qualitative data mapped directly to specific companies or roles.
- **`POST /api/search`**
  Universal search traversing companies, discussions, and models to instantly route users to matching records.

---

## 🧠 Architecture Decisions

### 1. Decoupled Pure Vite SPA vs SSR Monolith
Because the core product demands extremely complex data filtering (combining dozens of locations, roles, and levels simultaneously), moving away from heavy Server-Side Rendering (SSR) to a **Pure Vite SPA** ensures that UI state hydrates instantly. The backend handles the heavy aggregation while the client-side router (TanStack) ensures snappy, localized DOM updates.

### 2. Prisma BigInt Serialization Over API Boundaries
A major technical challenge encountered was moving financial data (`base_salary`) over HTTP. Prisma enforces `BigInt` for large precision numbers, but standard Express `res.json()` fails to stringify it. We explicitly bypassed this by building a custom recursive serialization middleware `serializeBigInt` to format these large integers safely before they hit the frontend.

### 3. Page-Based Pagination over Cursor-Based
We deliberately implemented **Page-Based Pagination** (`?page=2`). Salary tables are sorted by `total_compensation` (which changes dynamically and frequently) rather than stable chronological dates. Cursor pagination breaks easily when sorting on mutable numeric values, and page-based URLs are significantly better for users to share and bookmark.

### 4. What Was Scoped Out
- **Authentication**: Implementing Clerk or Auth.js was excluded because the primary evaluation focus was strictly set on schema integrity, data pipelines, and UI normalization rather than administrative user portals.
- **Typesense Search**: We relied on native PostgreSQL `ILIKE` for partial text searching. While Typesense handles typo-tolerance better at an enterprise scale, Postgres is more than sufficient for an MVP and eliminates the need for maintaining a separate synchronized data store.

---

## 📊 Seed Data Execution

The repository contains a highly robust `prisma/seed.ts` script. We generated over **160 highly relational records** testing severe edge cases across 8 models:
- **12 Companies Included**: Google, Amazon, Meta, Microsoft, NVIDIA, Flipkart, Meesho, Razorpay, Zepto, TCS, Infosys, Wipro.
- **Edge Cases Tested**: 
  - Zero bonuses & Zero stock entries.
  - Rare `PRINCIPAL` levels.
  - Deep generation of Interviews (e.g. System Design questions), Reviews (pros/cons), and Discussions.
- **Real-World Currency Ranges**: INR values accurately ranging from ₹3,36,000 (WITCH entry-level) to ₹60,00,000 (FAANG senior level).

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
