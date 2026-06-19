"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
/**
 * POST /api/search
 * Universal search across companies, roles, discussions
 */
router.post('/', async (req, res) => {
    try {
        const schema = zod_1.z.object({
            query: zod_1.z.string().min(1)
        });
        const { query } = schema.parse(req.body);
        const [companies, discussions] = await Promise.all([
            db_1.prisma.company.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { normalized_name: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                select: { id: true, name: true, slug: true, industry: true }
            }),
            db_1.prisma.discussion.findMany({
                where: {
                    topic: { contains: query, mode: 'insensitive' }
                },
                take: 5,
                select: { id: true, topic: true, tag: true, view_count: true }
            })
        ]);
        return res.json({ companies, discussions });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map