import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '25')
  const sort = searchParams.get('sort') || 'tc_desc'
  
  const skip = (page - 1) * limit
  
  let orderBy: any = { total_compensation: 'desc' }
  switch (sort) {
    case 'tc_asc':    orderBy = { total_compensation: 'asc' }; break;
    case 'base_desc': orderBy = { base_salary: 'desc' }; break;
    case 'base_asc':  orderBy = { base_salary: 'asc' }; break;
    case 'exp_desc':  orderBy = { experience_years: 'desc' }; break;
    case 'exp_asc':   orderBy = { experience_years: 'asc' }; break;
    case 'date_desc': orderBy = { createdAt: 'desc' }; break;
  }

  // Optional filters
  const company = searchParams.get('company')
  const role = searchParams.get('role')
  const location = searchParams.get('location')
  const levels = searchParams.get('levels')

  const where: any = {}
  if (company) where.company = { name: { contains: company, mode: 'insensitive' } }
  if (role) where.role = role
  if (location) where.location = location
  if (levels) where.level_standardized = { in: levels.split(',') }

  try {
    const [total, records] = await Promise.all([
      prisma.salary.count({ where }),
      prisma.salary.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { company: true },
      })
    ])

    return NextResponse.json({
      data: records.map((r: any) => ({
        ...r,
        company: r.company.name,
        company_slug: r.company.slug,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
