import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing
  await prisma.salary.deleteMany()
  await prisma.company.deleteMany()

  // Normalization logic helper
  const normalize = (name: string) => name.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')

  const getOrCreateCompany = async (name: string, industry: string) => {
    const slug = normalize(name)
    let comp = await prisma.company.findFirst({ where: { slug } })
    if (!comp) {
      comp = await prisma.company.create({
        data: { name: name.trim(), slug, normalized_name: slug, industry, headquarters: 'Unknown', founded_year: 2000, headcount_range: 'Unknown' }
      })
    }
    return comp.id
  }

  const rawSalaries = [
    // Normalization edge cases mapping to Google
    { company: 'Google India', industry: 'Tech', role: 'Software Engineer', level: 'L3' as const, loc: 'Bengaluru', exp: 1, base: 1800000, bonus: 200000, stock: 1500000, curr: 'INR' as const },
    { company: 'GOOGLE', industry: 'Tech', role: 'Software Engineer', level: 'L4' as const, loc: 'Hyderabad', exp: 3, base: 3200000, bonus: 400000, stock: 2500000, curr: 'INR' as const },
    { company: 'google', industry: 'Tech', role: 'Software Engineer III', level: 'L5' as const, loc: 'Bengaluru', exp: 6, base: 5500000, bonus: 800000, stock: 4000000, curr: 'INR' as const },
    
    // Amazon
    { company: 'Amazon', industry: 'E-commerce', role: 'SDE I', level: 'SDE_I' as const, loc: 'Bengaluru', exp: 1, base: 1600000, bonus: 0, stock: 500000, curr: 'INR' as const }, // Edge case: zero bonus
    { company: 'Amazon', industry: 'E-commerce', role: 'SDE II', level: 'SDE_II' as const, loc: 'Hyderabad', exp: 4, base: 3000000, bonus: 100000, stock: 1200000, curr: 'INR' as const },
    { company: 'Amazon', industry: 'E-commerce', role: 'SDE III', level: 'SDE_III' as const, loc: 'Bengaluru', exp: 8, base: 6000000, bonus: 0, stock: 3000000, curr: 'INR' as const },
    { company: 'Amazon', industry: 'E-commerce', role: 'Principal SDE', level: 'PRINCIPAL' as const, loc: 'Seattle', exp: 15, base: 220000, bonus: 0, stock: 400000, curr: 'USD' as const }, // Edge case: Principal level

    // Meta
    { company: 'Meta', industry: 'Tech', role: 'E3', level: 'L3' as const, loc: 'London', exp: 1, base: 85000, bonus: 10000, stock: 30000, curr: 'USD' as const },
    { company: 'Meta', industry: 'Tech', role: 'E4', level: 'L4' as const, loc: 'London', exp: 4, base: 120000, bonus: 15000, stock: 45000, curr: 'USD' as const },
    { company: 'Meta', industry: 'Tech', role: 'E5', level: 'L5' as const, loc: 'New York', exp: 7, base: 180000, bonus: 25000, stock: 120000, curr: 'USD' as const },

    // Microsoft
    { company: 'Microsoft', industry: 'Tech', role: 'SDE', level: 'L59' as const, loc: 'Bengaluru', exp: 1, base: 1400000, bonus: 150000, stock: 300000, curr: 'INR' as const },
    { company: 'Microsoft', industry: 'Tech', role: 'SDE II', level: 'L61' as const, loc: 'Hyderabad', exp: 3, base: 2400000, bonus: 250000, stock: 600000, curr: 'INR' as const },
    { company: 'Microsoft', industry: 'Tech', role: 'Senior SDE', level: 'L63' as const, loc: 'Seattle', exp: 8, base: 160000, bonus: 30000, stock: 60000, curr: 'USD' as const },

    // NVIDIA
    { company: 'NVIDIA', industry: 'Hardware', role: 'IC1', level: 'IC1' as const, loc: 'Bengaluru', exp: 1, base: 1600000, bonus: 100000, stock: 800000, curr: 'INR' as const },
    { company: 'NVIDIA', industry: 'Hardware', role: 'IC2', level: 'IC2' as const, loc: 'Bengaluru', exp: 3, base: 2500000, bonus: 200000, stock: 1500000, curr: 'INR' as const },
    { company: 'NVIDIA', industry: 'Hardware', role: 'IC3', level: 'IC3' as const, loc: 'Santa Clara', exp: 6, base: 175000, bonus: 20000, stock: 180000, curr: 'USD' as const }, // High equity

    // Flipkart
    { company: 'Flipkart', industry: 'E-commerce', role: 'SDE I', level: 'SDE_I' as const, loc: 'Bengaluru', exp: 1, base: 1600000, bonus: 150000, stock: 300000, curr: 'INR' as const },
    { company: 'Flipkart', industry: 'E-commerce', role: 'SDE II', level: 'SDE_II' as const, loc: 'Bengaluru', exp: 3, base: 2800000, bonus: 250000, stock: 600000, curr: 'INR' as const },
    { company: 'Flipkart', industry: 'E-commerce', role: 'SDE III', level: 'SDE_III' as const, loc: 'Bengaluru', exp: 6, base: 4500000, bonus: 400000, stock: 1500000, curr: 'INR' as const },

    // Meesho
    { company: 'Meesho', industry: 'E-commerce', role: 'SDE I', level: 'SDE_I' as const, loc: 'Bengaluru', exp: 1, base: 1500000, bonus: 100000, stock: 200000, curr: 'INR' as const },
    { company: 'Meesho', industry: 'E-commerce', role: 'SDE II', level: 'SDE_II' as const, loc: 'Bengaluru', exp: 4, base: 3200000, bonus: 300000, stock: 800000, curr: 'INR' as const },
    { company: 'Meesho', industry: 'E-commerce', role: 'SDE III', level: 'SDE_III' as const, loc: 'Bengaluru', exp: 7, base: 4800000, bonus: 500000, stock: 1800000, curr: 'INR' as const },

    // Razorpay
    { company: 'Razorpay', industry: 'Fintech', role: 'SDE I', level: 'SDE_I' as const, loc: 'Bengaluru', exp: 1, base: 1400000, bonus: 100000, stock: 300000, curr: 'INR' as const },
    { company: 'Razorpay', industry: 'Fintech', role: 'SDE II', level: 'SDE_II' as const, loc: 'Bengaluru', exp: 3, base: 2600000, bonus: 200000, stock: 800000, curr: 'INR' as const },
    { company: 'Razorpay', industry: 'Fintech', role: 'Staff Engineer', level: 'STAFF' as const, loc: 'Bengaluru', exp: 9, base: 6000000, bonus: 800000, stock: 3000000, curr: 'INR' as const },

    // Zepto
    { company: 'Zepto', industry: 'Quick Commerce', role: 'SDE I', level: 'SDE_I' as const, loc: 'Mumbai', exp: 1, base: 1400000, bonus: 50000, stock: 200000, curr: 'INR' as const },
    { company: 'Zepto', industry: 'Quick Commerce', role: 'SDE II', level: 'SDE_II' as const, loc: 'Bengaluru', exp: 3, base: 2500000, bonus: 200000, stock: 600000, curr: 'INR' as const },

    // TCS
    { company: 'TCS', industry: 'IT', role: 'Assistant System Engineer', level: 'L1' as const, loc: 'Pune', exp: 0, base: 336000, bonus: 0, stock: 0, curr: 'INR' as const }, // Edge case: zero stock and bonus
    { company: 'Tata Consultancy Services', industry: 'IT', role: 'System Engineer', level: 'L2' as const, loc: 'Mumbai', exp: 2, base: 450000, bonus: 25000, stock: 0, curr: 'INR' as const },
    { company: 'TCS', industry: 'IT', role: 'IT Analyst', level: 'IC3' as const, loc: 'Bengaluru', exp: 5, base: 850000, bonus: 50000, stock: 0, curr: 'INR' as const },

    // Infosys
    { company: 'Infosys', industry: 'IT', role: 'Systems Engineer', level: 'L1' as const, loc: 'Mysore', exp: 1, base: 360000, bonus: 0, stock: 0, curr: 'INR' as const },
    { company: 'Infosys', industry: 'IT', role: 'Senior Systems Engineer', level: 'L2' as const, loc: 'Bengaluru', exp: 3, base: 550000, bonus: 30000, stock: 0, curr: 'INR' as const },
    { company: 'Infosys', industry: 'IT', role: 'Technology Analyst', level: 'IC3' as const, loc: 'Pune', exp: 6, base: 900000, bonus: 60000, stock: 0, curr: 'INR' as const },

    // Wipro
    { company: 'Wipro', industry: 'IT', role: 'Project Engineer', level: 'L1' as const, loc: 'Bengaluru', exp: 1, base: 350000, bonus: 0, stock: 0, curr: 'INR' as const },
    { company: 'Wipro', industry: 'IT', role: 'Senior Project Engineer', level: 'L2' as const, loc: 'Hyderabad', exp: 3, base: 500000, bonus: 20000, stock: 0, curr: 'INR' as const },
  ]

  for (const s of rawSalaries) {
    const compId = await getOrCreateCompany(s.company, s.industry)
    await prisma.salary.create({
      data: {
        company_id: compId,
        role: s.role,
        level: s.level,
        location: s.loc,
        currency: s.curr,
        experience_years: s.exp,
        base_salary: s.base,
        bonus: s.bonus,
        stock: s.stock,
        total_compensation: s.base + s.bonus + s.stock,
        source: 'CONTRIBUTOR',
        confidence_score: 0.9,
      }
    })
  }

  console.log(`Seeded ${rawSalaries.length} records effectively!`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
