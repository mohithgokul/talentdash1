import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { z } from 'zod'
import { Level, Currency } from '@prisma/client'

const router = Router()

/**
 * GET /api/offers
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { company_name, limit } = req.query
    const take = limit ? parseInt(limit as string, 10) : 50

    const where: any = {}
    if (company_name) where.company_name = company_name as string

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take
    })

    return res.json(serializeBigInt(offers))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/offers
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      company_name: z.string(),
      role: z.string(),
      level: z.nativeEnum(Level),
      location: z.string(),
      currency: z.nativeEnum(Currency).default('INR'),
      base_salary: z.number().positive(),
      bonus: z.number().nonnegative().default(0),
      stock: z.number().nonnegative().default(0),
      benefits_text: z.string().optional()
    })

    const parsed = schema.parse(req.body)
    
    // Evaluate the offer score
    const total_compensation = BigInt(parsed.base_salary) + BigInt(parsed.bonus) + BigInt(parsed.stock)
    
    // In a real app we'd compare to market median to generate score and benchmarks
    const offer_score = 75 // Mock
    const base_benchmark = "Average"

    const offer = await prisma.offer.create({
      data: {
        ...parsed,
        base_salary: BigInt(parsed.base_salary),
        bonus: BigInt(parsed.bonus),
        stock: BigInt(parsed.stock),
        total_compensation,
        offer_score,
        base_benchmark
      }
    })

    return res.status(201).json(serializeBigInt(offer))
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
