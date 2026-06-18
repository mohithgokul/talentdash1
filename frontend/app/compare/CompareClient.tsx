'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, convertAmount } from '@/lib/data-utils'
import LevelBadge from '@/components/ui/LevelBadge'
import type { Currency } from '@/types'

interface SalaryRow {
  id: string
  company: string
  company_slug?: string
  role: string
  level_standardized: string
  location: string
  currency: string
  experience_years: number
  base_salary: number
  bonus: number
  stock: number
  total_compensation: number
}

interface Props {
  records: SalaryRow[]
}

function DeltaCell({
  a,
  b,
  currency,
  suffix = '',
}: {
  a: number
  b: number
  currency: Currency
  suffix?: string
}) {
  const delta = b - a
  if (delta === 0) return <span className="text-[#717171]">—</span>
  const positive = delta > 0
  const formatted = suffix
    ? `${positive ? '+' : ''}${delta}${suffix}`
    : `${positive ? '+' : ''}${formatCurrency(Math.abs(delta), currency)}${positive ? ' more' : ' less'}`
  return (
    <span className={`font-semibold tabular-nums ${positive ? 'text-[#008A05]' : 'text-[#D93025]'}`}>
      {formatted}
    </span>
  )
}

export default function CompareClient({ records }: Props) {
  const router = useRouter()
  const [id1, setId1] = useState('')
  const [id2, setId2] = useState('')

  const record1 = id1 ? records.find((r) => r.id === id1) ?? null : null
  const record2 = id2 ? records.find((r) => r.id === id2) ?? null : null

  const displayCurrency: Currency =
    record1?.currency === 'USD' || record2?.currency === 'USD' ? 'USD' : 'INR'

  const tc1 = record1 ? convertAmount(record1.total_compensation, record1.currency as Currency, displayCurrency) : 0
  const tc2 = record2 ? convertAmount(record2.total_compensation, record2.currency as Currency, displayCurrency) : 0

  const selectClass =
    'w-full px-3 py-2.5 border border-[#EBEBEB] rounded-lg text-[#484848] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] appearance-none cursor-pointer transition-all'

  const ROWS: { label: string; render: (r: SalaryRow) => React.ReactNode; delta?: (a: SalaryRow, b: SalaryRow) => React.ReactNode }[] = [
    {
      label: 'Company',
      render: (r) => <span className="font-semibold text-[#222222]">{r.company}</span>,
    },
    {
      label: 'Role',
      render: (r) => <span className="text-[#484848]">{r.role}</span>,
    },
    {
      label: 'Level',
      render: (r) => <LevelBadge level={r.level_standardized as import('@/types').Level} />,
    },
    {
      label: 'Location',
      render: (r) => <span className="text-[#484848]">{r.location}</span>,
    },
    {
      label: 'Experience',
      render: (r) => <span className="text-[#484848]">{r.experience_years} yr</span>,
      delta: (a, b) => (
        <DeltaCell a={a.experience_years} b={b.experience_years} currency={displayCurrency} suffix=" yr" />
      ),
    },
    {
      label: 'Base Salary',
      render: (r) => (
        <span className="text-[#484848] tabular-nums">
          {formatCurrency(convertAmount(r.base_salary, r.currency as Currency, displayCurrency), displayCurrency)}
        </span>
      ),
      delta: (a, b) => (
        <DeltaCell
          a={convertAmount(a.base_salary, a.currency as Currency, displayCurrency)}
          b={convertAmount(b.base_salary, b.currency as Currency, displayCurrency)}
          currency={displayCurrency}
        />
      ),
    },
    {
      label: 'Bonus',
      render: (r) =>
        r.bonus > 0 ? (
          <span className="text-[#484848] tabular-nums">
            {formatCurrency(convertAmount(r.bonus, r.currency as Currency, displayCurrency), displayCurrency)}
          </span>
        ) : (
          <span className="text-[#B0B0B0]">—</span>
        ),
      delta: (a, b) => (
        <DeltaCell
          a={convertAmount(a.bonus, a.currency as Currency, displayCurrency)}
          b={convertAmount(b.bonus, b.currency as Currency, displayCurrency)}
          currency={displayCurrency}
        />
      ),
    },
    {
      label: 'Stock / RSU',
      render: (r) =>
        r.stock > 0 ? (
          <span className="text-[#484848] tabular-nums">
            {formatCurrency(convertAmount(r.stock, r.currency as Currency, displayCurrency), displayCurrency)}
          </span>
        ) : (
          <span className="text-[#B0B0B0]">—</span>
        ),
      delta: (a, b) => (
        <DeltaCell
          a={convertAmount(a.stock, a.currency as Currency, displayCurrency)}
          b={convertAmount(b.stock, b.currency as Currency, displayCurrency)}
          currency={displayCurrency}
        />
      ),
    },
    {
      label: 'Total Comp',
      render: (r) => (
        <span className="font-bold text-[#0369A1] text-[18px] tabular-nums">
          {formatCurrency(convertAmount(r.total_compensation, r.currency as Currency, displayCurrency), displayCurrency)}
        </span>
      ),
      delta: (a, b) => <DeltaCell a={tc1} b={tc2} currency={displayCurrency} />,
    },
  ]

  return (
    <div className="page-fade min-h-screen bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <a href="/salaries" className="text-[#FF5A5F] text-sm font-medium hover:underline inline-block mb-4">
          ← Back to salaries
        </a>
        <h1 className="text-[36px] font-bold text-[#222222] mb-1">Compare Offers</h1>
        <p className="text-[#484848] text-[15px] mt-1 mb-8">
          Pick any two salary records to see a field-by-field breakdown with deltas.
        </p>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Record A', value: id1, setter: setId1 },
            { label: 'Record B', value: id2, setter: setId2 },
          ].map(({ label, value, setter }) => (
            <div key={label} className="bg-white border border-[#EBEBEB] rounded-xl p-5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#717171] mb-2">
                {label}
              </label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className={selectClass}
              >
                <option value="">Select a salary record…</option>
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.company} — {r.role} ({r.level_standardized}) ·{' '}
                    {formatCurrency(r.total_compensation, r.currency as Currency)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        {record1 && record2 ? (
          <div className="overflow-x-auto rounded-xl border border-[#EBEBEB] bg-white">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F7F7F7]">
                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#717171] w-1/4">Field</th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#717171] w-1/4">
                    <div className="flex items-center gap-2">
                      Record A
                      {tc1 > tc2 && (
                        <span className="px-2 py-0.5 rounded bg-[#0369A1] text-white text-[10px] font-bold">HIGHER TC</span>
                      )}
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#717171] w-1/4">
                    <div className="flex items-center gap-2">
                      Record B
                      {tc2 > tc1 && (
                        <span className="px-2 py-0.5 rounded bg-[#0369A1] text-white text-[10px] font-bold">HIGHER TC</span>
                      )}
                    </div>
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#717171] w-1/4">Δ (B − A)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-[#EBEBEB] last:border-b-0 hover:bg-[#F9F9F9] ${
                      row.label === 'Total Comp' ? 'bg-[#FAFAFA]' : ''
                    }`}
                  >
                    <td className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#717171]">
                      {row.label}
                    </td>
                    <td className="px-5 py-4">{row.render(record1)}</td>
                    <td className="px-5 py-4">{row.render(record2)}</td>
                    <td className="px-5 py-4 text-right">
                      {row.delta ? row.delta(record1, record2) : <span className="text-[#717171]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-14 text-center">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="text-[#222222] font-semibold mb-1">Select two records to compare</p>
            <p className="text-[#717171] text-sm">
              Choose Record A and Record B from the dropdowns above.
            </p>
          </div>
        )}

        <p className="text-center mt-6 text-[12px] text-[#717171]">
          Deltas shown in {displayCurrency}. Cross-currency amounts converted at a fixed rate.
        </p>
      </div>
    </div>
  )
}
