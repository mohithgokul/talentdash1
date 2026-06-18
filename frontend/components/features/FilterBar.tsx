'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Level, Currency } from '@/types'
import { ALL_LEVELS, LEVEL_LABELS } from '@/lib/constants'

interface Props {
  roles: string[]
  locations: string[]
}

export default function FilterBar({ roles, locations }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Read current state from URL
  const currentCompany  = searchParams.get('company') ?? ''
  const currentRole     = searchParams.get('role') ?? ''
  const currentLocation = searchParams.get('location') ?? ''
  const currentCurrency = (searchParams.get('currency') ?? 'INR') as Currency
  const rawLevels       = searchParams.get('levels') ?? ''
  const currentLevels   = rawLevels ? rawLevels.split(',').filter(Boolean) as Level[] : []

  // Local state only for the debounced company input
  const [companyInput, setCompanyInput] = useState(currentCompany)

  function pushParams(overrides: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) sp.set(k, v)
      else sp.delete(k)
    })
    sp.set('page', '1')
    router.push(`/salaries?${sp.toString()}`)
  }

  const handleCompanyChange = useCallback(
    (value: string) => {
      setCompanyInput(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        pushParams({ company: value })
      }, 300)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  )

  function toggleLevel(level: Level) {
    const next = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level]
    pushParams({ levels: next.join(',') })
  }

  const hasFilters =
    currentCompany || currentRole || currentLocation || currentLevels.length > 0

  return (
    <div className="bg-white rounded-lg border border-[#EBEBEB] p-5 space-y-4">
      {/* Row 1: inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Company search */}
        <div>
          <label className="block text-[11px] font-semibold text-[#717171] uppercase tracking-wider mb-1.5">
            Company
          </label>
          <input
            type="text"
            value={companyInput}
            onChange={(e) => handleCompanyChange(e.target.value)}
            placeholder="e.g. Google, Meta…"
            className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md text-[#484848] text-sm bg-white placeholder-[#B0B0B0] focus:outline-none focus:ring-1 focus:ring-[#FF5A5F] focus:border-[#FF5A5F] transition-all"
          />
        </div>

        {/* Role dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-[#717171] uppercase tracking-wider mb-1.5">
            Role
          </label>
          <select
            value={currentRole}
            onChange={(e) => pushParams({ role: e.target.value })}
            className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md text-[#484848] text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5A5F] appearance-none cursor-pointer"
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Location dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-[#717171] uppercase tracking-wider mb-1.5">
            Location
          </label>
          <select
            value={currentLocation}
            onChange={(e) => pushParams({ location: e.target.value })}
            className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md text-[#484848] text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5A5F] appearance-none cursor-pointer"
          >
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Currency toggle */}
        <div>
          <label className="block text-[11px] font-semibold text-[#717171] uppercase tracking-wider mb-1.5">
            Currency
          </label>
          <div className="inline-flex border border-[#EBEBEB] rounded-md overflow-hidden bg-white">
            {(['INR', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => pushParams({ currency: c })}
                className={`px-4 py-2 text-[13px] font-semibold transition-colors ${
                  currentCurrency === c
                    ? 'bg-[#FF5A5F] text-white'
                    : 'text-[#484848] hover:bg-[#F2F2F2]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: level chips + clear */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider shrink-0">
          Level:
        </span>
        {ALL_LEVELS.map((level) => {
          const active = currentLevels.includes(level)
          return (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-all ${
                active
                  ? 'bg-[#222222] text-white border-[#222222]'
                  : 'bg-white text-[#484848] border-[#EBEBEB] hover:bg-[#F2F2F2]'
              }`}
            >
              {LEVEL_LABELS[level]}
            </button>
          )
        })}
        {hasFilters && (
          <button
            onClick={() => {
              setCompanyInput('')
              router.push('/salaries')
            }}
            className="ml-auto text-[12px] font-semibold text-[#FF5A5F] hover:underline"
          >
            Clear filters ×
          </button>
        )}
      </div>
    </div>
  )
}
