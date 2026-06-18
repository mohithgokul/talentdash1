import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import CompareClient from './CompareClient'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Compare Offers | TalentDash',
  description: 'Compare tech compensation offers side-by-side.',
  alternates: { canonical: `${SITE_URL}/compare` },
}

export default async function ComparePage() {
  let allSalaries: any[] = []
  
  try {
    allSalaries = await prisma.salary.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { total_compensation: 'desc' },
      take: 200 // Limit for dropdown performance
    })
  } catch (error) {
    console.warn("Database connection failed for compare page")
  }

  // Map to flat structure for the client
  const records = allSalaries.map(r => ({
    ...r,
    company: r.company?.name || 'Unknown'
  }))

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F7]" />}>
      <CompareClient records={records} />
    </Suspense>
  )
}
