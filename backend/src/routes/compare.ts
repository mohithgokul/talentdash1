import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'

const router = Router()

/**
 * GET /api/compare?s1=<uuid>&s2=<uuid>
 * Returns two salary records with field-by-field deltas.
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const s1 = req.query.s1 as string
    const s2 = req.query.s2 as string

    if (!s1 || !s2) {
      return res.status(400).json({ error: true, message: 'Missing s1 or s2 parameters' })
    }
    if (s1 === s2) {
      return res.status(400).json({ error: true, message: 'Cannot compare a record to itself' })
    }

    const [record1, record2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: s1 }, include: { company: true } }),
      prisma.salary.findUnique({ where: { id: s2 }, include: { company: true } })
    ])

    if (!record1 || !record2) {
      return res.status(404).json({ error: true, message: 'One or both salary records not found' })
    }

    const delta = {
      base_delta: (record1.base_salary - record2.base_salary).toString(),
      bonus_delta: (record1.bonus - record2.bonus).toString(),
      stock_delta: (record1.stock - record2.stock).toString(),
      tc_delta: (record1.total_compensation - record2.total_compensation).toString(),
      experience_delta: record1.experience_years - record2.experience_years
    }

    return res.status(200).json({
      record1: serializeBigInt(record1),
      record2: serializeBigInt(record2),
      delta
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: true, message })
  }
})

export default router
