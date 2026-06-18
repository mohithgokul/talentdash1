import type { SalaryRecord, CompanyProfile } from '@/types'

// total_compensation is ALWAYS base + bonus + stock — never trust client input
export const salaryRecords: SalaryRecord[] = [
  // ── Google ───────────────────────────────────────────────────────────────────
  { id: 'g1', company: 'Google', company_slug: 'google', role: 'Software Engineer', level_standardized: 'L3', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1900000, bonus: 300000, stock: 700000, total_compensation: 2900000, source: 'CONTRIBUTOR', confidence_score: 0.95, is_verified: true },
  { id: 'g2', company: 'Google', company_slug: 'google', role: 'Software Engineer', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 3, base_salary: 2800000, bonus: 500000, stock: 1500000, total_compensation: 4800000, source: 'CONTRIBUTOR', confidence_score: 0.96, is_verified: true },
  { id: 'g3', company: 'Google', company_slug: 'google', role: 'Senior Software Engineer', level_standardized: 'L5', location: 'Bengaluru', currency: 'INR', experience_years: 6, base_salary: 3800000, bonus: 700000, stock: 2800000, total_compensation: 7300000, source: 'CONTRIBUTOR', confidence_score: 0.94, is_verified: true },
  { id: 'g4', company: 'Google', company_slug: 'google', role: 'Staff Engineer', level_standardized: 'L6', location: 'Mountain View', currency: 'USD', experience_years: 10, base_salary: 220000, bonus: 60000, stock: 400000, total_compensation: 680000, source: 'CONTRIBUTOR', confidence_score: 0.97, is_verified: true },
  { id: 'g5', company: 'Google', company_slug: 'google', role: 'Principal Engineer', level_standardized: 'Principal', location: 'Mountain View', currency: 'USD', experience_years: 15, base_salary: 310000, bonus: 120000, stock: 700000, total_compensation: 1130000, source: 'CONTRIBUTOR', confidence_score: 0.93, is_verified: true },

  // ── Amazon ───────────────────────────────────────────────────────────────────
  { id: 'a1', company: 'Amazon', company_slug: 'amazon', role: 'SDE I', level_standardized: 'SDE-I', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1700000, bonus: 200000, stock: 600000, total_compensation: 2500000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },
  { id: 'a2', company: 'Amazon', company_slug: 'amazon', role: 'SDE II', level_standardized: 'SDE-II', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2600000, bonus: 400000, stock: 1400000, total_compensation: 4400000, source: 'CONTRIBUTOR', confidence_score: 0.92, is_verified: true },
  { id: 'a3', company: 'Amazon', company_slug: 'amazon', role: 'Senior SDE', level_standardized: 'SDE-III', location: 'Hyderabad', currency: 'INR', experience_years: 7, base_salary: 3500000, bonus: 600000, stock: 2200000, total_compensation: 6300000, source: 'CONTRIBUTOR', confidence_score: 0.91, is_verified: true },
  { id: 'a4', company: 'Amazon', company_slug: 'amazon', role: 'Principal SDE', level_standardized: 'Principal', location: 'Seattle', currency: 'USD', experience_years: 13, base_salary: 280000, bonus: 100000, stock: 600000, total_compensation: 980000, source: 'CONTRIBUTOR', confidence_score: 0.94, is_verified: true },
  { id: 'a5', company: 'Amazon', company_slug: 'amazon', role: 'SDE II', level_standardized: 'SDE-II', location: 'London', currency: 'GBP', experience_years: 5, base_salary: 130000, bonus: 25000, stock: 80000, total_compensation: 235000, source: 'SCRAPED', confidence_score: 0.72, is_verified: false },

  // ── Meta ─────────────────────────────────────────────────────────────────────
  { id: 'm1', company: 'Meta', company_slug: 'meta', role: 'Software Engineer', level_standardized: 'IC4', location: 'Bengaluru', currency: 'INR', experience_years: 3, base_salary: 3000000, bonus: 600000, stock: 2000000, total_compensation: 5600000, source: 'CONTRIBUTOR', confidence_score: 0.95, is_verified: true },
  { id: 'm2', company: 'Meta', company_slug: 'meta', role: 'Senior Software Engineer', level_standardized: 'IC5', location: 'Bengaluru', currency: 'INR', experience_years: 7, base_salary: 4200000, bonus: 900000, stock: 3500000, total_compensation: 8600000, source: 'CONTRIBUTOR', confidence_score: 0.93, is_verified: true },
  { id: 'm3', company: 'Meta', company_slug: 'meta', role: 'Staff Engineer', level_standardized: 'Staff', location: 'Menlo Park', currency: 'USD', experience_years: 11, base_salary: 250000, bonus: 80000, stock: 500000, total_compensation: 830000, source: 'CONTRIBUTOR', confidence_score: 0.96, is_verified: true },
  { id: 'm4', company: 'Meta', company_slug: 'meta', role: 'Software Engineer', level_standardized: 'IC4', location: 'London', currency: 'USD', experience_years: 4, base_salary: 180000, bonus: 40000, stock: 200000, total_compensation: 420000, source: 'SCRAPED', confidence_score: 0.68, is_verified: false },

  // ── Microsoft ─────────────────────────────────────────────────────────────────
  { id: 'ms1', company: 'Microsoft', company_slug: 'microsoft', role: 'Software Engineer', level_standardized: 'L3', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1800000, bonus: 280000, stock: 750000, total_compensation: 2830000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },
  { id: 'ms2', company: 'Microsoft', company_slug: 'microsoft', role: 'Software Engineer II', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2700000, bonus: 480000, stock: 1600000, total_compensation: 4780000, source: 'CONTRIBUTOR', confidence_score: 0.91, is_verified: true },
  { id: 'ms3', company: 'Microsoft', company_slug: 'microsoft', role: 'Senior Engineer', level_standardized: 'L5', location: 'Hyderabad', currency: 'INR', experience_years: 7, base_salary: 3600000, bonus: 650000, stock: 2400000, total_compensation: 6650000, source: 'CONTRIBUTOR', confidence_score: 0.89, is_verified: true },
  { id: 'ms4', company: 'Microsoft', company_slug: 'microsoft', role: 'Principal Engineer', level_standardized: 'Principal', location: 'Seattle', currency: 'USD', experience_years: 14, base_salary: 300000, bonus: 110000, stock: 580000, total_compensation: 990000, source: 'CONTRIBUTOR', confidence_score: 0.95, is_verified: true },

  // ── Flipkart ──────────────────────────────────────────────────────────────────
  { id: 'fk1', company: 'Flipkart', company_slug: 'flipkart', role: 'Software Engineer', level_standardized: 'SDE-I', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1400000, bonus: 180000, stock: 400000, total_compensation: 1980000, source: 'CONTRIBUTOR', confidence_score: 0.88, is_verified: true },
  { id: 'fk2', company: 'Flipkart', company_slug: 'flipkart', role: 'Software Engineer II', level_standardized: 'SDE-II', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2200000, bonus: 350000, stock: 1100000, total_compensation: 3650000, source: 'CONTRIBUTOR', confidence_score: 0.89, is_verified: true },
  { id: 'fk3', company: 'Flipkart', company_slug: 'flipkart', role: 'Senior Engineer', level_standardized: 'SDE-III', location: 'Bengaluru', currency: 'INR', experience_years: 7, base_salary: 3100000, bonus: 550000, stock: 1900000, total_compensation: 5550000, source: 'CONTRIBUTOR', confidence_score: 0.87, is_verified: true },
  { id: 'fk4', company: 'Flipkart', company_slug: 'flipkart', role: 'Staff Engineer', level_standardized: 'Staff', location: 'Bengaluru', currency: 'INR', experience_years: 10, base_salary: 4000000, bonus: 800000, stock: 3000000, total_compensation: 7800000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },

  // ── Meesho ────────────────────────────────────────────────────────────────────
  { id: 'me1', company: 'Meesho', company_slug: 'meesho', role: 'Software Engineer', level_standardized: 'SDE-I', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1300000, bonus: 150000, stock: 300000, total_compensation: 1750000, source: 'CONTRIBUTOR', confidence_score: 0.82, is_verified: true },
  { id: 'me2', company: 'Meesho', company_slug: 'meesho', role: 'Software Engineer II', level_standardized: 'SDE-II', location: 'Bengaluru', currency: 'INR', experience_years: 3, base_salary: 2000000, bonus: 280000, stock: 800000, total_compensation: 3080000, source: 'CONTRIBUTOR', confidence_score: 0.83, is_verified: true },
  { id: 'me3', company: 'Meesho', company_slug: 'meesho', role: 'Senior Engineer', level_standardized: 'SDE-III', location: 'Bengaluru', currency: 'INR', experience_years: 6, base_salary: 2800000, bonus: 420000, stock: 1500000, total_compensation: 4720000, source: 'SCRAPED', confidence_score: 0.65, is_verified: false },

  // ── NVIDIA ────────────────────────────────────────────────────────────────────
  { id: 'nv1', company: 'NVIDIA', company_slug: 'nvidia', role: 'Software Engineer', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 3, base_salary: 3200000, bonus: 700000, stock: 2500000, total_compensation: 6400000, source: 'CONTRIBUTOR', confidence_score: 0.92, is_verified: true },
  { id: 'nv2', company: 'NVIDIA', company_slug: 'nvidia', role: 'Senior Software Engineer', level_standardized: 'L5', location: 'Bengaluru', currency: 'INR', experience_years: 7, base_salary: 4500000, bonus: 1000000, stock: 4000000, total_compensation: 9500000, source: 'CONTRIBUTOR', confidence_score: 0.91, is_verified: true },
  { id: 'nv3', company: 'NVIDIA', company_slug: 'nvidia', role: 'Principal Engineer', level_standardized: 'Principal', location: 'Santa Clara', currency: 'USD', experience_years: 14, base_salary: 320000, bonus: 0, stock: 800000, total_compensation: 1120000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },

  // ── TCS ───────────────────────────────────────────────────────────────────────
  { id: 'tc1', company: 'TCS', company_slug: 'tcs', role: 'Software Engineer', level_standardized: 'L3', location: 'Mumbai', currency: 'INR', experience_years: 1, base_salary: 700000, bonus: 60000, stock: 0, total_compensation: 760000, source: 'CONTRIBUTOR', confidence_score: 0.85, is_verified: true },
  { id: 'tc2', company: 'TCS', company_slug: 'tcs', role: 'Systems Engineer', level_standardized: 'L4', location: 'Pune', currency: 'INR', experience_years: 4, base_salary: 1100000, bonus: 100000, stock: 0, total_compensation: 1200000, source: 'CONTRIBUTOR', confidence_score: 0.86, is_verified: true },
  { id: 'tc3', company: 'TCS', company_slug: 'tcs', role: 'Senior Software Engineer', level_standardized: 'L5', location: 'Hyderabad', currency: 'INR', experience_years: 8, base_salary: 1600000, bonus: 180000, stock: 0, total_compensation: 1780000, source: 'CONTRIBUTOR', confidence_score: 0.84, is_verified: true },

  // ── Infosys ───────────────────────────────────────────────────────────────────
  { id: 'in1', company: 'Infosys', company_slug: 'infosys', role: 'Systems Engineer', level_standardized: 'L3', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 650000, bonus: 50000, stock: 0, total_compensation: 700000, source: 'CONTRIBUTOR', confidence_score: 0.83, is_verified: true },
  { id: 'in2', company: 'Infosys', company_slug: 'infosys', role: 'Senior Systems Engineer', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 1000000, bonus: 100000, stock: 0, total_compensation: 1100000, source: 'CONTRIBUTOR', confidence_score: 0.84, is_verified: true },
  { id: 'in3', company: 'Infosys', company_slug: 'infosys', role: 'Technology Lead', level_standardized: 'L5', location: 'Pune', currency: 'INR', experience_years: 9, base_salary: 1800000, bonus: 200000, stock: 0, total_compensation: 2000000, source: 'SCRAPED', confidence_score: 0.62, is_verified: false },

  // ── Wipro ─────────────────────────────────────────────────────────────────────
  { id: 'wi1', company: 'Wipro', company_slug: 'wipro', role: 'Software Engineer', level_standardized: 'L3', location: 'Bengaluru', currency: 'INR', experience_years: 2, base_salary: 750000, bonus: 60000, stock: 0, total_compensation: 810000, source: 'CONTRIBUTOR', confidence_score: 0.82, is_verified: true },
  { id: 'wi2', company: 'Wipro', company_slug: 'wipro', role: 'Senior Software Engineer', level_standardized: 'L4', location: 'Delhi', currency: 'INR', experience_years: 5, base_salary: 1200000, bonus: 120000, stock: 0, total_compensation: 1320000, source: 'CONTRIBUTOR', confidence_score: 0.81, is_verified: true },

  // ── Razorpay ──────────────────────────────────────────────────────────────────
  { id: 'rp1', company: 'Razorpay', company_slug: 'razorpay', role: 'Software Engineer', level_standardized: 'SDE-I', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1800000, bonus: 250000, stock: 700000, total_compensation: 2750000, source: 'CONTRIBUTOR', confidence_score: 0.88, is_verified: true },
  { id: 'rp2', company: 'Razorpay', company_slug: 'razorpay', role: 'Software Engineer II', level_standardized: 'SDE-II', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2800000, bonus: 450000, stock: 1600000, total_compensation: 4850000, source: 'CONTRIBUTOR', confidence_score: 0.89, is_verified: true },
  { id: 'rp3', company: 'Razorpay', company_slug: 'razorpay', role: 'Senior Engineer', level_standardized: 'SDE-III', location: 'Bengaluru', currency: 'INR', experience_years: 7, base_salary: 3800000, bonus: 700000, stock: 2800000, total_compensation: 7300000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },
  { id: 'rp4', company: 'Razorpay', company_slug: 'razorpay', role: 'Staff Engineer', level_standardized: 'Staff', location: 'Bengaluru', currency: 'INR', experience_years: 11, base_salary: 5000000, bonus: 1000000, stock: 4000000, total_compensation: 10000000, source: 'CONTRIBUTOR', confidence_score: 0.91, is_verified: true },

  // ── Zepto ─────────────────────────────────────────────────────────────────────
  { id: 'ze1', company: 'Zepto', company_slug: 'zepto', role: 'Software Engineer', level_standardized: 'SDE-I', location: 'Mumbai', currency: 'INR', experience_years: 1, base_salary: 1600000, bonus: 200000, stock: 500000, total_compensation: 2300000, source: 'CONTRIBUTOR', confidence_score: 0.85, is_verified: true },
  { id: 'ze2', company: 'Zepto', company_slug: 'zepto', role: 'Software Engineer II', level_standardized: 'SDE-II', location: 'Mumbai', currency: 'INR', experience_years: 3, base_salary: 2400000, bonus: 380000, stock: 1200000, total_compensation: 3980000, source: 'CONTRIBUTOR', confidence_score: 0.86, is_verified: true },
  { id: 'ze3', company: 'Zepto', company_slug: 'zepto', role: 'Senior Engineer', level_standardized: 'SDE-III', location: 'Mumbai', currency: 'INR', experience_years: 6, base_salary: 3200000, bonus: 550000, stock: 2000000, total_compensation: 5750000, source: 'CONTRIBUTOR', confidence_score: 0.84, is_verified: false },

  // ── Swiggy ────────────────────────────────────────────────────────────────────
  { id: 'sw1', company: 'Swiggy', company_slug: 'swiggy', role: 'Software Engineer', level_standardized: 'SDE-I', location: 'Bengaluru', currency: 'INR', experience_years: 1, base_salary: 1500000, bonus: 180000, stock: 450000, total_compensation: 2130000, source: 'CONTRIBUTOR', confidence_score: 0.83, is_verified: true },
  { id: 'sw2', company: 'Swiggy', company_slug: 'swiggy', role: 'SDE II', level_standardized: 'SDE-II', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2300000, bonus: 350000, stock: 1100000, total_compensation: 3750000, source: 'CONTRIBUTOR', confidence_score: 0.84, is_verified: true },
  { id: 'sw3', company: 'Swiggy', company_slug: 'swiggy', role: 'Senior Engineer', level_standardized: 'SDE-III', location: 'Bengaluru', currency: 'INR', experience_years: 7, base_salary: 3000000, bonus: 500000, stock: 1800000, total_compensation: 5300000, source: 'SCRAPED', confidence_score: 0.63, is_verified: false },

  // ─── Edge cases ───────────────────────────────────────────────────────────────
  // Zero bonus record
  { id: 'ec1', company: 'Atlassian', company_slug: 'atlassian', role: 'Software Engineer', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 3, base_salary: 2500000, bonus: 0, stock: 1200000, total_compensation: 3700000, source: 'CONTRIBUTOR', confidence_score: 0.86, is_verified: true },
  // Zero stock record — TC = base only
  { id: 'ec2', company: 'Wipro', company_slug: 'wipro', role: 'Tech Lead', level_standardized: 'L5', location: 'Bengaluru', currency: 'INR', experience_years: 10, base_salary: 2400000, bonus: 300000, stock: 0, total_compensation: 2700000, source: 'CONTRIBUTOR', confidence_score: 0.8, is_verified: true },
  // Very high equity
  { id: 'ec3', company: 'NVIDIA', company_slug: 'nvidia', role: 'Distinguished Engineer', level_standardized: 'Principal', location: 'Santa Clara', currency: 'USD', experience_years: 20, base_salary: 400000, bonus: 200000, stock: 4000000, total_compensation: 4600000, source: 'CONTRIBUTOR', confidence_score: 0.88, is_verified: true },
  // Long company name edge case
  { id: 'ec4', company: 'JPMorgan Chase & Co.', company_slug: 'jpmorgan', role: 'Software Engineer', level_standardized: 'L4', location: 'Bengaluru', currency: 'INR', experience_years: 4, base_salary: 2000000, bonus: 400000, stock: 0, total_compensation: 2400000, source: 'SCRAPED', confidence_score: 0.7, is_verified: false },
  // Single record company (tests level distribution bar with 100% one level)
  { id: 'ec5', company: 'Stripe', company_slug: 'stripe', role: 'Software Engineer', level_standardized: 'L5', location: 'Bengaluru', currency: 'INR', experience_years: 6, base_salary: 3500000, bonus: 700000, stock: 2500000, total_compensation: 6700000, source: 'CONTRIBUTOR', confidence_score: 0.9, is_verified: true },
]

// ─── Company profiles ──────────────────────────────────────────────────────────
export const companyProfiles: Record<string, CompanyProfile> = {
  google:     { slug: 'google',     name: 'Google',              industry: 'Technology — Search & Cloud',      founded_year: 1998, headcount_range: '150,000+',   hq_location: 'Mountain View, CA' },
  amazon:     { slug: 'amazon',     name: 'Amazon',              industry: 'Technology — Cloud & Retail',      founded_year: 1994, headcount_range: '1,600,000+', hq_location: 'Seattle, WA' },
  meta:       { slug: 'meta',       name: 'Meta',                industry: 'Technology — Social & AI',         founded_year: 2004, headcount_range: '70,000+',    hq_location: 'Menlo Park, CA' },
  microsoft:  { slug: 'microsoft',  name: 'Microsoft',           industry: 'Technology — Cloud & Software',    founded_year: 1975, headcount_range: '220,000+',   hq_location: 'Redmond, WA' },
  flipkart:   { slug: 'flipkart',   name: 'Flipkart',            industry: 'Technology — E-commerce',          founded_year: 2007, headcount_range: '30,000+',    hq_location: 'Bengaluru, India' },
  meesho:     { slug: 'meesho',     name: 'Meesho',              industry: 'Technology — Social Commerce',     founded_year: 2015, headcount_range: '5,000+',     hq_location: 'Bengaluru, India' },
  nvidia:     { slug: 'nvidia',     name: 'NVIDIA',              industry: 'Technology — Semiconductors & AI', founded_year: 1993, headcount_range: '26,000+',    hq_location: 'Santa Clara, CA' },
  tcs:        { slug: 'tcs',        name: 'TCS',                 industry: 'IT Services',                      founded_year: 1968, headcount_range: '600,000+',   hq_location: 'Mumbai, India' },
  infosys:    { slug: 'infosys',    name: 'Infosys',             industry: 'IT Services',                      founded_year: 1981, headcount_range: '300,000+',   hq_location: 'Bengaluru, India' },
  wipro:      { slug: 'wipro',      name: 'Wipro',               industry: 'IT Services',                      founded_year: 1945, headcount_range: '250,000+',   hq_location: 'Bengaluru, India' },
  razorpay:   { slug: 'razorpay',   name: 'Razorpay',            industry: 'Fintech — Payments',               founded_year: 2014, headcount_range: '4,000+',     hq_location: 'Bengaluru, India' },
  zepto:      { slug: 'zepto',      name: 'Zepto',               industry: 'Technology — Quick Commerce',      founded_year: 2021, headcount_range: '3,000+',     hq_location: 'Mumbai, India' },
  swiggy:     { slug: 'swiggy',     name: 'Swiggy',              industry: 'Technology — Food Delivery',       founded_year: 2014, headcount_range: '5,000+',     hq_location: 'Bengaluru, India' },
  atlassian:  { slug: 'atlassian',  name: 'Atlassian',           industry: 'Technology — Developer Tools',     founded_year: 2002, headcount_range: '8,000+',     hq_location: 'Sydney, Australia' },
  jpmorgan:   { slug: 'jpmorgan',   name: 'JPMorgan Chase',      industry: 'Finance — Banking',                founded_year: 1799, headcount_range: '300,000+',   hq_location: 'New York, NY' },
  stripe:     { slug: 'stripe',     name: 'Stripe',              industry: 'Fintech — Payments',               founded_year: 2010, headcount_range: '15,000+',     hq_location: 'San Francisco, CA' },
}
