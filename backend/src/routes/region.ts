import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'

const router = Router()

/**
 * GET /api/region/:region/salaries
 */
router.get('/:region/salaries', async (req: Request, res: Response) => {
  try {
    const { region } = req.params
    const { limit } = req.query
    const take = limit ? parseInt(limit as string, 10) : 50

    // Region mapping to broad locations
    const regionLocationMap: Record<string, string[]> = {
      'india': ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi'],
      'us': ['San Francisco', 'New York', 'Seattle', 'Austin'],
      'global': [] // No filter
    }

    const locations = regionLocationMap[region.toLowerCase()] || []

    const where: any = { is_verified: true }
    if (locations.length > 0) {
      where.location = { in: locations }
    }

    const salaries = await prisma.salary.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      take,
      include: {
        company: { select: { name: true, slug: true, logo_url: true } }
      }
    })

    return res.json(serializeBigInt(salaries))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

export default router
