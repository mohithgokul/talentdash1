import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'
import { z } from 'zod'
import { Difficulty } from '@prisma/client'

const router = Router()

/**
 * GET /api/interviews
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { company_id, role, limit } = req.query
    const take = limit ? parseInt(limit as string, 10) : 50

    const where: any = { is_verified: true }
    if (company_id) where.company_id = company_id as string
    if (role) where.role = role as string

    const interviews = await prisma.interview.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
      take,
      include: {
        company: {
          select: { name: true, slug: true }
        }
      }
    })

    return res.json(serializeBigInt(interviews))
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * POST /api/interviews
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      company_id: z.string().uuid(),
      role: z.string(),
      difficulty: z.nativeEnum(Difficulty),
      question_text: z.string().min(5),
      skill_tags: z.array(z.string()).default([])
    })

    const parsed = schema.parse(req.body)

    const interview = await prisma.interview.create({
      data: parsed
    })

    return res.status(201).json(serializeBigInt(interview))
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
