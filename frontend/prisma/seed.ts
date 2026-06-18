import { PrismaClient } from '@prisma/client'
import { salaryRecords, companyProfiles } from '../lib/mock-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing
  await prisma.salary.deleteMany()
  await prisma.company.deleteMany()

  // Seed companies
  for (const profile of Object.values(companyProfiles)) {
    await prisma.company.create({
      data: {
        slug: profile.slug,
        name: profile.name,
        industry: profile.industry,
        founded_year: profile.founded_year,
        headcount_range: profile.headcount_range,
        hq_location: profile.hq_location,
      },
    })
  }
  console.log(`Seeded ${Object.keys(companyProfiles).length} companies.`)

  // Get company map for IDs
  const companies = await prisma.company.findMany()
  const companySlugToId = Object.fromEntries(companies.map((c: any) => [c.slug, c.id]))

  // Seed salaries
  for (const record of salaryRecords) {
    const companyId = companySlugToId[record.company_slug]
    if (!companyId) continue

    await prisma.salary.create({
      data: {
        company_id: companyId,
        role: record.role,
        level_standardized: record.level_standardized,
        location: record.location,
        currency: record.currency,
        experience_years: record.experience_years,
        base_salary: record.base_salary,
        bonus: record.bonus,
        stock: record.stock,
        total_compensation: record.total_compensation,
        source: record.source,
        confidence_score: record.confidence_score,
        is_verified: record.is_verified,
      },
    })
  }
  console.log(`Seeded ${salaryRecords.length} salaries.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
