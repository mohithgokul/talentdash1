import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offer Evaluator — TalentDash" },
      { name: "description", content: "AI-powered insights to evaluate total compensation and make confident career decisions." },
      { property: "og:title", content: "Offer Evaluator — TalentDash" },
      { property: "og:description", content: "Decode your offer. Know your worth." },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  // Gauge — 82/100
  const score = 82;
  const r = 56, c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <Reveal><p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Offers</p></Reveal>
          <Reveal delay={60}>
            <h1 className="mt-2 text-[36px] font-bold leading-[1.1] text-[#222222] md:text-[44px]">
              Decode your offer. Know your worth.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-[#484848]">
              AI-powered insights to evaluate your total compensation and make confident career decisions.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["280K+", "Offers analyzed"],
              ["35K+", "Companies covered"],
              ["18%", "Higher offers achieved"],
              ["100%", "Private & secure"],
            ].map(([v, l], i) => (
              <Reveal key={l} delay={160 + i * 50}>
                <div className="rounded-md border border-[#EBEBEB] bg-white p-4">
                  <div className="text-[22px] font-bold text-[#222222]">{v}</div>
                  <div className="mt-1 text-[12px] text-[#717171]">{l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <Reveal delay={180}>
            <div className="rounded-md border border-[#EBEBEB] bg-white p-6 shadow-sm">
              <h3 className="text-[16px] font-semibold text-[#222222]">Evaluate your offer in 2 minutes</h3>
              <p className="mt-1 text-[13px] text-[#484848]">
                Upload your offer details and get a complete breakdown of your CTC, benefits, equity and more.
              </p>

              <div className="mt-5 flex items-center justify-center">
                <div className="relative h-[140px] w-[140px]">
                  <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                    <circle cx="70" cy="70" r={r} fill="none" stroke="#EBEBEB" strokeWidth="12" />
                    <circle
                      cx="70" cy="70" r={r} fill="none"
                      stroke="#008A05" strokeWidth="12" strokeLinecap="round"
                      strokeDasharray={c} strokeDashoffset={offset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-[28px] font-bold text-[#222222] tabular-nums">{score}<span className="text-[14px] font-medium text-[#717171]">/100</span></div>
                    <div className="text-[11px] font-semibold text-[#008A05]">Above Market</div>
                  </div>
                </div>
              </div>

              <dl className="mt-5 divide-y divide-[#EBEBEB] text-[13px]">
                <Row k="Base Salary" v="Above market" color="#008A05" />
                <Row k="Bonus"       v="Average"        color="#A06A00" />
                <Row k="Equity"      v="Above market" color="#008A05" />
                <Row k="Benefits"    v="Excellent"      color="#008A05" />
              </dl>

              <button className="mt-5 w-full rounded-md bg-[#FF5A5F] px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-90">
                Evaluate my offer →
              </button>

              <div className="mt-4 flex items-center gap-2 text-[12px] text-[#717171]">
                <AvatarStack />
                <Users size={12} /> Join 85K+ professionals making smarter decisions
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-[#484848]">{k}</dt>
      <dd className="font-semibold" style={{ color }}>{v}</dd>
    </div>
  );
}

function AvatarStack() {
  const colors = ["#FF5A5F", "#0369A1", "#008A05", "#FFB400"];
  return (
    <div className="flex -space-x-1.5">
      {colors.map((c, i) => (
        <span key={i} className="inline-block h-5 w-5 rounded-full border-2 border-white" style={{ background: c }} />
      ))}
    </div>
  );
}
