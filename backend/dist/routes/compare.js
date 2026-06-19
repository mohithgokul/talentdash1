"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const serialize_1 = require("../lib/serialize");
const router = (0, express_1.Router)();
/**
 * GET /api/compare?s1=<uuid>&s2=<uuid>
 * Returns two salary records with field-by-field deltas.
 */
router.get('/', async (req, res) => {
    try {
        const s1 = req.query.s1;
        const s2 = req.query.s2;
        if (!s1 || !s2) {
            return res.status(400).json({ error: true, message: 'Missing s1 or s2 parameters' });
        }
        if (s1 === s2) {
            return res.status(400).json({ error: true, message: 'Cannot compare a record to itself' });
        }
        const [record1, record2] = await Promise.all([
            db_1.prisma.salary.findUnique({ where: { id: s1 }, include: { company: true } }),
            db_1.prisma.salary.findUnique({ where: { id: s2 }, include: { company: true } })
        ]);
        if (!record1 || !record2) {
            return res.status(404).json({ error: true, message: 'One or both salary records not found' });
        }
        const delta = {
            base_delta: (record1.base_salary - record2.base_salary).toString(),
            bonus_delta: (record1.bonus - record2.bonus).toString(),
            stock_delta: (record1.stock - record2.stock).toString(),
            tc_delta: (record1.total_compensation - record2.total_compensation).toString(),
            experience_delta: record1.experience_years - record2.experience_years
        };
        return res.status(200).json({
            record1: (0, serialize_1.serializeBigInt)(record1),
            record2: (0, serialize_1.serializeBigInt)(record2),
            delta
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: true, message });
    }
});
exports.default = router;
//# sourceMappingURL=compare.js.map