import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCompanyMeta, SALARIES } from "../lib/mock-data";
import { convert, formatMoney, levelColor } from "../lib/format";
import { SalaryTable } from "../components/features/SalaryTable";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const meta = getCompanyMeta(params.slug);
    if (!meta) throw notFound();
    return { meta };
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.meta.name ?? params.slug;
    return {
      meta: [
        { title: `${name} salaries — TalentDash` },
        { name: "description", content: `Verified compensation data for ${name}: roles, levels, base, stock, and total comp.` },
        { property: "og:title", content: `${name} salaries — TalentDash` },
        { property: "og:description", content: `Verified compensation data for ${name}.` },
        { property: "og:url", content: `/companies/${params.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/companies/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${name} compensation records`,
            description: `Salary records for ${name}.`,
            creator: { "@type": "Organization", name: "TalentDash" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-[28px] font-bold text-[#222222]">Company not found</h1>
      <Link to="/salaries" className="mt-4 inline-block text-[#FF5A5F] hover:underline">Browse all salaries</Link>
    </div>
  ),
  component: CompanyPage,
});

function CompanyPage() {
  const { meta } = Route.useLoaderData();
  const records = SALARIES.filter((r) => r.company_slug === meta.slug);

  const displayCurrency = records[0]?.currency ?? "USD";
  const tcs = records.map((r) => convert(r.total_compensation, r.currency, displayCurrency)).sort((a, b) => a - b);
  const median = tcs[Math.floor(tcs.length / 2)] ?? 0;
  const min = tcs[0] ?? 0;
  const max = tcs[tcs.length - 1] ?? 0;

  // % per level
  const byLevel = new Map<string, number>();
  for (const r of records) byLevel.set(r.level_standardized, (byLevel.get(r.level_standardized) ?? 0) + 1);
  const levelEntries = Array.from(byLevel.entries()).sort((a, b) => b[1] - a[1]);
  const totalForBar = records.length || 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <Link to="/salaries" className="text-[13px] text-[#717171] hover:text-[#222222]">← All salaries</Link>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-3 rounded-md border border-[#EBEBEB] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">{meta.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
                <span className="rounded border border-[#EBEBEB] bg-[#F7F7F7] px-2 py-0.5 text-[#484848]">{meta.industry}</span>
                <span className="text-[#717171]">Founded {meta.founded}</span>
                <span className="text-[#717171]">·</span>
                <span className="text-[#717171]">{meta.headcount}</span>
                <span className="text-[#717171]">·</span>
                <span className="text-[#717171]">{meta.hq}</span>
              </div>
            </div>
            <Link
              to="/compare"
              search={{ a: records[0]?.id, b: records[1]?.id } as never}
              className="rounded-md bg-[#FF5A5F] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-90"
            >
              Compare
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Reveal delay={80}>
          <Stat label="Median Total Comp" value={formatMoney(median, displayCurrency)} highlight />
        </Reveal>
        <Reveal delay={120}>
          <Stat label="TC range" value={`${formatMoney(min, displayCurrency)} — ${formatMoney(max, displayCurrency)}`} />
        </Reveal>
        <Reveal delay={160}>
          <Stat label="Records" value={`${records.length}`} />
        </Reveal>
      </div>

      {/* Stacked bar by level */}
      {records.length > 0 && (
        <Reveal delay={200}>
          <div className="mt-6 rounded-md border border-[#EBEBEB] bg-white p-5">
            <div className="text-[13px] font-medium text-[#717171]">Records by level</div>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-[#F2F2F2]">
              {levelEntries.map(([lvl, count]) => {
                const c = levelColor(lvl as never);
                const pct = (count / totalForBar) * 100;
                return <div key={lvl} title={`${lvl}: ${count}`} style={{ width: `${pct}%`, background: c.text }} />;
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[12px]">
              {levelEntries.map(([lvl, count]) => {
                const c = levelColor(lvl as never);
                const pct = Math.round((count / totalForBar) * 100);
                return (
                  <div key={lvl} className="flex items-center gap-1.5 text-[#484848]">
                    <span className="inline-block h-2 w-2 rounded-sm" style={{ background: c.text }} />
                    {lvl} · {pct}%
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      )}

      <div className="mt-8">
        <Reveal>
          <h2 className="text-[22px] font-semibold text-[#222222]">All {meta.name} records</h2>
        </Reveal>
        <div className="mt-4">
          {records.length === 0 ? (
            <div className="rounded-md border border-[#EBEBEB] bg-white p-8 text-center text-[#484848]">
              No records yet for {meta.name}.
            </div>
          ) : (
            <SalaryTable rows={records} displayCurrency={displayCurrency} />
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
      <div className="text-[12px] font-medium uppercase tracking-wider text-[#717171]">{label}</div>
      <div
        className="mt-2 font-bold tabular-nums"
        style={{ fontSize: "32px", lineHeight: 1.1, color: highlight ? "#0369A1" : "#222222" }}
      >
        {value}
      </div>
    </div>
  );
}
