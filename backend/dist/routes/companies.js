"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const router = (0, express_1.Router)();
/**
 * GET /api/companies
 * Returns list of all companies
 */
router.get('/', async (req, res) => {
    try {
        const companies = await db_1.prisma.company.findMany({
            orderBy: { name: 'asc' }
        });
        return res.status(200).json((0, serialize_1.serializeBigInt)(companies));
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: true, message });
    }
});
/**
 * GET /api/companies/:slug
 * Returns company profile, all salary records, median TC, and level distribution.
 */
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const company = await db_1.prisma.company.findUnique({
            where: { slug },
            include: { workplace_index: true }
        });
        if (!company) {
            return res.status(404).json({ error: true, message: 'Company not found' });
        }
        const salaries = await db_1.prisma.salary.findMany({
            where: { company_id: company.id },
            orderBy: { total_compensation: 'desc' }
        });
        // Level distribution
        const level_distribution = {};
        for (const s of salaries) {
            level_distribution[s.level] = (level_distribution[s.level] || 0) + 1;
        }
        // True median total_compensation
        let median_total_compensation = null;
        if (salaries.length > 0) {
            const sortedTcs = salaries.map(s => s.total_compensation);
            const mid = Math.floor(sortedTcs.length / 2);
            if (sortedTcs.length % 2 === 0) {
                median_total_compensation = ((sortedTcs[mid - 1] + sortedTcs[mid]) / BigInt(2)).toString();
            }
            else {
                median_total_compensation = sortedTcs[mid].toString();
            }
        }
        return res.status(200)
            .set('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
            .json({
            company: (0, serialize_1.serializeBigInt)(company),
            salaries: (0, serialize_1.serializeBigInt)(salaries),
            median_total_compensation,
            level_distribution
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: true, message });
    }
});
exports.default = router;
//# sourceMappingURL=companies.js.map