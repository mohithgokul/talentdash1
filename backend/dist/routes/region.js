"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const router = (0, express_1.Router)();
/**
 * GET /api/region/:region/salaries
 */
router.get('/:region/salaries', async (req, res) => {
    try {
        const { region } = req.params;
        const { limit } = req.query;
        const take = limit ? parseInt(limit, 10) : 50;
        // Region mapping to broad locations
        const regionLocationMap = {
            'india': ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi'],
            'us': ['San Francisco', 'New York', 'Seattle', 'Austin'],
            'global': [] // No filter
        };
        const locations = regionLocationMap[region.toLowerCase()] || [];
        const where = { is_verified: true };
        if (locations.length > 0) {
            where.location = { in: locations };
        }
        const salaries = await db_1.prisma.salary.findMany({
            where,
            orderBy: { submitted_at: 'desc' },
            take,
            include: {
                company: { select: { name: true, slug: true, logo_url: true } }
            }
        });
        return res.json((0, serialize_1.serializeBigInt)(salaries));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=region.js.map