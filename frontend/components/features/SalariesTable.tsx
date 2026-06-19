// Server Component — zero client JS shipped for the table
import Link from 'next/link'
import type { SalaryRecord, Currency, SortKey, Level } from '@/types'
import { formatCurrency, convertAmount } from '@/lib/data-utils'
import LevelBadge from '@/components/ui/LevelBadge'

interface Props {
  records: SalaryRecord[]
  displayCurrency: Currency
  sortKey: SortKey
  baseParams: string // current URL search params string for sort links
}

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return <span className="ml-1 text-[#EBEBEB]">↕</span>
  return <span className="ml-1 text-[#FF5A5F]">{asc ? '↑' : '↓'}</span>
}

function buildSortHref(baseParams: string, column: string, currentKey: SortKey): string {
  const colAsc = `${column}_asc`
  const colDesc = `${column}_desc`
  const isCurrentAsc = currentKey === colAsc
  const nextSort = isCurrentAsc ? colDesc : colAsc
  const sp = new URLSearchParams(baseParams)
  sp.set('sort', nextSort)
  sp.set('page', '1')
  return `/salaries?${sp.toString()}`
}

function HeaderCell({
  label,
  column,
  sortKey,
  baseParams,
  align = 'left',
}: {
  label: string
  column: string
  sortKey: SortKey
  baseParams: string
  align?: 'left' | 'right'
}) {
  const isActive = sortKey.startsWith(column)
  const isAsc = sortKey === `${column}_asc`
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold text-[#717171] bg-[#F7F7F7] border-b border-[#EBEBEB] uppercase tracking-wider ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      <Link
        href={buildSortHref(baseParams, column, sortKey)}
        className="inline-flex items-center hover:text-[#222222] transition-colors cursor-pointer"
      >
        {label}
        <SortIcon active={isActive} asc={isAsc} />
      </Link>
    </th>
  )
}

export default function SalariesTable({ records, displayCurrency, sortKey, baseParams }: Props) {
  if (records.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-lg border border-[#EBEBEB] bg-white">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr>
            <HeaderCell label="Company"    column="company"    sortKey={sortKey} baseParams={baseParams} />
            <HeaderCell label="Role"       column="role"       sortKey={sortKey} baseParams={baseParams} />
            <th className="px-4 py-3 text-xs font-semibold text-[#717171] bg-[#F7F7F7] border-b border-[#EBEBEB] uppercase tracking-wider text-left">
              Level
            </th>
            <HeaderCell label="Location"   column="location"   sortKey={sortKey} baseParams={baseParams} />
            <HeaderCell label="Exp"        column="exp"        sortKey={sortKey} baseParams={baseParams} />
            <HeaderCell label="Base"       column="base"       sortKey={sortKey} baseParams={baseParams} align="right" />
            <th className="px-4 py-3 text-xs font-semibold text-[#717171] bg-[#F7F7F7] border-b border-[#EBEBEB] uppercase tracking-wider text-right">
              Stock
            </th>
            <HeaderCell label="Total Comp" column="tc"         sortKey={sortKey} baseParams={baseParams} align="right" />
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => (
            <tr
              key={record.id}
              className="border-b border-[#EBEBEB] hover:bg-[#F9F9F9] transition-colors last:border-b-0"
            >
              {/* Company */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/companies/${record.company_slug}`}
                    className="font-semibold text-[#222222] hover:text-[#FF5A5F] transition-colors leading-tight"
                  >
                    {record.company}
                  </Link>
                  {record.is_verified && (
                    <span title="Verified record" className="text-[#008A05]">
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                        <path d="M10 3L4.5 8.5L2 6" stroke="#008A05" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
              </td>

              {/* Role */}
              <td className="px-4 py-3.5 text-[#484848] max-w-[180px]">
                <span className="line-clamp-2 leading-snug">{record.role}</span>
              </td>

              {/* Level */}
              <td className="px-4 py-3.5">
                <LevelBadge level={record.level as Level} />
              </td>

              {/* Location */}
              <td className="px-4 py-3.5 text-[#484848] whitespace-nowrap">{record.location}</td>

              {/* Experience */}
              <td className="px-4 py-3.5 text-[#484848] whitespace-nowrap">
                {record.experience_years} yr
              </td>

              {/* Base */}
              <td className="px-4 py-3.5 text-[#484848] text-right tabular-nums whitespace-nowrap">
                {formatCurrency(
                  convertAmount(record.base_salary, record.currency, displayCurrency),
                  displayCurrency
                )}
              </td>

              {/* Stock */}
              <td className="px-4 py-3.5 text-[#484848] text-right tabular-nums whitespace-nowrap">
                {record.stock > 0
                  ? formatCurrency(convertAmount(record.stock, record.currency, displayCurrency), displayCurrency)
                  : '—'}
              </td>

              {/* Total Comp — dominant number */}
              <td className="px-4 py-3.5 text-right">
                <div className="font-bold text-[#0369A1] text-[15px] tabular-nums whitespace-nowrap">
                  {formatCurrency(
                    convertAmount(record.total_compensation, record.currency, displayCurrency),
                    displayCurrency
                  )}
                </div>
                {record.bonus > 0 && (
                  <div className="text-[11px] text-[#717171] mt-0.5 tabular-nums">
                    +{formatCurrency(convertAmount(record.bonus, record.currency, displayCurrency), displayCurrency)} bonus
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
