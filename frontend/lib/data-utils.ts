import type { Level, SalaryRecord, SortKey, FilterState, Currency } from '@/types'
import { USD_TO_INR, INR_TO_USD, PAGE_SIZE } from '@/lib/constants'
import { LEVEL_LABELS, LEVEL_BADGE_CLASSES } from '@/lib/constants'

// ─── Currency formatting ───────────────────────────────────────────────────────

export function formatCurrency(value: number, currency: Currency): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }
  if (currency === 'GBP') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(value)
  }
  return `€${Math.round(value).toLocaleString()}`
}

// ─── Convert amount between currencies ────────────────────────────────────────

export function convertAmount(
  value: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return value
  // Normalise to USD first, then convert
  let usd = value
  if (from === 'INR') usd = value * INR_TO_USD
  else if (from === 'GBP') usd = value * 1.27
  else if (from === 'EUR') usd = value * 1.09

  if (to === 'INR') return usd * USD_TO_INR
  if (to === 'GBP') return usd / 1.27
  if (to === 'EUR') return usd / 1.09
  return usd
}

// ─── Level helpers ─────────────────────────────────────────────────────────────

export function getLevelLabel(level: Level): string {
  return LEVEL_LABELS[level] ?? level
}

export function getLevelBadgeClass(level: Level): string {
  return LEVEL_BADGE_CLASSES[level] ?? 'bg-[#E8E8E8] text-[#424242]'
}

// ─── Filtering ─────────────────────────────────────────────────────────────────

export function filterRecords(
  records: SalaryRecord[],
  filters: {
    company?: string
    role?: string
    levels?: Level[]
    location?: string
    currency?: Currency
  }
): SalaryRecord[] {
  return records.filter((r) => {
    if (filters.company && !r.company.toLowerCase().includes(filters.company.toLowerCase()))
      return false
    if (filters.role && r.role !== filters.role) return false
    if (filters.levels && filters.levels.length > 0 && !filters.levels.includes(r.level_standardized))
      return false
    if (filters.location && r.location !== filters.location) return false
    return true
  })
}

// ─── Sorting ───────────────────────────────────────────────────────────────────

export function sortRecords(
  records: SalaryRecord[],
  sort: SortKey,
  displayCurrency: Currency = 'INR'
): SalaryRecord[] {
  const tc = (r: SalaryRecord) => convertAmount(r.total_compensation, r.currency, displayCurrency)
  const base = (r: SalaryRecord) => convertAmount(r.base_salary, r.currency, displayCurrency)

  return [...records].sort((a, b) => {
    switch (sort) {
      case 'tc_asc':    return tc(a) - tc(b)
      case 'base_desc': return base(b) - base(a)
      case 'base_asc':  return base(a) - base(b)
      case 'exp_desc':  return b.experience_years - a.experience_years
      case 'exp_asc':   return a.experience_years - b.experience_years
      case 'date_desc':
        return (b.submitted_at ?? '').localeCompare(a.submitted_at ?? '')
      default:          return tc(b) - tc(a) // tc_desc
    }
  })
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export function paginateRecords<T>(
  records: T[],
  page: number,
  pageSize: number = PAGE_SIZE
): { records: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = records.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize
  return {
    records: records.slice(start, start + pageSize),
    total,
    page: current,
    pageSize,
    totalPages,
  }
}

// ─── Unique value extraction ───────────────────────────────────────────────────

export function getUniqueValues<T>(records: T[], key: keyof T): string[] {
  const set = new Set<string>()
  records.forEach((r) => {
    const v = r[key]
    if (v !== null && v !== undefined) set.add(String(v))
  })
  return Array.from(set).sort()
}

// ─── Median computation ────────────────────────────────────────────────────────

export function getMedian(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

// ─── Parse URL filter state ────────────────────────────────────────────────────

export function parseSearchParams(sp: Record<string, string | string[] | undefined>): FilterState {
  const levels = typeof sp.levels === 'string'
    ? (sp.levels.split(',').filter(Boolean) as Level[])
    : []

  return {
    company:  String(sp.company ?? ''),
    role:     String(sp.role ?? ''),
    levels,
    location: String(sp.location ?? ''),
    currency: (sp.currency as Currency) ?? 'INR',
    sort:     (sp.sort as SortKey) ?? 'tc_desc',
    page:     Math.max(1, parseInt(String(sp.page ?? '1'), 10)),
  }
}
