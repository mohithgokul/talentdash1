import type { CompanyMeta, SalaryRecord } from "../types/salary";

/**
 * Mock salary dataset. Single swap point when a real API is wired up:
 * replace `getSalaries()` / `getCompanyMeta()` with server-function calls
 * that return the same shape.
 */

export const COMPANIES: CompanyMeta[] = [
  { slug: "google",    name: "Google",    industry: "Internet",      founded: 1998, headcount: "100k+",   hq: "Mountain View, USA" },
  { slug: "amazon",    name: "Amazon",    industry: "E-commerce",    founded: 1994, headcount: "1M+",     hq: "Seattle, USA" },
  { slug: "microsoft", name: "Microsoft", industry: "Enterprise SW", founded: 1975, headcount: "200k+",   hq: "Redmond, USA" },
  { slug: "meta",      name: "Meta",      industry: "Social",        founded: 2004, headcount: "60k+",    hq: "Menlo Park, USA" },
  { slug: "flipkart",  name: "Flipkart",  industry: "E-commerce",    founded: 2007, headcount: "30k+",    hq: "Bengaluru, India" },
  { slug: "razorpay",  name: "Razorpay",  industry: "Fintech",       founded: 2014, headcount: "3k+",     hq: "Bengaluru, India" },
  { slug: "swiggy",    name: "Swiggy",    industry: "Food Delivery", founded: 2014, headcount: "6k+",     hq: "Bengaluru, India" },
  { slug: "zerodha",   name: "Zerodha",   industry: "Fintech",       founded: 2010, headcount: "1k+",     hq: "Bengaluru, India" },
  { slug: "phonepe",   name: "PhonePe",   industry: "Fintech",       founded: 2015, headcount: "5k+",     hq: "Bengaluru, India" },
  { slug: "atlassian", name: "Atlassian", industry: "Dev Tools",     founded: 2002, headcount: "12k+",    hq: "Sydney, Australia" },
  { slug: "stripe",    name: "Stripe",    industry: "Fintech",       founded: 2010, headcount: "8k+",     hq: "San Francisco, USA" },
  { slug: "uber",      name: "Uber",      industry: "Mobility",      founded: 2009, headcount: "30k+",    hq: "San Francisco, USA" },
];

const ROLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Data Scientist",
  "Product Manager",
  "SRE",
  "Frontend Engineer",
  "Backend Engineer",
] as const;

const LEVELS = ["L3", "L4", "L5", "L6", "Principal", "SDE-I", "SDE-II", "SDE-III", "Staff"] as const;
const LOCATIONS_IN = ["Bengaluru", "Hyderabad", "Pune", "Gurgaon", "Mumbai", "Chennai", "Remote (India)"];
const LOCATIONS_GLOBAL = ["San Francisco", "Seattle", "London", "Dublin", "Singapore", "Sydney", "Remote (US)"];

// Deterministic pseudo-random so SSR === client.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(): SalaryRecord[] {
  const rand = mulberry32(42);
  const rows: SalaryRecord[] = [];
  for (let i = 0; i < 64; i++) {
    const co = COMPANIES[Math.floor(rand() * COMPANIES.length)];
    const isIndia = co.hq.includes("India");
    const currency = isIndia ? "INR" : "USD";
    const level = LEVELS[Math.floor(rand() * LEVELS.length)];
    const role = ROLES[Math.floor(rand() * ROLES.length)];
    const location = isIndia
      ? LOCATIONS_IN[Math.floor(rand() * LOCATIONS_IN.length)]
      : LOCATIONS_GLOBAL[Math.floor(rand() * LOCATIONS_GLOBAL.length)];
    const exp = Math.round((1 + rand() * 14) * 10) / 10;

    const tier =
      level === "L3" || level === "SDE-I" ? 1 :
      level === "L4" || level === "SDE-II" ? 2 :
      level === "L5" || level === "SDE-III" ? 3 :
      level === "L6" || level === "Staff" ? 4 : 5;

    let base: number, bonus: number | null, stock: number | null;
    if (currency === "INR") {
      base = Math.round((18 + tier * 18 + rand() * 12) * 100000);
      bonus = rand() < 0.2 ? null : Math.round((2 + tier * 2 + rand() * 4) * 100000);
      stock = rand() < 0.25 ? null : Math.round((4 + tier * 8 + rand() * 10) * 100000);
    } else {
      base = Math.round(120000 + tier * 45000 + rand() * 40000);
      bonus = rand() < 0.2 ? null : Math.round(15000 + tier * 8000 + rand() * 20000);
      stock = rand() < 0.15 ? null : Math.round(40000 + tier * 60000 + rand() * 80000);
    }
    const total = base + (bonus ?? 0) + (stock ?? 0);

    rows.push({
      id: `rec_${i.toString().padStart(3, "0")}`,
      company: co.name,
      company_slug: co.slug,
      role,
      level_standardized: level,
      location,
      currency,
      experience_years: exp,
      base_salary: base,
      bonus,
      stock,
      total_compensation: total,
      source: rand() < 0.6 ? "Self-reported" : "Verified offer",
      confidence_score: Math.round((0.6 + rand() * 0.4) * 100) / 100,
      is_verified: rand() < 0.45,
    });
  }
  return rows;
}

export const SALARIES: SalaryRecord[] = generate();

export function getCompanyMeta(slug: string): CompanyMeta | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export function uniqueRoles(): string[] {
  return Array.from(new Set(SALARIES.map((r) => r.role))).sort();
}
export function uniqueLocations(): string[] {
  return Array.from(new Set(SALARIES.map((r) => r.location))).sort();
}
export function uniqueLevels(): string[] {
  return Array.from(new Set(SALARIES.map((r) => r.level_standardized)));
}
