import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import salariesRouter from './routes/salaries'
import ingestSalaryRouter from './routes/ingest-salary'
import companiesRouter from './routes/companies'
import compareRouter from './routes/compare'

const app = express()
const PORT = process.env.PORT || 4000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // Allow all origins for local dev flexibility
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/salaries', salariesRouter)
app.use('/api/ingest-salary', ingestSalaryRouter)
app.use('/api/companies', companiesRouter)
app.use('/api/compare', compareRouter)

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 TalentDash API running on http://localhost:${PORT}`)
  console.log(`   CORS allowed for: ${FRONTEND_URL}`)
})

export default app
