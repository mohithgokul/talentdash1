import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'

const router = Router()

/**
 * GET /api/workplace-index/:company_id
 */
router.get('/:company_id', async (req: Request, res: Response) => {
  try {
    const { company_id } = req.params

    const index = await prisma.workplaceIndex.findUnique({
      where: { company_id },
      include: {
        company: { select: { name: true, slug: true, logo_url: true } }
      }
    })

    if (!index) return res.status(404).json({ error: 'Workplace index not found for this company' })

    return res.json(serializeBigInt(index))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * GET /api/workplace-index
 * Get top ranking companies
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const top = await prisma.workplaceIndex.findMany({
      orderBy: { overall_score: 'desc' },
      take: 20,
      include: {
        company: { select: { name: true, slug: true, logo_url: true } }
      }
    })

    return res.json(serializeBigInt(top))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
