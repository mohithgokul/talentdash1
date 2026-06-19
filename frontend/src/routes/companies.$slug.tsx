import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchCompanyData } from "../lib/api";
import { convert, formatMoney, levelColor } from "../lib/format";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/companies/$slug")({
  loader: async ({ params }) => {
    try {
      const data = await fetchCompanyData(params.slug);
      if (!data || data.error) throw notFound();
      return data;
    } catch {
      throw notFound();
    }
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.company?.name ?? params.slug;
    return {
      meta: [
        { title: `${name} Salaries & Insights — TalentDash` },
        { name: "description", content: `View salary data, level distribution, and verified compensation records for ${name}.` }
      ]
    };
  },
  component: CompanyPage,
});

function Stat({ label, value, highlight }: { label: string; value: string | React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-md border p-4 ${highlight ? "border-[#FF5A5F] bg-[#FFF8F8]" : "border-[#EBEBEB] bg-white"}`}>
      <div className="text-[12px] font-semibold uppercase tracking-wider text-[#717171]">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${highlight ? "text-[#FF5A5F]" : "text-[#222222]"}`}>{value}</div>
    </div>
  );
}

function CompanyPage() {
  const { company, salaries, median_total_compensation, level_distribution } = Route.useLoaderData();
  
  const records = salaries || [];
  const displayCurrency = "USD";
  const tcs = records.map((r: any) => convert(r.total_compensation, r.currency, displayCurrency)).sort((a: number, b: number) => a - b);
  
  const min = tcs[0] ?? 0;
  const max = tcs[tcs.length - 1] ?? 0;
  
  const levelEntries = Object.entries(level_distribution || {}).sort((a: any, b: any) => b[1] - a[1]);
  const totalForBar = records.length || 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link to="/companies" className="text-[13px] font-medium text-[#717171] hover:text-[#222222]">
        ← Back to companies
      </Link>

      <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
        <Reveal>
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[#EBEBEB] bg-white text-3xl font-bold text-[#222222] shadow-sm">
            {company.name.slice(0, 1)}
          </div>
        </Reveal>
        <div className="flex-1">
          <Reveal delay={40}>
            <h1 className="text-4xl font-bold text-[#222222]">{company.name}</h1>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[14px] text-[#717171]">
              <span>{company.industry}</span>
              <span>•</span>
              <span>{company.headquarters}</span>
              <span>•</span>
              <span>{company.headcount_range} employees</span>
              {company.workplace_index && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-[#FF5A5F]">
                    ★ {company.workplace_index.overall_score} Workplace Score
                  </span>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Reveal delay={120}>
          <Stat 
            label="Median Total Comp" 
            value={median_total_compensation ? formatMoney(convert(median_total_compensation, "INR", displayCurrency), displayCurrency) : "—"} 
            highlight 
          />
        </Reveal>
        <Reveal delay={160}>
          <Stat label="TC Range" value={`${formatMoney(min, displayCurrency)} — ${formatMoney(max, displayCurrency)}`} />
        </Reveal>
        <Reveal delay={200}>
          <Stat label="Verified Records" value={records.length} />
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal delay={240}>
            <h2 className="text-xl font-bold text-[#222222]">Level Distribution</h2>
            <div className="mt-4 rounded-md border border-[#EBEBEB] bg-white p-5">
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-[#F2F2F2]">
                {levelEntries.map(([lvl, count]) => {
                  const c = levelColor(lvl as never);
                  const pct = (Number(count) / totalForBar) * 100;
                  return <div key={lvl} title={`${lvl}: ${count}`} style={{ width: `${pct}%`, background: c.text }} />;
                })}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {levelEntries.map(([lvl, count]) => {
                  const c = levelColor(lvl as never);
                  const pct = Math.round((Number(count) / totalForBar) * 100);
                  return (
                    <div key={lvl} className="flex items-center gap-2 text-[14px] text-[#484848]">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ background: c.text }} />
                      <span className="font-medium">{lvl}</span>
                      <span className="text-[#717171]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {company.workplace_index && (
          <div>
            <Reveal delay={280}>
              <h2 className="text-xl font-bold text-[#222222]">Workplace Index</h2>
              <div className="mt-4 space-y-4 rounded-md border border-[#EBEBEB] bg-white p-5">
                {[
                  { label: "Compensation", score: company.workplace_index.compensation_score },
                  { label: "Culture", score: company.workplace_index.culture_score },
                  { label: "Growth", score: company.workplace_index.growth_score },
                  { label: "Work/Life Balance", score: company.workplace_index.wlb_score },
                ].map(item => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-[13px] font-medium text-[#484848]">
                      <span>{item.label}</span>
                      <span>{item.score} / 5.0</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F2F2F2]">
                      <div className="h-full bg-[#0369A1]" style={{ width: `${(Number(item.score) / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Reveal delay={320}>
          <h2 className="text-xl font-bold text-[#222222]">Recent Verified Salaries</h2>
          {/* Using raw table for simplicity instead of SalaryTable to avoid massive dependency chain context missing */}
          <div className="mt-4 overflow-hidden rounded-md border border-[#EBEBEB] bg-white">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#F7F7F7] text-[12px] font-semibold uppercase tracking-wider text-[#717171]">
                <tr>
                  <th className="px-4 py-3">Role & Level</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Exp</th>
                  <th className="px-4 py-3 text-right">Total Comp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {records.slice(0, 10).map((r: any) => (
                  <tr key={r.id} className="hover:bg-[#FAFAFA]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#222222]">{r.role}</div>
                      <div className="mt-0.5 text-[12px] text-[#717171]">{r.level}</div>
                    </td>
                    <td className="px-4 py-3 text-[#484848]">{r.location}</td>
                    <td className="px-4 py-3 text-[#484848]">{r.experience_years}y</td>
                    <td className="px-4 py-3 text-right font-medium text-[#0369A1]">
                      {formatMoney(r.total_compensation, r.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
