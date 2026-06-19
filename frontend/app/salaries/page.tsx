import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { parseSearchParams, convertAmount } from '@/lib/data-utils'
import { PAGE_SIZE, SITE_URL } from '@/lib/constants'
import SalariesTable from '@/components/features/SalariesTable'
import FilterBar from '@/components/features/FilterBar'
import Pagination from '@/components/features/Pagination'
import EmptyState from '@/components/features/EmptyState'
import type { Currency, SortKey } from '@/types'

export const metadata: Metadata = {
  title: 'Tech Salaries — Filter by Company, Role, Level & Location',
  description:
    'Browse verified tech salary records across India and globally. Filter by company, role, level, and location. INR and USD.',
  alternates: { canonical: `${SITE_URL}/salaries` },
  openGraph: {
    title: 'Tech Salaries | TalentDash',
    description: 'Verified tech compensation data. Filter by company, role, level, location.',
    url: `${SITE_URL}/salaries`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'TalentDash Tech Salary Records',
  description: 'Verified salary records for technology roles across India and global markets.',
  keywords: ['salary', 'compensation', 'tech', 'India', 'levels', 'LPA'],
  creator: { '@type': 'Organization', name: 'TalentDash', url: SITE_URL },
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function SalariesPage({ searchParams }: Props) {
  const sp = await searchParams
  const filters = parseSearchParams(sp)

  const where: any = {}
  if (filters.company) where.company = { name: { contains: filters.company, mode: 'insensitive' } }
  if (filters.role) where.role = filters.role
  if (filters.levels.length) where.level = { in: filters.levels }
  if (filters.location) where.location = filters.location

  let orderBy: any = { total_compensation: 'desc' }
  switch (filters.sort) {
    case 'tc_asc':    orderBy = { total_compensation: 'asc' }; break;
    case 'base_desc': orderBy = { base_salary: 'desc' }; break;
    case 'base_asc':  orderBy = { base_salary: 'asc' }; break;
    case 'exp_desc':  orderBy = { experience_years: 'desc' }; break;
    case 'exp_asc':   orderBy = { experience_years: 'asc' }; break;
    case 'date_desc': orderBy = { createdAt: 'desc' }; break;
  }

  const skip = (filters.page - 1) * PAGE_SIZE

  let total = 0
  let rawRecords: any[] = []
  let allRoles: any[] = []
  let allLocations: any[] = []

  try {
    const results = await Promise.all([
      prisma.salary.count({ where }),
      prisma.salary.findMany({
        where,
        orderBy,
        skip,
        take: PAGE_SIZE,
        include: { company: true },
      }),
      prisma.salary.findMany({ select: { role: true }, distinct: ['role'] }),
      prisma.salary.findMany({ select: { location: true }, distinct: ['location'] })
    ])
    total = results[0]
    rawRecords = results[1]
    allRoles = results[2]
    allLocations = results[3]
  } catch (error) {
    console.warn("Database connection failed on Salaries page. Showing empty data. Please configure DATABASE_URL.")
  }

  const records = rawRecords.map((r: any) => ({
    ...r,
    company: r.company.name,
    company_slug: r.company.slug,
    base_salary: Number(r.base_salary),
    bonus: Number(r.bonus),
    stock: Number(r.stock),
    total_compensation: Number(r.total_compensation),
  }))

  const roles = allRoles.map((r: any) => r.role).sort()
  const locations = allLocations.map((l: any) => l.location).sort()
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Reconstruct base params string for sort/pagination links
  const baseParams = new URLSearchParams()
  if (filters.company)          baseParams.set('company',  filters.company)
  if (filters.role)             baseParams.set('role',     filters.role)
  if (filters.levels.length)    baseParams.set('levels',   filters.levels.join(','))
  if (filters.location)         baseParams.set('location', filters.location)
  if (filters.currency !== 'INR') baseParams.set('currency', filters.currency)
  baseParams.set('sort', filters.sort)
  const baseParamsStr = baseParams.toString()

  const hasFilters = !!(filters.company || filters.role || filters.levels.length || filters.location)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-fade min-h-screen bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <h1 className="text-[36px] font-bold text-[#222222] leading-tight">Tech Salaries</h1>
            <p className="mt-1 text-[15px] text-[#717171]">
              {total} record{total !== 1 ? 's' : ''} ·{' '}
              {hasFilters ? 'filtered' : 'all data'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-[12px] text-[#717171] self-center">Sort by:</span>
            {(
              [
                ['tc_desc',   'Total Comp ↓'],
                ['tc_asc',    'Total Comp ↑'],
                ['base_desc', 'Base ↓'],
                ['base_asc',  'Base ↑'],
                ['exp_desc',  'Experience ↓'],
                ['exp_asc',   'Experience ↑'],
              ] as [SortKey, string][]
            ).map(([key, label]) => {
              const sp2 = new URLSearchParams(baseParamsStr)
              sp2.set('sort', key)
              sp2.set('page', '1')
              return (
                <a
                  key={key}
                  href={`/salaries?${sp2.toString()}`}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                    filters.sort === key
                      ? 'bg-[#222222] text-white'
                      : 'bg-white border border-[#EBEBEB] text-[#222222] hover:bg-[#F2F2F2]'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>

          <Suspense>
            <FilterBar roles={roles} locations={locations} />
          </Suspense>

          {total === 0 ? (
            <div className="mt-6">
              <EmptyState onClearHref="/salaries" />
            </div>
          ) : (
            <>
              <div className="mt-6">
                <SalariesTable
                  records={records as any}
                  displayCurrency={filters.currency as Currency}
                  sortKey={filters.sort}
                  baseParams={baseParamsStr}
                />
              </div>
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                baseParams={baseParamsStr}
                basePath="/salaries"
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
