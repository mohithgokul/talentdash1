import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing
  await prisma.salary.deleteMany()
  await prisma.company.deleteMany()

  const companies = [
    { name: 'Google India', slug: 'google', industry: 'Technology', headquarters: 'Mountain View, CA', founded_year: 1998, headcount_range: '10000+' },
    { name: 'Amazon', slug: 'amazon', industry: 'E-commerce', headquarters: 'Seattle, WA', founded_year: 1994, headcount_range: '10000+' },
    { name: 'Meta', slug: 'meta', industry: 'Technology', headquarters: 'Menlo Park, CA', founded_year: 2004, headcount_range: '10000+' },
    { name: 'Microsoft', slug: 'microsoft', industry: 'Technology', headquarters: 'Redmond, WA', founded_year: 1975, headcount_range: '10000+' },
    { name: 'Flipkart', slug: 'flipkart', industry: 'E-commerce', headquarters: 'Bengaluru, India', founded_year: 2007, headcount_range: '10000+' },
    { name: 'Meesho', slug: 'meesho', industry: 'E-commerce', headquarters: 'Bengaluru, India', founded_year: 2015, headcount_range: '1000-5000' },
    { name: 'NVIDIA', slug: 'nvidia', industry: 'Hardware', headquarters: 'Santa Clara, CA', founded_year: 1993, headcount_range: '10000+' },
    { name: 'Tata Consultancy Services', slug: 'tcs', industry: 'IT Services', headquarters: 'Mumbai, India', founded_year: 1968, headcount_range: '10000+' },
    { name: 'Infosys', slug: 'infosys', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1981, headcount_range: '10000+' },
    { name: 'Wipro', slug: 'wipro', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1945, headcount_range: '10000+' },
    { name: 'Razorpay', slug: 'razorpay', industry: 'Fintech', headquarters: 'Bengaluru, India', founded_year: 2014, headcount_range: '1000-5000' },
    { name: 'Zepto', slug: 'zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', founded_year: 2021, headcount_range: '1000-5000' },
  ]

  const createdCompanies: Record<string, string> = {}
  for (const c of companies) {
    const comp = await prisma.company.create({
      data: {
        ...c,
        normalized_name: c.slug
      }
    })
    createdCompanies[c.slug] = comp.id
  }

  const salaries = [
    { company_id: createdCompanies['google'], role: 'Software Engineer', level: 'L3' as const, location: 'Bengaluru', experience_years: 1, base_salary: 1800000, bonus: 200000, stock: 1500000 },
    { company_id: createdCompanies['google'], role: 'Software Engineer', level: 'L4' as const, location: 'Bengaluru', experience_years: 3, base_salary: 3200000, bonus: 400000, stock: 2500000 },
    { company_id: createdCompanies['google'], role: 'Software Engineer III', level: 'L5' as const, location: 'Bengaluru', experience_years: 6, base_salary: 5500000, bonus: 800000, stock: 4000000 },
    { company_id: createdCompanies['amazon'], role: 'SDE I', level: 'SDE_I' as const, location: 'Bengaluru', experience_years: 1, base_salary: 1600000, bonus: 0, stock: 500000 },
    { company_id: createdCompanies['amazon'], role: 'SDE II', level: 'SDE_II' as const, location: 'Hyderabad', experience_years: 4, base_salary: 3000000, bonus: 0, stock: 1200000 },
    { company_id: createdCompanies['amazon'], role: 'SDE III', level: 'SDE_III' as const, location: 'Bengaluru', experience_years: 8, base_salary: 6000000, bonus: 0, stock: 3000000 },
    { company_id: createdCompanies['amazon'], role: 'Principal SDE', level: 'PRINCIPAL' as const, location: 'Seattle', currency: 'USD' as const, experience_years: 15, base_salary: 220000, bonus: 0, stock: 400000 },
    { company_id: createdCompanies['flipkart'], role: 'SDE II', level: 'SDE_II' as const, location: 'Bengaluru', experience_years: 3, base_salary: 2800000, bonus: 200000, stock: 600000 },
    { company_id: createdCompanies['tcs'], role: 'System Engineer', level: 'IC4' as const, location: 'Mumbai', experience_years: 2, base_salary: 700000, bonus: 50000, stock: 0 },
  ]

  for (const s of salaries) {
    await prisma.salary.create({
      data: {
        ...s,
        total_compensation: s.base_salary + s.bonus + s.stock
      }
    })
  }

  console.log(`Seeded ${companies.length} companies and ${salaries.length} salaries.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
