"use client";
import { Link } from "@tanstack/react-router";
import { Code2, Briefcase, BarChart3, Megaphone, PenTool, TrendingUp, Users } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { TOP_PAYING, TOP_ROLES_MEDIAN, SALARY_BY_EXP } from "../../lib/mock-data";
import { formatMoney } from "../../lib/format";

function roleIcon(role: string) {
  if (role.includes("Engineer")) return Code2;
  if (role.includes("Product Manager")) return Briefcase;
  if (role.includes("Data")) return BarChart3;
  if (role.includes("Marketing")) return Megaphone;
  return PenTool;
}

export function SalariesHub() {
  const maxExp = Math.max(...SALARY_BY_EXP.map((r) => r.usd));

  return (
    <section className="mt-2 space-y-12">
      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["12.8M+", "Salary data points"],
          ["35K+", "Companies"],
          ["900+", "Job titles"],
          ["18%", "YoY salary growth"],
          ["100%", "Verified & anonymous"],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 40}>
            <div className="rounded-md border border-[#EBEBEB] bg-white p-4">
              <div className="text-[22px] font-bold text-[#222222]">{v}</div>
              <div className="mt-1 text-[12px] text-[#717171]">{l}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Top paying companies */}
      <div>
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Top paying companies</h2></Reveal>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {TOP_PAYING.map((c, i) => (
            <Reveal key={c.slug} delay={i * 50}>
              <Link
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="block min-w-[220px] rounded-md border border-[#EBEBEB] bg-white p-5 hover:bg-[#F2F2F2]"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-[#F2F2F2] text-[12px] font-bold text-[#222222]">
                    {c.name.slice(0, 1)}
                  </span>
                  <span className="text-[14px] font-semibold text-[#222222]">{c.name}</span>
                </div>
                <div className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[#717171]">Avg. total comp</div>
                <div className="mt-1 text-[22px] font-bold text-[#0369A1] tabular-nums">{formatMoney(c.avg_usd, "USD")}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-[#008A05]">
                  <TrendingUp size={12} /> +{c.yoy}% vs last year
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Roles + Experience grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
          <h2 className="text-[16px] font-semibold text-[#222222]">Top roles by median total compensation</h2>
          <ul className="mt-4 divide-y divide-[#EBEBEB]">
            {TOP_ROLES_MEDIAN.map((r) => {
              const Icon = roleIcon(r.role);
              return (
                <li key={r.role} className="flex items-center gap-3 py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#F2F2F2] text-[#222222]">
                    <Icon size={14} />
                  </span>
                  <span className="flex-1 text-[14px] text-[#222222]">{r.role}</span>
                  <span className="text-[14px] font-bold text-[#222222] tabular-nums">{formatMoney(r.median_usd, "USD")}</span>
                  <span className="ml-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#008A05]">
                    <Sparkline /> +{r.yoy}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
          <h2 className="text-[16px] font-semibold text-[#222222]">Salary by experience</h2>
          <ul className="mt-4 space-y-3">
            {SALARY_BY_EXP.map((r) => {
              const pct = (r.usd / maxExp) * 100;
              return (
                <li key={r.bucket}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#484848]">{r.bucket}</span>
                    <span className="font-semibold text-[#222222] tabular-nums">{formatMoney(r.usd, "USD")}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-[#F2F2F2]">
                    <div className="h-2 rounded-full bg-[#FF5A5F]" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-md border-y border-[#EBEBEB] bg-[#F7F7F7] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="text-[16px] font-semibold text-[#222222]">Add your salary & unlock all insights</div>
            <p className="mt-1 text-[13px] text-[#484848]">
              Help thousands of professionals by sharing your salary anonymously.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-[12px] text-[#717171] md:flex">
              <div className="flex -space-x-1.5">
                {["#FF5A5F", "#0369A1", "#008A05", "#FFB400"].map((c, i) => (
                  <span key={i} className="inline-block h-5 w-5 rounded-full border-2 border-white" style={{ background: c }} />
                ))}
              </div>
              <Users size={12} /> Join 89K+ professionals contributing data
            </div>
            <button className="rounded-md bg-[#FF5A5F] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90">
              Add your salary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkline() {
  return (
    <svg width="28" height="10" viewBox="0 0 28 10" aria-hidden>
      <polyline points="0,8 5,6 10,7 15,4 20,5 24,2 28,3" fill="none" stroke="#008A05" strokeWidth="1.5" />
    </svg>
  );
}
