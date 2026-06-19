import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { z } from 'zod'

const router = Router()

/**
 * GET /api/reviews
 * Returns recent reviews, optionally filtered by company
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { company_id, limit } = req.query
    const take = limit ? parseInt(limit as string, 10) : 50

    const where = company_id ? { company_id: company_id as string, is_verified: true } : { is_verified: true }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      take,
      include: {
        company: {
          select: { name: true, slug: true, logo_url: true }
        }
      }
    })

    return res.json(serializeBigInt(reviews))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/reviews
 * Submit a new review
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      company_id: z.string().uuid(),
      reviewer_role: z.string(),
      reviewer_location: z.string().optional(),
      overall_rating: z.number().min(1).max(5),
      work_life_rating: z.number().min(1).max(5),
      comp_rating: z.number().min(1).max(5),
      culture_rating: z.number().min(1).max(5),
      review_text: z.string().min(10),
      pros: z.string().optional(),
      cons: z.string().optional()
    })

    const parsed = schema.parse(req.body)

    const review = await prisma.review.create({
      data: parsed
    })

    return res.status(201).json(serializeBigInt(review))
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
