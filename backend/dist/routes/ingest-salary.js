"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const salarySchema = zod_1.z.object({
    company: zod_1.z.string().min(1, 'Company is required'),
    role: zod_1.z.string().min(1, 'Role is required'),
    level: zod_1.z.nativeEnum(client_1.Level, {
        errorMap: () => ({ message: 'Level must be one of: L1, L2, L3, L4, L5, Staff, Principal, IC4, IC5' })
    }),
    location: zod_1.z.string().min(1, 'Location is required'),
    currency: zod_1.z.nativeEnum(client_1.Currency).default('INR'),
    experience_years: zod_1.z.number().int().min(0, 'Experience must not be negative').max(50),
    base_salary: zod_1.z.number().positive('Base salary must be > 0'),
    bonus: zod_1.z.number().nonnegative().optional().default(0),
    stock: zod_1.z.number().nonnegative().optional().default(0),
    source: zod_1.z.nativeEnum(client_1.SalarySource).default('CONTRIBUTOR'),
    confidence_score: zod_1.z.number().min(0.0).max(1.0).default(0.5)
});
/**
 * POST /api/ingest-salary
 * Validates, normalises, deduplicates, computes TC, and stores a salary record.
 */
router.post('/', async (req, res) => {
    try {
        // 1. Validation
        const parsed = salarySchema.safeParse(req.body);
        if (!parsed.success) {
            const error = parsed.error.errors[0];
            return res.status(400).json({ error: true, field: error.path[0], message: error.message });
        }
        const data = parsed.data;
        // 2. Normalisation
        const normalized_name = data.company.toLowerCase().trim().replace(/[^\w\s]/g, '');
        const slug = normalized_name.replace(/\s+/g, '-');
        let company = await db_1.prisma.company.findFirst({ where: { normalized_name } });
        if (!company) {
            company = await db_1.prisma.company.create({
                data: {
                    name: data.company.trim(),
                    slug,
                    normalized_name,
                    industry: 'Unknown',
                    headquarters: 'Unknown',
                    headcount_range: 'Unknown',
                    founded_year: new Date().getFullYear(),
                }
            });
        }
        // 3. Recompute total_compensation server-side
        const total_compensation = BigInt(data.base_salary) + BigInt(data.bonus) + BigInt(data.stock);
        // 4. Duplicate check (within 48 hours, within 10% base salary)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const existing = await db_1.prisma.salary.findFirst({
            where: {
                company_id: company.id,
                role: data.role,
                level: data.level,
                location: data.location,
                submitted_at: { gte: fortyEightHoursAgo }
            }
        });
        if (existing) {
            const baseDiff = Math.abs(Number(existing.base_salary) - data.base_salary);
            if (baseDiff <= data.base_salary * 0.10) {
                return res.status(409).json({ error: true, message: 'Conflict: A similar salary record was submitted recently.' });
            }
        }
        // 5. Store
        const newSalary = await db_1.prisma.salary.create({
            data: {
                company_id: company.id,
                role: data.role,
                level: data.level,
                location: data.location,
                currency: data.currency,
                experience_years: data.experience_years,
                base_salary: BigInt(data.base_salary),
                bonus: BigInt(data.bonus),
                stock: BigInt(data.stock),
                total_compensation,
                source: data.source,
                confidence_score: data.confidence_score,
            }
        });
        return res.status(201).json((0, serialize_1.serializeBigInt)(newSalary));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: true, message });
    }
});
exports.default = router;
//# sourceMappingURL=ingest-salary.js.map