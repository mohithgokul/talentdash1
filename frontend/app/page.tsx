import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getMedian, convertAmount, formatCurrency } from '@/lib/data-utils'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'TalentDash | Tech Compensation Intelligence',
  description:
    'Real salary data for tech professionals. Compare compensation across India and globally. Structured, verified, decision-ready.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'TalentDash | Tech Compensation Intelligence',
    description: 'Real salary data for tech professionals in India and globally.',
    url: SITE_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TalentDash',
  url: SITE_URL,
  description: 'Structured compensation intelligence for tech professionals.',
}

export const revalidate = 3600 // ISR: Revalidate every hour

export default async function HomePage() {
  let totalRecords = 0
  let companies: any[] = []
  let allSalaries: any[] = []

  try {
    const results = await Promise.all([
      prisma.salary.count(),
      prisma.company.findMany(),
      prisma.salary.findMany({
        select: { total_compensation: true, currency: true, company: { select: { slug: true } } }
      })
    ])
    totalRecords = results[0]
    companies = results[1]
    allSalaries = results[2]
  } catch (error) {
    console.warn("Database connection failed. Showing empty data. Please configure DATABASE_URL.")
  }

  const allTcUsd = allSalaries.map((r: any) => convertAmount(Number(r.total_compensation), r.currency as any, 'USD'))
  const medianUsd = getMedian(allTcUsd)

  const featuredSlugs = ['google', 'amazon', 'meta', 'microsoft', 'flipkart', 'razorpay', 'nvidia', 'tcs']
  const featured = companies.filter((c: any) => featuredSlugs.includes(c.slug))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-fade">
        {/* Hero Section */}
        <section className="bg-white border-b border-[#EBEBEB]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#FF5A5F] mb-4">
              Compensation Intelligence
            </p>
            <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.08] text-[#222222] max-w-3xl mb-5 tracking-tight">
              Know what tech roles actually pay — in India and globally.
            </h1>
            <p className="text-[18px] text-[#484848] leading-relaxed max-w-2xl mb-10">
              Structured, comparable, decision-ready salary data. Verified offers and self-reported
              records across {companies.length}+ companies, with level standardisation and INR&nbsp;/&nbsp;USD parity.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/salaries"
                className="px-6 py-3 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E54550] transition-colors shadow-sm text-[15px]"
              >
                Browse salaries →
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-white text-[#222222] font-semibold border border-[#EBEBEB] rounded-lg hover:bg-[#F2F2F2] transition-colors text-[15px]"
              >
                Compare two offers
              </Link>
            </div>

            {/* Stat strip */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Records',           value: String(totalRecords) },
                { label: 'Companies',         value: String(companies.length) },
                { label: 'Median TC (global)',value: formatCurrency(medianUsd, 'USD'), blue: true },
                { label: 'Currencies',        value: 'INR · USD' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#EBEBEB] rounded-lg p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#717171] mb-2">
                    {s.label}
                  </div>
                  <div
                    className="font-bold tabular-nums"
                    style={{ fontSize: 32, lineHeight: 1.1, color: s.blue ? '#0369A1' : '#222222' }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured companies */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-[28px] font-bold text-[#222222]">Featured companies</h2>
          <p className="mt-1.5 text-[15px] text-[#484848] mb-8">
            Jump into compensation data for any of these.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((c: any) => {
              const recs = allSalaries.filter((r: any) => r.company.slug === c.slug)
              const tcsUsd = recs.map((r: any) => convertAmount(Number(r.total_compensation), r.currency, 'USD'))
              const med = getMedian(tcsUsd)
              return (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="block bg-white border border-[#EBEBEB] rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="text-[15px] font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[12px] text-[#717171] mt-1 mb-3 truncate">
                    {c.industry}
                  </div>
                  <div className="text-[13px] text-[#484848]">
                    {recs.length} record{recs.length !== 1 ? 's' : ''} · median{' '}
                    <span className="font-semibold text-[#0369A1]">
                      {med ? formatCurrency(med, 'USD') : '—'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Value prop strip */}
        <section className="bg-white border-t border-[#EBEBEB] py-14">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Level-standardised',  desc: 'Every record maps to a universal level enum — L3 through Principal. Compare like-for-like.' },
              { icon: '🔒', title: 'Verified records',     desc: 'Contributor records are cross-checked for plausibility. Low-confidence records are clearly labelled.' },
              { icon: '⚡', title: 'Instant comparison',  desc: 'Pick any two records and see a field-by-field delta in under 3 clicks.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#222222] mb-1">{f.title}</h3>
                  <p className="text-[14px] text-[#717171] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
