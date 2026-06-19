import { Router, Request, Response } from 'express'

const router = Router()

/**
 * POST /api/tools/take-home
 * Mock endpoint for calculating take-home pay
 */
router.post('/take-home', (req: Request, res: Response) => {
  try {
    const { base_salary, currency, location } = req.body
    
    // Simple mock calculation: approx 30% tax rate
    const taxRate = 0.30
    const takeHome = Math.floor(Number(base_salary) * (1 - taxRate))

    return res.json({
      currency,
      gross: base_salary,
      net_take_home: takeHome,
      tax_deduction: Math.floor(Number(base_salary) * taxRate)
    })
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

/**
 * POST /api/tools/espp
 * Mock endpoint for ESPP modeling
 */
router.post('/espp', (req: Request, res: Response) => {
  try {
    const { base_salary, contribution_pct, discount_pct } = req.body
    
    const contribution = Number(base_salary) * (Number(contribution_pct) / 100)
    const projectedGain = contribution * (Number(discount_pct) / 100)

    return res.json({
      annual_contribution: contribution,
      projected_gain: projectedGain
    })
  } catch (err: any) {
    return res.status(400).json({ error: err.message })
  }
})

export default router
