export type Currency = "INR" | "USD";

export type LevelKey =
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "Principal"
  | "SDE-I"
  | "SDE-II"
  | "SDE-III"
  | "Staff";

export interface SalaryRecord {
  id: string;
  company: string;
  company_slug: string;
  role: string;
  level_standardized: LevelKey;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus: number | null;
  stock: number | null;
  total_compensation: number;
  source: string;
  confidence_score: number; // 0..1
  is_verified: boolean;
}

export interface CompanyMeta {
  slug: string;
  name: string;
  industry: string;
  founded: number;
  headcount: string;
  hq: string;
}
