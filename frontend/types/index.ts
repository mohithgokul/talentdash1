// ─── Level enum — all valid standardized levels ───────────────────────────────
export type Level =
  | 'L3'
  | 'L4'
  | 'L5'
  | 'L6'
  | 'SDE_I'
  | 'SDE_II'
  | 'SDE_III'
  | 'STAFF'
  | 'PRINCIPAL'
  | 'IC4'
  | 'IC5'

// ─── Currency enum ─────────────────────────────────────────────────────────────
export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR'

// ─── Source enum ───────────────────────────────────────────────────────────────
export type Source = 'CONTRIBUTOR' | 'SCRAPED' | 'AI_INFERRED'

// ─── Core salary record — matches integration contract exactly ─────────────────
export interface SalaryRecord {
  id: string
  company: string
  company_slug: string
  role: string
  level: Level
  location: string
  currency: Currency
  experience_years: number
  base_salary: number
  bonus: number          // 0 if not provided — never null in display layer
  stock: number          // 0 if not provided — never null in display layer
  total_compensation: number  // COMPUTED: base + bonus + stock
  source: Source
  confidence_score: number   // 0.0 – 1.0
  submitted_at?: string
  is_verified: boolean
}

// ─── Company profile ───────────────────────────────────────────────────────────
export interface CompanyProfile {
  slug: string
  name: string
  industry: string
  founded_year: number
  headcount_range: string
  headquarters: string
}

// ─── Filter/sort state ─────────────────────────────────────────────────────────
export type SortKey =
  | 'tc_desc'
  | 'tc_asc'
  | 'base_desc'
  | 'base_asc'
  | 'exp_desc'
  | 'exp_asc'
  | 'date_desc'

export interface FilterState {
  company: string
  role: string
  levels: Level[]
  location: string
  currency: Currency
  sort: SortKey
  page: number
}
