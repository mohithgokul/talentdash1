import type { CompanyMeta, SalaryRecord } from "../types/salary";

/**
 * Mock dataset — single swap point for a real API later.
 */

export const COMPANIES: CompanyMeta[] = [
  { slug: "google",    name: "Google",    industry: "Internet",      founded: 1998, headcount: "100k+", hq: "Mountain View, USA" },
  { slug: "amazon",    name: "Amazon",    industry: "E-commerce",    founded: 1994, headcount: "1M+",   hq: "Seattle, USA" },
  { slug: "microsoft", name: "Microsoft", industry: "Enterprise SW", founded: 1975, headcount: "200k+", hq: "Redmond, USA" },
  { slug: "meta",      name: "Meta",      industry: "Social",        founded: 2004, headcount: "60k+",  hq: "Menlo Park, USA" },
  { slug: "apple",     name: "Apple",     industry: "Consumer Tech", founded: 1976, headcount: "150k+", hq: "Cupertino, USA" },
  { slug: "flipkart",  name: "Flipkart",  industry: "E-commerce",    founded: 2007, headcount: "30k+",  hq: "Bengaluru, India" },
  { slug: "razorpay",  name: "Razorpay",  industry: "Fintech",       founded: 2014, headcount: "3k+",   hq: "Bengaluru, India" },
  { slug: "swiggy",    name: "Swiggy",    industry: "Food Delivery", founded: 2014, headcount: "6k+",   hq: "Bengaluru, India" },
  { slug: "zerodha",   name: "Zerodha",   industry: "Fintech",       founded: 2010, headcount: "1k+",   hq: "Bengaluru, India" },
  { slug: "phonepe",   name: "PhonePe",   industry: "Fintech",       founded: 2015, headcount: "5k+",   hq: "Bengaluru, India" },
  { slug: "zomato",    name: "Zomato",    industry: "Food Delivery", founded: 2008, headcount: "5k+",   hq: "Gurgaon, India" },
  { slug: "atlassian", name: "Atlassian", industry: "Dev Tools",     founded: 2002, headcount: "12k+",  hq: "Sydney, Australia" },
  { slug: "stripe",    name: "Stripe",    industry: "Fintech",       founded: 2010, headcount: "8k+",   hq: "San Francisco, USA" },
  { slug: "uber",      name: "Uber",      industry: "Mobility",      founded: 2009, headcount: "30k+",  hq: "San Francisco, USA" },
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
export function uniqueRoles(): string[]    { return Array.from(new Set(SALARIES.map((r) => r.role))).sort(); }
export function uniqueLocations(): string[]{ return Array.from(new Set(SALARIES.map((r) => r.location))).sort(); }
export function uniqueLevels(): string[]   { return Array.from(new Set(SALARIES.map((r) => r.level_standardized))); }

/* ───────────── Reviews ───────────── */
export interface ReviewSummary {
  company_slug: string;
  company: string;
  overall: number;
  work_life: number;
  comp: number;
  culture: number;
  badge?: string;
}
export const REVIEW_SUMMARIES: ReviewSummary[] = [
  { company_slug: "google",    company: "Google",    overall: 4.4, work_life: 4.3, comp: 4.6, culture: 4.5, badge: "Best Work Culture 2026" },
  { company_slug: "microsoft", company: "Microsoft", overall: 4.3, work_life: 4.5, comp: 4.2, culture: 4.3, badge: "Best for WLB 2026" },
  { company_slug: "apple",     company: "Apple",     overall: 4.2, work_life: 3.9, comp: 4.5, culture: 4.2 },
  { company_slug: "amazon",    company: "Amazon",    overall: 3.9, work_life: 3.4, comp: 4.4, culture: 3.7 },
  { company_slug: "meta",      company: "Meta",      overall: 4.1, work_life: 3.8, comp: 4.6, culture: 4.0 },
];

export interface Review {
  id: string;
  company_slug: string;
  company: string;
  role: string;
  location: string;
  ago: string;
  rating: number;
  snippet: string;
}
export const REVIEWS: Review[] = [
  { id: "r1", company_slug: "google",    company: "Google",    role: "SWE L4",       location: "Bengaluru", ago: "2d ago",  rating: 4.5, snippet: "Great engineering culture and strong mentorship. WLB depends heavily on the team." },
  { id: "r2", company_slug: "microsoft", company: "Microsoft", role: "PM 63",        location: "Hyderabad", ago: "4d ago",  rating: 4.6, snippet: "Genuinely supportive managers. Comp has caught up to the rest of FAANG." },
  { id: "r3", company_slug: "amazon",    company: "Amazon",    role: "SDE-II",       location: "Bengaluru", ago: "1w ago",  rating: 3.4, snippet: "Steep learning curve, but on-call expectations are intense. LP-driven." },
  { id: "r4", company_slug: "apple",     company: "Apple",     role: "Data Analyst", location: "London",    ago: "1w ago",  rating: 4.0, snippet: "Polished products, secretive culture. Pay is solid, stock makes the difference." },
  { id: "r5", company_slug: "zomato",    company: "Zomato",    role: "Backend Eng",  location: "Gurgaon",   ago: "2w ago",  rating: 3.8, snippet: "Fast moving. Lean teams, lots of ownership early on." },
  { id: "r6", company_slug: "meta",      company: "Meta",      role: "Product Eng",  location: "London",    ago: "3w ago",  rating: 4.2, snippet: "Highest TC in market. After-effects of layoffs still felt across orgs." },
];

export const REVIEW_HIGHLIGHTS = {
  work_life:    { score: 4.2, count: 142_500, trend: 8, positives: [["Flexible hours", 78], ["Remote-friendly", 71], ["Reasonable on-call", 64]], concerns: [["Crunch before launches", 32], ["Manager dependent", 27]] },
  comp:         { score: 4.4, count: 168_300, trend: 12, positives: [["Strong base", 82], ["RSU refreshers", 69], ["Annual bonus", 58]], concerns: [["Stock vesting cliffs", 24], ["Below-band offers", 19]] },
  culture:      { score: 4.1, count: 156_700, trend: 5,  positives: [["Smart peers", 79], ["Inclusive teams", 66], ["Open feedback", 61]], concerns: [["Politics in mgmt", 28], ["Siloed orgs", 22]] },
  career:       { score: 4.0, count: 121_900, trend: 3,  positives: [["Promo opportunities", 74], ["Mentorship", 67], ["Internal mobility", 59]], concerns: [["Slow promo cycles", 29], ["Limited L+1 paths", 21]] },
} as const;

/* ───────────── Interviews ───────────── */
export interface InterviewQuestion {
  id: string;
  company_slug: string;
  company: string;
  role: string;
  ago: string;
  question: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  answers: number;
}
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: "iq1", company_slug: "google",    company: "Google",    role: "SWE",            ago: "1d ago",  question: "Design a function to serialize and deserialize a binary tree.",                tags: ["Algorithms", "Binary Tree"], difficulty: "Hard",   answers: 47 },
  { id: "iq2", company_slug: "microsoft", company: "Microsoft", role: "PM",             ago: "3d ago",  question: "Estimate the size of the cloud storage market over the next 5 years.",         tags: ["Estimation", "Product Sense"], difficulty: "Medium", answers: 31 },
  { id: "iq3", company_slug: "amazon",    company: "Amazon",    role: "SDE-II",         ago: "5d ago",  question: "Find the K closest points to the origin from a list of coordinates.",          tags: ["Heap", "Algorithms"], difficulty: "Medium", answers: 62 },
  { id: "iq4", company_slug: "apple",     company: "Apple",     role: "Data Analyst",   ago: "1w ago",  question: "Write a SQL query to find the second-highest salary by department.",          tags: ["SQL"], difficulty: "Easy",   answers: 88 },
  { id: "iq5", company_slug: "meta",      company: "Meta",      role: "Product Designer", ago: "1w ago", question: "Walk through how you'd redesign the notifications inbox for Instagram.",     tags: ["Design", "Product Sense"], difficulty: "Hard", answers: 19 },
];

export const ROLE_QUESTION_GROUPS = [
  { role: "Software Engineer", count: 12_400, latest: "Implement an LRU cache",         companies: ["google", "amazon", "microsoft", "meta"], trend: 14 },
  { role: "Product Manager",   count: 6_200,  latest: "Prioritize features for v2 launch", companies: ["google", "microsoft", "stripe"],     trend: 9 },
  { role: "Data Analyst",      count: 4_900,  latest: "Window functions for cohort retention", companies: ["apple", "uber", "amazon"],       trend: -3 },
  { role: "Product Designer",  count: 2_700,  latest: "Critique an onboarding flow",    companies: ["meta", "atlassian"],                     trend: 6 },
];

export const TRENDING_TOPICS = [
  ["System Design", 1842], ["Algorithms", 4310], ["SQL", 2105], ["Behavioral", 3204],
  ["Product Sense", 1518], ["API Design", 982], ["Data Structures", 3812], ["Case Studies", 765], ["Machine Learning", 1290],
] as const;

/* ───────────── Tools ───────────── */
export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  used: string;
  cta: string;
  icon: string;
}
export const TOOLS: ToolMeta[] = [
  { slug: "salary-calculator",  name: "Salary Calculator",       description: "Calculate your in-hand salary & deductions.", used: "120K+ used", cta: "Calculate now →", icon: "Calculator" },
  { slug: "salary-hike",        name: "Salary Hike Calculator",  description: "Plan your next hike with confidence.",        used: "85K+ used",  cta: "Calculate now →", icon: "TrendingUp" },
  { slug: "equity",             name: "Equity/ESOP Calculator",  description: "Calculate RSU/ESOP value & future worth.",    used: "80K+ used",  cta: "Calculate now →", icon: "PieChart" },
  { slug: "offer-comparator",   name: "Offer Comparator",        description: "Compare multiple offers side by side.",       used: "65K+ used",  cta: "Compare now →",   icon: "GitCompare" },
  { slug: "resume-analyzer",    name: "Resume Analyzer",         description: "Get AI feedback to improve your resume.",     used: "110K+ used", cta: "Analyze now →",   icon: "FileText" },
  { slug: "tax-calculator",     name: "Tax Calculator",          description: "Estimate your taxes & take-home pay.",        used: "90K+ used",  cta: "Calculate now →", icon: "Receipt" },
];

/* ───────────── Workplace Index ───────────── */
export const RANKING_LISTS = [
  { title: "Top 100 Companies Overall",           top: ["google", "microsoft", "apple"] },
  { title: "Top 100 Companies for Millennials",   top: ["microsoft", "google", "atlassian"] },
  { title: "Top 100 Companies for Gen Z",         top: ["meta", "stripe", "razorpay"] },
  { title: "Top 100 Best Paying Companies",       top: ["meta", "google", "apple"] },
  { title: "Top 100 for Work-Life Balance",       top: ["microsoft", "atlassian", "zerodha"] },
  { title: "Top 100 Most Loved Workplaces",       top: ["google", "apple", "microsoft"] },
];

export const INDUSTRIES = [
  { name: "IT Services",        companies: ["google", "microsoft", "atlassian", "amazon"] },
  { name: "BFSI",               companies: ["razorpay", "stripe", "zerodha", "phonepe"] },
  { name: "FMCG",               companies: ["amazon", "flipkart"] },
  { name: "Consumer Services",  companies: ["uber", "swiggy", "zomato"] },
  { name: "E-Commerce",         companies: ["amazon", "flipkart", "meta"] },
  { name: "Healthcare",         companies: ["apple", "microsoft"] },
  { name: "Travel & Hospitality", companies: ["uber", "google"] },
  { name: "Manufacturing",      companies: ["apple", "microsoft"] },
];

/* ───────────── Community ───────────── */
export interface Discussion {
  id: string;
  title: string;
  company_slug?: string;
  company?: string;
  tag: "Trending" | "Hot";
  replies: number;
  ago: string;
  participants: number;
}
export const DISCUSSIONS: Discussion[] = [
  { id: "d1", title: "Amazon appraisal discussion 2026",                 company_slug: "amazon",    company: "Amazon",    tag: "Trending", replies: 412, ago: "2h ago", participants: 89 },
  { id: "d2", title: "Google hiring freeze impact on offers?",           company_slug: "google",    company: "Google",    tag: "Hot",      replies: 287, ago: "5h ago", participants: 64 },
  { id: "d3", title: "Best companies for GenAI engineers",                                                                tag: "Hot",      replies: 198, ago: "1d ago", participants: 51 },
  { id: "d4", title: "Remote work vs office in 2026",                                                                     tag: "Trending", replies: 365, ago: "1d ago", participants: 110 },
  { id: "d5", title: "Microsoft PM offer — should I negotiate stock?",   company_slug: "microsoft", company: "Microsoft", tag: "Hot",      replies: 142, ago: "2d ago", participants: 38 },
  { id: "d6", title: "Razorpay vs PhonePe for backend roles",            company_slug: "razorpay",  company: "Razorpay",  tag: "Trending", replies: 96,  ago: "3d ago", participants: 27 },
];

export const COMMUNITIES = [
  { name: "Software Engineering", members: "248k" },
  { name: "Product Management",   members: "132k" },
  { name: "Data Science",         members: "104k" },
  { name: "MBA/Business",         members: "78k"  },
  { name: "Startups",             members: "61k"  },
];

export const TOP_CONTRIBUTORS = [
  { name: "Aarav S.",    replies: 1240 },
  { name: "Priya N.",    replies: 1102 },
  { name: "Rahul K.",    replies: 987  },
  { name: "Sneha M.",    replies: 891  },
  { name: "Vikram T.",   replies: 802  },
];

/* ───────────── Heatmap ───────────── */
export const HEATMAP_ROLES = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "Data Analyst"];
export const HEATMAP_CITIES = ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Delhi", "Chennai"];
// median INR TC per cell, deterministic. Stored in lakhs for readability.
export const HEATMAP: number[][] = (() => {
  const base = [
    [42, 38, 41, 36, 39, 34], // SWE
    [55, 52, 50, 46, 51, 44], // PM
    [48, 45, 47, 41, 44, 39], // DS
    [32, 30, 31, 28, 29, 27], // UX
    [22, 21, 23, 20, 22, 19], // DA
  ];
  return base.map((row) => row.map((v) => v * 1_00_000));
})();

/* ───────────── Salaries hub ───────────── */
export const TOP_PAYING = [
  { slug: "google",    name: "Google",    avg_usd: 186_000, yoy: 19 },
  { slug: "microsoft", name: "Microsoft", avg_usd: 167_000, yoy: 16 },
  { slug: "meta",      name: "Meta",      avg_usd: 165_000, yoy: 18 },
  { slug: "apple",     name: "Apple",     avg_usd: 164_000, yoy: 18 },
  { slug: "amazon",    name: "Amazon",    avg_usd: 146_000, yoy: 15 },
];
export const TOP_ROLES_MEDIAN = [
  { role: "Software Engineer", median_usd: 124_000, yoy: 19 },
  { role: "Product Manager",   median_usd: 143_000, yoy: 15 },
  { role: "Data Scientist",    median_usd: 115_000, yoy: 20 },
  { role: "Marketing Manager", median_usd: 92_000,  yoy: 11 },
  { role: "Design Manager",    median_usd: 98_000,  yoy: 18 },
];
export const SALARY_BY_EXP = [
  { bucket: "0–1 yr",  usd: 71_000 },
  { bucket: "1–3 yrs", usd: 98_000 },
  { bucket: "3–5 yrs", usd: 128_000 },
  { bucket: "5–8 yrs", usd: 156_000 },
  { bucket: "8+ yrs",  usd: 193_000 },
];
