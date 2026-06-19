import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { serializeBigInt } from '../lib/serialize'

const router = Router()

/**
 * GET /api/companies
 * Returns list of all companies
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' }
    })
    return res.status(200).json(serializeBigInt(companies))
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: true, message })
  }
})

/**
 * GET /api/companies/:slug
 * Returns company profile, all salary records, median TC, and level distribution.
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const company = await prisma.company.findUnique({ where: { slug } })
    if (!company) {
      return res.status(404).json({ error: true, message: 'Company not found' })
    }

    const salaries = await prisma.salary.findMany({
      where: { company_id: company.id },
      orderBy: { total_compensation: 'desc' }
    })

    // Level distribution
    const level_distribution: Record<string, number> = {}
    for (const s of salaries) {
      level_distribution[s.level] = (level_distribution[s.level] || 0) + 1
    }

    // True median total_compensation
    let median_total_compensation: string | null = null
    if (salaries.length > 0) {
      const sortedTcs = salaries.map(s => s.total_compensation)
      const mid = Math.floor(sortedTcs.length / 2)
      if (sortedTcs.length % 2 === 0) {
        median_total_compensation = ((sortedTcs[mid - 1] + sortedTcs[mid]) / BigInt(2)).toString()
      } else {
        median_total_compensation = sortedTcs[mid].toString()
      }
    }

    return res.status(200)
      .set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      .json({
        company: serializeBigInt(company),
        salaries: serializeBigInt(salaries),
        median_total_compensation,
        level_distribution
      })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: true, message })
  }
})

export default router
