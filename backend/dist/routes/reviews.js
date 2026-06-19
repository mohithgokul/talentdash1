"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * GET /api/reviews
 * Returns recent reviews, optionally filtered by company
 */
router.get('/', async (req, res) => {
    try {
        const { company_id, limit } = req.query;
        const take = limit ? parseInt(limit, 10) : 50;
        const where = company_id ? { company_id: company_id, is_verified: true } : { is_verified: true };
        const reviews = await db_1.prisma.review.findMany({
            where,
            orderBy: { submitted_at: 'desc' },
            take,
            include: {
                company: {
                    select: { name: true, slug: true, logo_url: true }
                }
            }
        });
        return res.json((0, serialize_1.serializeBigInt)(reviews));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * POST /api/reviews
 * Submit a new review
 */
router.post('/', async (req, res) => {
    try {
        const schema = zod_1.z.object({
            company_id: zod_1.z.string().uuid(),
            reviewer_role: zod_1.z.string(),
            reviewer_location: zod_1.z.string().optional(),
            overall_rating: zod_1.z.number().min(1).max(5),
            work_life_rating: zod_1.z.number().min(1).max(5),
            comp_rating: zod_1.z.number().min(1).max(5),
            culture_rating: zod_1.z.number().min(1).max(5),
            review_text: zod_1.z.string().min(10),
            pros: zod_1.z.string().optional(),
            cons: zod_1.z.string().optional()
        });
        const parsed = schema.parse(req.body);
        const review = await db_1.prisma.review.create({
            data: parsed
        });
        return res.status(201).json((0, serialize_1.serializeBigInt)(review));
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=reviews.js.map