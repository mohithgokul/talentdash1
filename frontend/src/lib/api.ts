import type { SalaryRecord, CompanyMeta } from "../types/salary";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchSalaries(params?: Record<string, any>): Promise<{ data: SalaryRecord[]; meta: any }> {
  const url = new URL(`${API_URL}/salaries`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0) url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    }
  }
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch salaries");
  const json = await res.json();
  
  // Transform backend format to frontend format
  const formattedData = json.data.map((r: any) => ({
    id: r.id,
    company: r.company?.name || "Unknown",
    company_slug: r.company?.slug || "unknown",
    role: r.role,
    level_standardized: r.level,
    location: r.location,
    currency: r.currency,
    experience_years: r.experience_years,
    base_salary: Number(r.base_salary),
    bonus: Number(r.bonus),
    stock: Number(r.stock),
    total_compensation: Number(r.total_compensation),
    source: r.source,
    confidence_score: Number(r.confidence_score),
    is_verified: r.is_verified,
  }));

  return { data: formattedData, meta: json.meta };
}

export async function fetchCompanies(): Promise<CompanyMeta[]> {
  const res = await fetch(`${API_URL}/companies`);
  if (!res.ok) throw new Error("Failed to fetch companies");
  const data = await res.json();
  
  return data.map((c: any) => ({
    slug: c.slug,
    name: c.name,
    industry: c.industry,
    founded: c.founded_year,
    headcount: c.headcount_range,
    hq: c.headquarters,
  }));
}

export async function fetchCompanyData(slug: string) {
  const res = await fetch(`${API_URL}/companies/${slug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch company data");
  }
  const json = await res.json();
  
  const meta: CompanyMeta = {
    slug: json.company.slug,
    name: json.company.name,
    industry: json.company.industry,
    founded: json.company.founded_year,
    headcount: json.company.headcount_range,
    hq: json.company.headquarters,
  };
  
  const salaries = json.salaries.map((r: any) => ({
    id: r.id,
    company: meta.name,
    company_slug: meta.slug,
    role: r.role,
    level_standardized: r.level,
    location: r.location,
    currency: r.currency,
    experience_years: r.experience_years,
    base_salary: Number(r.base_salary),
    bonus: Number(r.bonus),
    stock: Number(r.stock),
    total_compensation: Number(r.total_compensation),
    source: r.source,
    confidence_score: Number(r.confidence_score),
    is_verified: r.is_verified,
  }));

  return { meta, salaries, median_tc: Number(json.median_total_compensation), level_distribution: json.level_distribution };
}

export async function fetchCompareData(idA: string, idB: string) {
  const res = await fetch(`${API_URL}/compare?s1=${idA}&s2=${idB}`);
  if (!res.ok) throw new Error("Failed to fetch comparison data");
  return res.json();
}
