"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/**
 * GET /api/interviews
 */
router.get('/', async (req, res) => {
    try {
        const { company_id, role, limit } = req.query;
        const take = limit ? parseInt(limit, 10) : 50;
        const where = { is_verified: true };
        if (company_id)
            where.company_id = company_id;
        if (role)
            where.role = role;
        const interviews = await db_1.prisma.interview.findMany({
            where,
            orderBy: { submitted_at: 'desc' },
            take,
            include: {
                company: {
                    select: { name: true, slug: true }
                }
            }
        });
        return res.json((0, serialize_1.serializeBigInt)(interviews));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * POST /api/interviews
 */
router.post('/', async (req, res) => {
    try {
        const schema = zod_1.z.object({
            company_id: zod_1.z.string().uuid(),
            role: zod_1.z.string(),
            difficulty: zod_1.z.nativeEnum(client_1.Difficulty),
            question_text: zod_1.z.string().min(5),
            skill_tags: zod_1.z.array(zod_1.z.string()).default([])
        });
        const parsed = schema.parse(req.body);
        const interview = await db_1.prisma.interview.create({
            data: parsed
        });
        return res.status(201).json((0, serialize_1.serializeBigInt)(interview));
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=interviews.js.map