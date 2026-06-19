import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { Level, Currency, SalarySource } from '@prisma/client'

const router = Router()

const salarySchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  level: z.nativeEnum(Level, { 
    errorMap: () => ({ message: 'Level must be one of: L1, L2, L3, L4, L5, Staff, Principal, IC4, IC5' }) 
  }),
  location: z.string().min(1, 'Location is required'),
  currency: z.nativeEnum(Currency).default('INR'),
  experience_years: z.number().int().min(0, 'Experience must not be negative').max(50),
  base_salary: z.number().positive('Base salary must be > 0'),
  bonus: z.number().nonnegative().optional().default(0),
  stock: z.number().nonnegative().optional().default(0),
  source: z.nativeEnum(SalarySource).default('CONTRIBUTOR'),
  confidence_score: z.number().min(0.0).max(1.0).default(0.5)
})

type SalaryInput = z.infer<typeof salarySchema>

/**
 * POST /api/ingest-salary
 * Validates, normalises, deduplicates, computes TC, and stores a salary record.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // 1. Validation
    const parsed = salarySchema.safeParse(req.body)
    if (!parsed.success) {
      const error = parsed.error.errors[0]
      return res.status(400).json({ error: true, field: error.path[0], message: error.message })
    }

    const data = parsed.data as SalaryInput

    // 2. Normalisation
    const normalized_name = data.company.toLowerCase().trim().replace(/[^\w\s]/g, '')
    const slug = normalized_name.replace(/\s+/g, '-')

    let company = await prisma.company.findFirst({ where: { normalized_name } })
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: data.company.trim(),
          slug,
          normalized_name,
          industry: 'Unknown',
          headquarters: 'Unknown',
          headcount_range: 'Unknown',
          founded_year: new Date().getFullYear(),
        }
      })
    }

    // 3. Recompute total_compensation server-side
    const total_compensation = BigInt(data.base_salary) + BigInt(data.bonus) + BigInt(data.stock)

    // 4. Duplicate check (within 48 hours, within 10% base salary)
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const existing = await prisma.salary.findFirst({
      where: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        submitted_at: { gte: fortyEightHoursAgo }
      }
    })

    if (existing) {
      const baseDiff = Math.abs(Number(existing.base_salary) - data.base_salary)
      if (baseDiff <= data.base_salary * 0.10) {
        return res.status(409).json({ error: true, message: 'Conflict: A similar salary record was submitted recently.' })
      }
    }

    // 5. Store
    const newSalary = await prisma.salary.create({
      data: {
        company_id: company.id,
        role: data.role,
        level: data.level,
        location: data.location,
        currency: data.currency,
        experience_years: data.experience_years,
        base_salary: BigInt(data.base_salary),
        bonus: BigInt(data.bonus),
        stock: BigInt(data.stock),
        total_compensation,
        source: data.source,
        confidence_score: data.confidence_score,
      }
    })

    return res.status(201).json(serializeBigInt(newSalary))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: true, message })
  }
})

export default router
