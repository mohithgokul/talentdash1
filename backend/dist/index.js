"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const salaries_1 = __importDefault(require("./routes/salaries"));
const ingest_salary_1 = __importDefault(require("./routes/ingest-salary"));
const companies_1 = __importDefault(require("./routes/companies"));
const compare_1 = __importDefault(require("./routes/compare"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const interviews_1 = __importDefault(require("./routes/interviews"));
const discussions_1 = __importDefault(require("./routes/discussions"));
const offers_1 = __importDefault(require("./routes/offers"));
const workplace_index_1 = __importDefault(require("./routes/workplace-index"));
const tools_1 = __importDefault(require("./routes/tools"));
const search_1 = __importDefault(require("./routes/search"));
const region_1 = __importDefault(require("./routes/region"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// ─── Middleware ───────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for local dev flexibility
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/salaries', salaries_1.default);
app.use('/api/ingest-salary', ingest_salary_1.default);
app.use('/api/companies', companies_1.default);
app.use('/api/compare', compare_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/interviews', interviews_1.default);
app.use('/api/discussions', discussions_1.default);
app.use('/api/offers', offers_1.default);
app.use('/api/workplace-index', workplace_index_1.default);
app.use('/api/tools', tools_1.default);
app.use('/api/search', search_1.default);
app.use('/api/region', region_1.default);
// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: true, message: 'Route not found' });
});
// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 TalentDash API running on http://localhost:${PORT}`);
    console.log(`   CORS allowed for: ${FRONTEND_URL}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map