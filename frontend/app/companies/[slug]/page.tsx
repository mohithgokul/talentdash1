import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatCurrency, convertAmount, getMedian, getLevelLabel, getLevelBadgeClass } from '@/lib/data-utils'
import { SITE_URL, ALL_LEVELS } from '@/lib/constants'
import LevelBadge from '@/components/ui/LevelBadge'
import type { Level } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

// F3: generateStaticParams — pre-generates one page per unique company at build time
export async function generateStaticParams() {
  let slugs: { slug: string }[] = []
  try {
    const companies = await prisma.company.findMany({ select: { slug: true } })
    slugs = companies.map(c => ({ slug: c.slug }))
  } catch (error) {
    console.warn("DB not connected for generateStaticParams")
  }
  return slugs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let company = null
  try {
    company = await prisma.company.findUnique({ where: { slug } })
  } catch (error) {}
  if (!company) return {}
  const title = `${company.name} Salaries — Levels, Compensation & Reviews`
  const description = `Compensation data for ${company.name} across levels and locations. Median TC, level distribution, and individual salary records.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/companies/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/companies/${slug}` },
  }
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  let company = null
  let companyRecords: any[] = []

  try {
    company = await prisma.company.findUnique({ where: { slug } })
    if (company) {
      companyRecords = await prisma.salary.findMany({
        where: { company_id: company.id },
        orderBy: { total_compensation: 'desc' }
      })
    }
  } catch (error) {
    console.warn("DB connection failed for company page")
  }

  if (!company || companyRecords.length === 0) notFound()

  // TypeScript narrowing — company is guaranteed non-null past this point
  const companyData = company!

  // Compute stats — always server-side, never hardcoded
  const primaryCurrency = companyRecords[0].currency
  const allTc = companyRecords.map((r) =>
    convertAmount(r.total_compensation, r.currency, primaryCurrency)
  )
  const medianTC = getMedian(allTc)
  const minTC    = Math.min(...allTc)
  const maxTC    = Math.max(...allTc)

  // Level distribution
  const levelCounts = companyRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.level_standardized] = (acc[r.level_standardized] || 0) + 1
    return acc
  }, {})
  const levelDist = ALL_LEVELS.map((l) => ({
    level: l,
    count: levelCounts[l] ?? 0,
    pct:   ((levelCounts[l] ?? 0) / companyRecords.length) * 100,
  })).filter((d) => d.count > 0)

  // Level bar colours reused from badge system
  const LEVEL_COLORS: Record<Level, string> = {
    'L3':        '#9CA3AF',
    'SDE-I':     '#9CA3AF',
    'L4':        '#60A5FA',
    'SDE-II':    '#60A5FA',
    'L5':        '#818CF8',
    'SDE-III':   '#818CF8',
    'IC4':       '#818CF8',
    'L6':        '#C084FC',
    'IC5':       '#C084FC',
    'Staff':     '#C084FC',
    'Principal': '#1E1B4B',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyData.name,
    url: `${SITE_URL}/companies/${slug}`,
    foundingDate: String(companyData.founded_year ?? ''),
    numberOfEmployees: { '@type': 'QuantitativeValue', description: companyData.headcount_range ?? '' },
    address: { '@type': 'PostalAddress', addressLocality: companyData.hq_location ?? '' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-fade min-h-screen bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Back */}
          <Link href="/salaries" className="inline-flex items-center gap-1 text-[#FF5A5F] text-sm font-medium hover:underline mb-6">
            ← Back to salaries
          </Link>

          {/* Company header */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-8 mb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <h1 className="text-[36px] font-bold text-[#222222] leading-tight">{companyData.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[13px] text-[#717171]">
                <span className="bg-[#F2F2F2] text-[#484848] font-medium px-2.5 py-1 rounded-md">
                  {companyData.industry}
                </span>
                <span>Founded {companyData.founded_year}</span>
                <span>·</span>
                <span>{companyData.headcount_range} employees</span>
                <span>·</span>
                <span>{companyData.hq_location}</span>
              </div>
            </div>
            <Link
              href={`/compare?s1=${companyRecords[0]?.id}`}
              className="shrink-0 px-5 py-2.5 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E54550] transition-colors text-[14px]"
            >
              Compare →
            </Link>
          </div>

          {/* Compensation overview — median computed server-side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#717171] mb-2">Median Total Comp</div>
              <div className="text-[32px] font-bold text-[#0369A1] tabular-nums leading-none">
                {formatCurrency(medianTC, primaryCurrency)}
              </div>
            </div>
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#717171] mb-2">TC Range</div>
              <div className="text-[18px] font-bold text-[#222222] leading-snug tabular-nums">
                {formatCurrency(minTC, primaryCurrency)}
                <span className="text-[#717171] font-normal mx-1">—</span>
                {formatCurrency(maxTC, primaryCurrency)}
              </div>
            </div>
            <div className="bg-white border border-[#EBEBEB] rounded-xl p-6">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[#717171] mb-2">Records</div>
              <div className="text-[32px] font-bold text-[#222222] leading-none">{companyRecords.length}</div>
            </div>
          </div>

          {/* Level distribution bar */}
          <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 mb-6">
            <h2 className="text-[13px] font-semibold text-[#717171] mb-4">Records by level</h2>
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden bg-[#F2F2F2] mb-4">
              {levelDist.map(({ level, pct }) => (
                <div
                  key={level}
                  style={{ width: `${pct}%`, backgroundColor: LEVEL_COLORS[level as Level] }}
                  title={`${getLevelLabel(level as Level)}: ${Math.round(pct)}%`}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {levelDist.map(({ level, count, pct }) => (
                <div key={level} className="flex items-center gap-1.5 text-[12px] text-[#717171]">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: LEVEL_COLORS[level as Level] }}
                  />
                  <span>{getLevelLabel(level as Level)} · {count} ({Math.round(pct)}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary table */}
          <h2 className="text-[20px] font-bold text-[#222222] mb-4">Salary records</h2>
          <div className="overflow-x-auto rounded-xl border border-[#EBEBEB] bg-white">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#F7F7F7]">
                  {['Role', 'Level', 'Location', 'Exp', 'Base', 'Stock', 'Total Comp'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#717171] ${h === 'Total Comp' || h === 'Base' || h === 'Stock' ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companyRecords.map((r) => (
                  <tr key={r.id} className="border-b border-[#EBEBEB] last:border-b-0 hover:bg-[#F9F9F9] transition-colors">
                    <td className="px-4 py-3.5 text-[#484848] max-w-[200px]">
                      <span className="line-clamp-2">{r.role}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <LevelBadge level={r.level_standardized} />
                    </td>
                    <td className="px-4 py-3.5 text-[#484848] whitespace-nowrap">{r.location}</td>
                    <td className="px-4 py-3.5 text-[#484848] whitespace-nowrap">{r.experience_years} yr</td>
                    <td className="px-4 py-3.5 text-[#484848] text-right tabular-nums whitespace-nowrap">
                      {formatCurrency(r.base_salary, r.currency)}
                    </td>
                    <td className="px-4 py-3.5 text-[#484848] text-right tabular-nums whitespace-nowrap">
                      {r.stock > 0 ? formatCurrency(r.stock, r.currency) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-bold text-[#0369A1] text-[15px] tabular-nums">
                        {formatCurrency(r.total_compensation, r.currency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  )
}
