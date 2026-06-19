import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SALARIES } from "../lib/mock-data";
import { convert, formatMoney } from "../lib/format";
import { LevelBadge } from "../components/ui/LevelBadge";
import { Reveal } from "../components/ui/Reveal";
import type { SalaryRecord } from "../types/salary";

const searchSchema = z.object({
  a: fallback(z.string().optional(), undefined),
  b: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/compare")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Compare Offers — TalentDash" },
      { name: "description", content: "Compare two tech compensation records side by side: base, bonus, stock, and total comp deltas." },
      { property: "og:title", content: "Compare Offers — TalentDash" },
      { property: "og:description", content: "Compare two tech compensation records side by side." },
      { property: "og:url", content: "/compare" },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { a, b } = Route.useSearch();
  const recordA = SALARIES.find((r) => r.id === a) ?? SALARIES[0];
  const recordB = SALARIES.find((r) => r.id === b) ?? SALARIES[1];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">Compare offers</h1>
      </Reveal>
      <Reveal delay={60}>
        <p className="mt-2 max-w-2xl text-[15px] text-[#484848]">
          Pick any two records to see a field-by-field breakdown with deltas.
        </p>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Reveal delay={80}><RecordPicker side="a" current={recordA.id} /></Reveal>
        <Reveal delay={120}><RecordPicker side="b" current={recordB.id} /></Reveal>
      </div>

      <div className="mt-6">
        <Reveal delay={160}>
          <CompareTable a={recordA} b={recordB} />
        </Reveal>
      </div>
    </div>
  );
}

function RecordPicker({ side, current }: { side: "a" | "b"; current: string }) {
  const navigate = useNavigate({ from: "/compare" });
  return (
    <div className="rounded-md border border-[#EBEBEB] bg-white p-4">
      <label className="block text-[12px] font-medium uppercase tracking-wider text-[#717171]">
        Record {side.toUpperCase()}
      </label>
      <select
        value={current}
        onChange={(e) =>
          navigate({
            search: (prev: Record<string, unknown>) => ({ ...prev, [side]: e.target.value }),
          })
        }
        className="mt-2 w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[14px] text-[#222222] focus:border-[#FF5A5F] focus:outline-none"
      >
        {SALARIES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.company} · {r.role} · {r.level_standardized} · {r.location}
          </option>
        ))}
      </select>
    </div>
  );
}

function CompareTable({ a, b }: { a: SalaryRecord; b: SalaryRecord }) {
  // Normalize both into USD for fair comparison
  const cur = "USD" as const;
  const baseA = convert(a.base_salary, a.currency, cur);
  const baseB = convert(b.base_salary, b.currency, cur);
  const bonusA = a.bonus ? convert(a.bonus, a.currency, cur) : 0;
  const bonusB = b.bonus ? convert(b.bonus, b.currency, cur) : 0;
  const stockA = a.stock ? convert(a.stock, a.currency, cur) : 0;
  const stockB = b.stock ? convert(b.stock, b.currency, cur) : 0;
  const tcA = convert(a.total_compensation, a.currency, cur);
  const tcB = convert(b.total_compensation, b.currency, cur);
  const winner: "a" | "b" | null = tcA === tcB ? null : tcA > tcB ? "a" : "b";

  const rows: Array<{ label: string; aVal: string; bVal: string; numA?: number; numB?: number }> = [
    { label: "Company", aVal: a.company, bVal: b.company },
    { label: "Role", aVal: a.role, bVal: b.role },
    { label: "Level", aVal: a.level_standardized, bVal: b.level_standardized },
    { label: "Location", aVal: a.location, bVal: b.location },
    { label: "Experience", aVal: `${a.experience_years} yr`, bVal: `${b.experience_years} yr`, numA: a.experience_years, numB: b.experience_years },
    { label: "Base", aVal: formatMoney(baseA, cur), bVal: formatMoney(baseB, cur), numA: baseA, numB: baseB },
    { label: "Bonus", aVal: a.bonus ? formatMoney(bonusA, cur) : "—", bVal: b.bonus ? formatMoney(bonusB, cur) : "—", numA: bonusA, numB: bonusB },
    { label: "Stock", aVal: a.stock ? formatMoney(stockA, cur) : "—", bVal: b.stock ? formatMoney(stockB, cur) : "—", numA: stockA, numB: stockB },
    { label: "Total Comp", aVal: formatMoney(tcA, cur), bVal: formatMoney(tcB, cur), numA: tcA, numB: tcB },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-[#EBEBEB] bg-white">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-[12px] uppercase tracking-wide text-[#717171]">
            <th className="px-4 py-3 font-medium">Field</th>
            <th className="px-4 py-3 font-medium">
              Record A
              {winner === "a" && (
                <span className="ml-2 rounded px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: "#0369A1" }}>Higher TC</span>
              )}
            </th>
            <th className="px-4 py-3 font-medium">
              Record B
              {winner === "b" && (
                <span className="ml-2 rounded px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: "#0369A1" }}>Higher TC</span>
              )}
            </th>
            <th className="px-4 py-3 font-medium text-right">Δ (B − A)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isLevel = row.label === "Level";
            const isTC = row.label === "Total Comp";
            const hasDelta = row.numA !== undefined && row.numB !== undefined;
            const delta = hasDelta ? (row.numB! - row.numA!) : 0;
            const deltaColor = delta > 0 ? "#008A05" : delta < 0 ? "#D93025" : "#717171";
            const deltaStr = !hasDelta
              ? "—"
              : row.label === "Experience"
                ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)} yr`
                : `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${formatMoney(Math.abs(delta), cur)}`;
            return (
              <tr key={i} className="border-b border-[#EBEBEB] last:border-0 hover:bg-[#F2F2F2]">
                <td className="px-4 py-3 text-[12px] font-medium uppercase tracking-wide text-[#717171]">{row.label}</td>
                <td className="px-4 py-3">
                  {isLevel ? <LevelBadge level={a.level_standardized} /> : (
                    <span className={isTC ? "font-bold tabular-nums" : ""} style={isTC ? { color: "#0369A1", fontSize: "20px" } : { color: "#222222" }}>
                      {row.aVal}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isLevel ? <LevelBadge level={b.level_standardized} /> : (
                    <span className={isTC ? "font-bold tabular-nums" : ""} style={isTC ? { color: "#0369A1", fontSize: "20px" } : { color: "#222222" }}>
                      {row.bVal}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium" style={{ color: deltaColor }}>
                  {deltaStr}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="border-t border-[#EBEBEB] bg-[#FAFAFA] px-4 py-2 text-[12px] text-[#717171]">
        Deltas computed in USD for parity across currencies.
      </div>
    </div>
  );
}
