"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const router = (0, express_1.Router)();
/**
 * GET /api/workplace-index/:company_id
 */
router.get('/:company_id', async (req, res) => {
    try {
        const { company_id } = req.params;
        const index = await db_1.prisma.workplaceIndex.findUnique({
            where: { company_id },
            include: {
                company: { select: { name: true, slug: true, logo_url: true } }
            }
        });
        if (!index)
            return res.status(404).json({ error: 'Workplace index not found for this company' });
        return res.json((0, serialize_1.serializeBigInt)(index));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * GET /api/workplace-index
 * Get top ranking companies
 */
router.get('/', async (req, res) => {
    try {
        const top = await db_1.prisma.workplaceIndex.findMany({
            orderBy: { overall_score: 'desc' },
            take: 20,
            include: {
                company: { select: { name: true, slug: true, logo_url: true } }
            }
        });
        return res.json((0, serialize_1.serializeBigInt)(top));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=workplace-index.js.map