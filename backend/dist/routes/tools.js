"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * POST /api/tools/take-home
 * Mock endpoint for calculating take-home pay
 */
router.post('/take-home', (req, res) => {
    try {
        const { base_salary, currency, location } = req.body;
        // Simple mock calculation: approx 30% tax rate
        const taxRate = 0.30;
        const takeHome = Math.floor(Number(base_salary) * (1 - taxRate));
        return res.json({
            currency,
            gross: base_salary,
            net_take_home: takeHome,
            tax_deduction: Math.floor(Number(base_salary) * taxRate)
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
/**
 * POST /api/tools/espp
 * Mock endpoint for ESPP modeling
 */
router.post('/espp', (req, res) => {
    try {
        const { base_salary, contribution_pct, discount_pct } = req.body;
        const contribution = Number(base_salary) * (Number(contribution_pct) / 100);
        const projectedGain = contribution * (Number(discount_pct) / 100);
        return res.json({
            annual_contribution: contribution,
            projected_gain: projectedGain
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=tools.js.map