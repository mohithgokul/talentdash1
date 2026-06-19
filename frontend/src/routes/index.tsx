import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "../components/ui/Reveal";
import { SALARIES, COMPANIES } from "../lib/mock-data";
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
  component: Home,
});

function Home() {
  const totalRecords = SALARIES.length;
  const totalCompanies = COMPANIES.length;
  const allTcUsd = SALARIES.map((r) => convert(r.total_compensation, r.currency, "USD")).sort((a, b) => a - b);
  const medianUsd = allTcUsd[Math.floor(allTcUsd.length / 2)];

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
          {COMPANIES.slice(0, 8).map((c, i) => {
            const records = SALARIES.filter((r) => r.company_slug === c.slug);
            const tcs = records.map((r) => convert(r.total_compensation, r.currency, "USD"));
            const med = tcs.sort((a, b) => a - b)[Math.floor(tcs.length / 2)];
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
