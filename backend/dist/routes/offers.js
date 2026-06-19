"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/**
 * GET /api/offers
 */
router.get('/', async (req, res) => {
    try {
        const { company_name, limit } = req.query;
        const take = limit ? parseInt(limit, 10) : 50;
        const where = {};
        if (company_name)
            where.company_name = company_name;
        const offers = await db_1.prisma.offer.findMany({
            where,
            orderBy: { created_at: 'desc' },
            take
        });
        return res.json((0, serialize_1.serializeBigInt)(offers));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * POST /api/offers
 */
router.post('/', async (req, res) => {
    try {
        const schema = zod_1.z.object({
            company_name: zod_1.z.string(),
            role: zod_1.z.string(),
            level: zod_1.z.nativeEnum(client_1.Level),
            location: zod_1.z.string(),
            currency: zod_1.z.nativeEnum(client_1.Currency).default('INR'),
            base_salary: zod_1.z.number().positive(),
            bonus: zod_1.z.number().nonnegative().default(0),
            stock: zod_1.z.number().nonnegative().default(0),
            benefits_text: zod_1.z.string().optional()
        });
        const parsed = schema.parse(req.body);
        // Evaluate the offer score
        const total_compensation = BigInt(parsed.base_salary) + BigInt(parsed.bonus) + BigInt(parsed.stock);
        // In a real app we'd compare to market median to generate score and benchmarks
        const offer_score = 75; // Mock
        const base_benchmark = "Average";
        const offer = await db_1.prisma.offer.create({
            data: {
                ...parsed,
                base_salary: BigInt(parsed.base_salary),
                bonus: BigInt(parsed.bonus),
                stock: BigInt(parsed.stock),
                total_compensation,
                offer_score,
                base_benchmark
            }
        });
        return res.status(201).json((0, serialize_1.serializeBigInt)(offer));
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=offers.js.map