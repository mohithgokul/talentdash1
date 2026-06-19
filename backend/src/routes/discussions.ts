import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { z } from 'zod'
import { DiscussionTag } from '@prisma/client'

const router = Router()

/**
 * GET /api/discussions
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tag, company_id, limit } = req.query
    const take = limit ? parseInt(limit as string, 10) : 50

    const where: any = {}
    if (company_id) where.company_id = company_id as string
    if (tag) where.tag = tag as DiscussionTag

    const discussions = await prisma.discussion.findMany({
      where,
      orderBy: [
        { is_pinned: 'desc' },
        { created_at: 'desc' }
      ],
      take,
      include: {
        company: {
          select: { name: true, slug: true }
        }
      }
    })

    return res.json(serializeBigInt(discussions))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/discussions
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      topic: z.string().min(5),
      body: z.string().optional(),
      company_id: z.string().uuid().optional(),
      community: z.string().optional(),
      tag: z.nativeEnum(DiscussionTag).default('NEW')
    })

    const parsed = schema.parse(req.body)

    const discussion = await prisma.discussion.create({
      data: parsed
    })

    return res.status(201).json(serializeBigInt(discussion))
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
