import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";
import { TOOLS } from "../lib/mock-data";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "Career Tools — TalentDash" },
      { name: "description", content: "Free salary, equity, tax and resume tools to plan, grow and negotiate better." },
      { property: "og:title", content: "Career Tools — TalentDash" },
      { property: "og:description", content: "Calculators and analyzers built on verified data." },
      { property: "og:url", content: "/tools" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Tools</p>
      </Reveal>
      <div className="mt-2 flex items-start justify-between gap-4">
        <Reveal delay={60}>
          <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">Powerful tools. Smarter career moves.</h1>
        </Reveal>
        <Reveal delay={80}>
          <a href="#all" className="shrink-0 text-[14px] font-semibold text-[#FF5A5F] hover:underline">View all tools →</a>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          Accurate calculators and analyzers to help you plan, grow and negotiate better.
        </p>
      </Reveal>

      <div id="all" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {TOOLS.map((t, i) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[t.icon] ?? Icons.Wrench;
          const isLive = t.slug === "salary-calculator";
          const card = (
            <div className="group flex h-full flex-col rounded-md border border-[#EBEBEB] bg-white p-5 transition-[background,transform] duration-200 hover:bg-[#F2F2F2] hover:[transform:scale(1.005)]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#FFF1F2] text-[#FF5A5F]">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 text-[22px] font-semibold text-[#222222]">{t.name}</h3>
              <p className="mt-1 text-[14px] text-[#484848]">{t.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] text-[#717171]">{t.used}</span>
                <span className="text-[13px] font-semibold text-[#FF5A5F]">{t.cta}</span>
              </div>
              {!isLive && (
                <span className="mt-2 text-[11px] text-[#717171]">Coming soon</span>
              )}
            </div>
          );
          return (
            <Reveal key={t.slug} delay={i * 50}>
              {isLive ? (
                <Link to="/tools/salary-calculator" className="block h-full">{card}</Link>
              ) : card}
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 flex items-center gap-2 text-[13px] text-[#717171]">
        <ShieldCheck size={16} className="text-[#008A05]" />
        All tools are 100% free, secure and based on verified professional data.
      </div>
    </div>
  );
}
