import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Calendar, FileSearch } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";
import { RANKING_LISTS, INDUSTRIES, COMPANIES } from "../lib/mock-data";

export const Route = createFileRoute("/workplace-index")({
  head: () => ({
    meta: [
      { title: "TalentDash Workplace Index" },
      { name: "description", content: "Data-driven rankings of companies, industries and workplaces based on what professionals value most." },
      { property: "og:title", content: "TalentDash Workplace Index" },
      { property: "og:description", content: "Verified rankings, no paid placements." },
      { property: "og:url", content: "/workplace-index" },
    ],
    links: [{ rel: "canonical", href: "/workplace-index" }],
  }),
  component: WorkplaceIndex,
});

function logoBadge(slug: string) {
  const c = COMPANIES.find((x) => x.slug === slug);
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#F2F2F2] text-[10px] font-bold text-[#484848]">
      {(c?.name ?? slug).slice(0, 1)}
    </span>
  );
}

function WorkplaceIndex() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Workplace Index</p>
      </Reveal>
      <div className="mt-2 flex items-start justify-between gap-4">
        <Reveal delay={60}>
          <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">TalentDash Workplace Index</h1>
        </Reveal>
        <Reveal delay={80}>
          <a href="#lists" className="shrink-0 text-[14px] font-semibold text-[#FF5A5F] hover:underline">Explore all rankings →</a>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          Data-driven rankings of companies, industries and workplaces based on what professionals value the most.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["500+", "Companies ranked"],
          ["15M+", "Verified data points"],
          ["30+", "Ranking categories"],
          ["100%", "Transparent methodology"],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 50}>
            <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
              <div className="text-[28px] font-bold text-[#222222]">{v}</div>
              <div className="mt-1 text-[13px] text-[#484848]">{l}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <section id="lists" className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Popular ranking lists</h2></Reveal>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {RANKING_LISTS.map((list, i) => (
            <Reveal key={list.title} delay={i * 50}>
              <div className="min-w-[280px] rounded-md border border-[#EBEBEB] bg-white p-5">
                <div className="text-[14px] font-semibold text-[#222222]">{list.title}</div>
                <ol className="mt-3 space-y-2">
                  {list.top.map((slug, idx) => {
                    const c = COMPANIES.find((x) => x.slug === slug);
                    return (
                      <li key={slug} className="flex items-center gap-3 text-[13px]">
                        <span className="w-4 text-[#717171] tabular-nums">{idx + 1}</span>
                        {logoBadge(slug)}
                        <span className="font-medium text-[#222222]">{c?.name ?? slug}</span>
                      </li>
                    );
                  })}
                </ol>
                <a href="#" className="mt-4 inline-block text-[12px] font-semibold text-[#FF5A5F] hover:underline">See full list →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Explore by industry</h2></Reveal>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind) => (
            <div key={ind.name} className="rounded-md border border-[#EBEBEB] bg-white p-4">
              <div className="text-[14px] font-semibold text-[#222222]">{ind.name}</div>
              <div className="mt-1 text-[12px] text-[#717171]">Top companies</div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {ind.companies.slice(0, 5).map((s) => logoBadge(s))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-md border border-[#EBEBEB] bg-white p-6">
        <h3 className="text-[16px] font-semibold text-[#222222]">Rankings you can trust</h3>
        <div className="mt-4 grid grid-cols-2 gap-4 text-[13px] text-[#484848] md:grid-cols-4">
          <Trust Icon={ShieldCheck} label="Verified data only" />
          <Trust Icon={Sparkles}    label="No paid placements" />
          <Trust Icon={Calendar}    label="Updated monthly" />
          <Trust Icon={FileSearch}  label="Transparent methodology" />
        </div>
      </section>
    </div>
  );
}

function Trust({ Icon, label }: { Icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#F2F2F2] text-[#008A05]">
        <Icon size={14} />
      </span>
      <span>{label}</span>
    </div>
  );
}
