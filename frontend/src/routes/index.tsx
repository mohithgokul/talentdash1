import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "../components/ui/Reveal";
import { fetchSalaries, fetchCompanies } from "../lib/api";
import { convert, formatMoney } from "../lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentDash — Compensation Intelligence for Tech" },
      { name: "description", content: "Verified tech salary data across India and global markets. Filter, compare, and decide." },
      { property: "og:title", content: "TalentDash — Compensation Intelligence for Tech" },
      { property: "og:description", content: "Verified tech salary data across India and global markets." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: async () => {
    const [salariesRes, companiesRes] = await Promise.all([
      fetchSalaries({ limit: 100 }),
      fetchCompanies()
    ]);
    return {
      salaries: salariesRes.data,
      totalRecords: salariesRes.meta.total,
      companies: companiesRes
    };
  },
  component: Home,
});

function Home() {
  const { salaries, totalRecords, companies } = Route.useLoaderData();
  const totalCompanies = companies.length;
  const allTcUsd = salaries.map((r) => convert(r.total_compensation, r.currency, "USD")).sort((a, b) => a - b);
  const medianUsd = allTcUsd.length > 0 ? allTcUsd[Math.floor(allTcUsd.length / 2)] : 0;

  // Compute Level counts
  const levelCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  for (const s of salaries) {
    levelCounts[s.level_standardized] = (levelCounts[s.level_standardized] || 0) + 1;
    locationCounts[s.location] = (locationCounts[s.location] || 0) + 1;
  }

  // Define logical order for levels
  const orderedLevelKeys = ["L1", "L2", "L3", "L4", "L5", "L6", "IC1", "IC2", "IC3", "IC4", "IC5", "SDE_I", "SDE_II", "SDE_III", "STAFF", "PRINCIPAL"];
  const availableLevels = orderedLevelKeys.filter(k => levelCounts[k]);
  
  const formatLevel = (l: string) => {
    if (l === 'STAFF') return 'Staff';
    if (l === 'PRINCIPAL') return 'Principal';
    return l.replace('_', '-');
  };

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[#EBEBEB] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-[13px] font-medium uppercase tracking-wider text-[#FF5A5F]">
              Compensation Intelligence
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-3 max-w-3xl text-[36px] font-bold leading-[1.1] text-[#222222] md:text-[48px]">
              Know what tech roles actually pay — in India and globally.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-2xl text-[16px] leading-[1.6] text-[#484848]">
              Structured, comparable, decision-ready salary data. Verified offers and self-reported records across {totalCompanies}+ companies, with level standardization and INR / USD parity.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/salaries" className="rounded-md bg-[#FF5A5F] px-5 py-2.5 text-[14px] font-semibold text-white hover:opacity-90">
                Browse salaries
              </Link>
              <Link to="/compare" className="rounded-md border border-[#EBEBEB] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#222222] hover:bg-[#F2F2F2]">
                Compare two offers
              </Link>
            </div>
          </Reveal>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Reveal delay={240}><StatCard label="Records" value={`${totalRecords}`} /></Reveal>
            <Reveal delay={280}><StatCard label="Companies" value={`${totalCompanies}`} /></Reveal>
            <Reveal delay={320}><StatCard label="Median TC (global)" value={formatMoney(medianUsd, "USD")} highlight /></Reveal>
            <Reveal delay={360}><StatCard label="Currencies" value="INR · USD" /></Reveal>
          </div>
        </div>
      </section>

      {/* Featured companies */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <h2 className="text-[28px] font-bold text-[#222222]">Featured companies</h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-2 text-[15px] text-[#484848]">Jump into compensation data for any of these.</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {companies.slice(0, 8).map((c, i) => {
            const records = salaries.filter((r) => r.company_slug === c.slug);
            const tcs = records.map((r) => convert(r.total_compensation, r.currency, "USD"));
            const med = tcs.length > 0 ? tcs.sort((a, b) => a - b)[Math.floor(tcs.length / 2)] : 0;
            return (
              <Reveal key={c.slug} delay={i * 40}>
                <Link
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="block rounded-md border border-[#EBEBEB] bg-white p-4 transition-[background,transform] duration-200 hover:bg-[#F2F2F2] hover:[transform:scale(1.005)]"
                >
                  <div className="text-[15px] font-semibold text-[#222222]">{c.name}</div>
                  <div className="mt-1 text-[12px] text-[#717171]">{c.industry} · {c.hq}</div>
                  <div className="mt-3 text-[13px] text-[#484848]">
                    {records.length} records · median{" "}
                    <span className="font-semibold text-[#0369A1]">{med ? formatMoney(med, "USD") : "—"}</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Discovery Section (Mockup Match) */}
      <section className="border-t border-[#EBEBEB] bg-[#F7F7F7] py-16">
        <style>{`
          .location-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .location-scroll::-webkit-scrollbar-track {
            background: #EBEBEB;
            border-radius: 4px;
            margin: 0 4px;
          }
          .location-scroll::-webkit-scrollbar-thumb {
            background: #999999;
            border-radius: 4px;
          }
        `}</style>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-bold text-[#222222]">Browse by Level</h3>
              <Link to="/salaries" className="text-[14px] text-[#FF5A5F] hover:underline">View all →</Link>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="mt-6 flex flex-wrap gap-3">
              {availableLevels.map(lvl => (
                <Link
                  key={lvl}
                  to="/salaries"
                  search={(prev: Record<string, unknown>) => ({ ...prev, levels: [lvl] })}
                  className="rounded-full border border-[#EBEBEB] bg-transparent px-4 py-1.5 text-[14px] text-[#484848] transition-colors hover:bg-white hover:border-[#D1D1D1]"
                >
                  {formatLevel(lvl)} ({levelCounts[lvl]})
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-16 flex items-center justify-between">
              <h3 className="text-[22px] font-bold text-[#222222]">Popular Locations</h3>
              <Link to="/salaries" className="text-[14px] text-[#FF5A5F] hover:underline">View all →</Link>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="location-scroll mt-6 flex gap-4 overflow-x-auto pb-6 snap-x">
              {topLocations.map(([loc, count]) => (
                <Link
                  key={loc}
                  to="/salaries"
                  search={(prev: Record<string, unknown>) => ({ ...prev, location: loc })}
                  className="min-w-[160px] flex-shrink-0 snap-start rounded-xl border border-[#EBEBEB] bg-white p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="text-[15px] font-bold text-[#222222]">{loc}</div>
                  <div className="mt-2 text-[13px] text-[#717171]">
                    {count} {count === 1 ? 'salary' : 'salaries'}
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
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
