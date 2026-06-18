import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'

// Pydantic-style strict validation schema
const IngestSalarySchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  role: z.string().min(1, "Role is required"),
  level_standardized: z.enum([
    'L3', 'L4', 'L5', 'L6', 
    'SDE-I', 'SDE-II', 'SDE-III', 
    'Staff', 'Principal', 'IC4', 'IC5'
  ]),
  location: z.string().min(1, "Location is required"),
  currency: z.enum(['INR', 'USD', 'GBP', 'EUR']).default('INR'),
  experience_years: z.number().min(0, "Experience must be positive"),
  base_salary: z.number().positive("Base salary must be positive"),
  bonus: z.number().min(0).default(0),
  stock: z.number().min(0).default(0),
  source: z.enum(['CONTRIBUTOR', 'SCRAPED', 'AI_INFERRED']).default('CONTRIBUTOR'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Strict validation
    const result = IngestSalarySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      )
    }

    const data = result.data

    // Enforce data contract: TC is always computed server-side
    const computedTotalCompensation = data.base_salary + data.bonus + data.stock

    const record = await prisma.salary.create({
      data: {
        ...data,
        total_compensation: computedTotalCompensation,
        confidence_score: data.source === 'CONTRIBUTOR' ? 0.9 : 0.6,
        is_verified: false, // newly ingested are not verified by default
      }
    })

    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    console.error('Ingest Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
