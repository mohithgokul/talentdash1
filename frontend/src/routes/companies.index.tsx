import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "../components/ui/Reveal";
import { COMPANIES, SALARIES } from "../lib/mock-data";
import { convert, formatMoney } from "../lib/format";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title: "Companies — TalentDash" },
      { name: "description", content: "Browse compensation data, level distribution and verified records for top tech companies in India and globally." },
      { property: "og:title", content: "Companies — TalentDash" },
      { property: "og:description", content: "Compensation data for top tech companies." },
      { property: "og:url", content: "/companies" },
    ],
    links: [{ rel: "canonical", href: "/companies" }],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal><p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Companies</p></Reveal>
      <Reveal delay={60}>
        <h1 className="mt-2 text-[36px] font-bold leading-[1.1] text-[#222222]">All companies</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-2 max-w-2xl text-[15px] text-[#484848]">
          {COMPANIES.length} companies · {SALARIES.length} verified salary records.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {COMPANIES.map((c, i) => {
          const records = SALARIES.filter((r) => r.company_slug === c.slug);
          const tcs = records.map((r) => convert(r.total_compensation, r.currency, "USD")).sort((a, b) => a - b);
          const med = tcs[Math.floor(tcs.length / 2)];
          return (
            <Reveal key={c.slug} delay={i * 30}>
              <Link
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="block rounded-md border border-[#EBEBEB] bg-white p-5 transition-[background,transform] duration-200 hover:bg-[#F2F2F2] hover:[transform:scale(1.005)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#F2F2F2] text-[13px] font-bold text-[#222222]">
                    {c.name.slice(0, 1)}
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-[#222222]">{c.name}</div>
                    <div className="text-[12px] text-[#717171]">{c.industry} · {c.hq}</div>
                  </div>
                </div>
                <div className="mt-4 text-[13px] text-[#484848]">
                  {records.length} records · median{" "}
                  <span className="font-semibold text-[#0369A1]">{med ? formatMoney(med, "USD") : "—"}</span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
