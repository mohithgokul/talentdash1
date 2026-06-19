import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { z } from 'zod'

const router = Router()

/**
 * POST /api/search
 * Universal search across companies, roles, discussions
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      query: z.string().min(1)
    })

    const { query } = schema.parse(req.body)

    const [companies, discussions] = await Promise.all([
      prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { normalized_name: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5,
        select: { id: true, name: true, slug: true, industry: true }
      }),
      prisma.discussion.findMany({
        where: {
          topic: { contains: query, mode: 'insensitive' }
        },
        take: 5,
        select: { id: true, topic: true, tag: true, view_count: true }
      })
    ])

    return res.json({ companies, discussions })
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
