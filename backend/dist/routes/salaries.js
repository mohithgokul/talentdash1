"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const router = (0, express_1.Router)();
/**
 * GET /api/salaries/heatmap
 * Geographic salary density visualization
 */
router.get('/heatmap', async (req, res) => {
    try {
        const data = await db_1.prisma.salary.groupBy({
            by: ['location'],
            _count: { _all: true },
            _avg: { total_compensation: true }
        });
        return res.json((0, serialize_1.serializeBigInt)(data));
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
/**
 * GET /api/salaries
 * Query params: company, role, level, location, currency, sort, page, limit
 */
router.get('/', async (req, res) => {
    try {
        let page = parseInt(req.query.page || '1', 10);
        if (isNaN(page) || page < 1)
            page = 1;
        let limit = parseInt(req.query.limit || '25', 10);
        if (isNaN(limit) || limit < 1)
            limit = 25;
        if (limit > 100)
            limit = 100;
        const company = req.query.company;
        const role = req.query.role;
        const level = req.query.level;
        const location = req.query.location;
        const currency = req.query.currency;
        const sort = req.query.sort || 'total_comp_desc';
        let orderBy = { total_compensation: 'desc' };
        if (sort === 'total_comp_asc')
            orderBy = { total_compensation: 'asc' };
        else if (sort === 'date_desc' || sort === 'recent')
            orderBy = { submitted_at: 'desc' };
        else if (sort === 'verified')
            orderBy = { is_verified: 'desc' };
        else if (sort === 'tc_desc')
            orderBy = { total_compensation: 'desc' };
        else if (sort === 'base_desc')
            orderBy = { base_salary: 'desc' };
        else if (sort === 'base_asc')
            orderBy = { base_salary: 'asc' };
        else if (sort === 'exp_desc')
            orderBy = { experience_years: 'desc' };
        else if (sort === 'exp_asc')
            orderBy = { experience_years: 'asc' };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = {};
        if (company)
            where.company = { name: { contains: company, mode: 'insensitive' } };
        if (role)
            where.role = { contains: role, mode: 'insensitive' };
        if (level)
            where.level = level;
        if (location)
            where.location = { contains: location, mode: 'insensitive' };
        if (currency)
            where.currency = currency;
        const [total, records] = await Promise.all([
            db_1.prisma.salary.count({ where }),
            db_1.prisma.salary.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: { company: true }
            })
        ]);
        return res.status(200)
            .set('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
            .json({
            data: (0, serialize_1.serializeBigInt)(records),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: true, message });
    }
});
exports.default = router;
//# sourceMappingURL=salaries.js.map