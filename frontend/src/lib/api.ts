const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchCompanies() {
  const res = await fetch(`${API_BASE}/companies`);
  if (!res.ok) throw new Error('Failed to fetch companies');
  return res.json();
}

export async function fetchCompanyData(slug: string) {
  const res = await fetch(`${API_BASE}/companies/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch company');
  return res.json();
}

export async function fetchSalaries(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/salaries?${query}`);
  if (!res.ok) throw new Error('Failed to fetch salaries');
  return res.json();
}

export async function fetchReviews(companyId?: string) {
  const query = companyId ? `?company_id=${companyId}` : '';
  const res = await fetch(`${API_BASE}/reviews${query}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function fetchInterviews(companyId?: string) {
  const query = companyId ? `?company_id=${companyId}` : '';
  const res = await fetch(`${API_BASE}/interviews${query}`);
  if (!res.ok) throw new Error('Failed to fetch interviews');
  return res.json();
}

export async function fetchDiscussions(companyId?: string) {
  const query = companyId ? `?company_id=${companyId}` : '';
  const res = await fetch(`${API_BASE}/discussions${query}`);
  if (!res.ok) throw new Error('Failed to fetch discussions');
  return res.json();
}

export async function fetchWorkplaceIndex(companyId: string) {
  const res = await fetch(`${API_BASE}/workplace-index/${companyId}`);
  if (!res.ok) throw new Error('Failed to fetch workplace index');
  return res.json();
}

export async function fetchOffers() {
  const res = await fetch(`${API_BASE}/offers`);
  if (!res.ok) throw new Error('Failed to fetch offers');
  return res.json();
}
