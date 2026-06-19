"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/**
 * GET /api/discussions
 */
router.get('/', async (req, res) => {
    try {
        const { tag, company_id, limit } = req.query;
        const take = limit ? parseInt(limit, 10) : 50;
        const where = {};
        if (company_id)
            where.company_id = company_id;
        if (tag)
            where.tag = tag;
        const discussions = await db_1.prisma.discussion.findMany({
            where,
            orderBy: [
                { is_pinned: 'desc' },
                { created_at: 'desc' }
            ],
            take,
            include: {
                company: {
                    select: { name: true, slug: true }
                }
            }
        });
        return res.json((0, serialize_1.serializeBigInt)(discussions));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * POST /api/discussions
 */
router.post('/', async (req, res) => {
    try {
        const schema = zod_1.z.object({
            topic: zod_1.z.string().min(5),
            body: zod_1.z.string().optional(),
            company_id: zod_1.z.string().uuid().optional(),
            community: zod_1.z.string().optional(),
            tag: zod_1.z.nativeEnum(client_1.DiscussionTag).default('NEW')
        });
        const parsed = schema.parse(req.body);
        const discussion = await db_1.prisma.discussion.create({
            data: parsed
        });
        return res.status(201).json((0, serialize_1.serializeBigInt)(discussion));
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=discussions.js.map