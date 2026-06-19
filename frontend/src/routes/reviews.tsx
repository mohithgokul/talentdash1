import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, PencilLine, TrendingUp } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";
import { REVIEW_SUMMARIES, REVIEWS, REVIEW_HIGHLIGHTS } from "../lib/mock-data";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Company Reviews — TalentDash" },
      { name: "description", content: "Honest, verified reviews of companies — work-life balance, comp & benefits, culture and career growth." },
      { property: "og:title", content: "Company Reviews — TalentDash" },
      { property: "og:description", content: "Real reviews from real professionals." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: ReviewsPage,
});

type HighlightKey = keyof typeof REVIEW_HIGHLIGHTS;

function ReviewsPage() {
  const [tab, setTab] = useState<string>("All");
  const [hl, setHl] = useState<HighlightKey>("work_life");
  const tabs = ["All", "Google", "Microsoft", "Amazon", "Apple", "Zomato"];
  const filtered = tab === "All" ? REVIEWS : REVIEWS.filter((r) => r.company === tab);
  const data = REVIEW_HIGHLIGHTS[hl];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Company Reviews</p>
      </Reveal>
      <div className="mt-2 flex items-start justify-between gap-4">
        <Reveal delay={60}>
          <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">Real reviews from real professionals</h1>
        </Reveal>
        <Reveal delay={80}>
          <a href="#latest" className="shrink-0 text-[14px] font-semibold text-[#FF5A5F] hover:underline">Explore all reviews →</a>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          Discover honest insights about companies, work culture, salaries, and more.
        </p>
      </Reveal>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["2.4M+", "Reviews", "From verified professionals"],
          ["14.7K+", "Companies", "Reviewed across industries"],
          ["4.1 ★", "Avg. satisfaction", "Across all companies"],
          ["96%", "Verified reviews", "From real professionals"],
        ].map(([v, l, s], i) => (
          <Reveal key={l} delay={i * 60}>
            <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
              <div className="text-[28px] font-bold text-[#222222]">{v}</div>
              <div className="mt-1 text-[13px] font-semibold text-[#222222]">{l}</div>
              <div className="text-[12px] text-[#717171]">{s}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Top rated companies */}
      <section className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Top rated companies</h2></Reveal>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {REVIEW_SUMMARIES.map((c, i) => (
            <Reveal key={c.company_slug} delay={i * 50}>
              <div className="min-w-[280px] rounded-md border border-[#EBEBEB] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-[#F2F2F2] text-[12px] font-bold text-[#222222]">
                      {c.company.slice(0, 1)}
                    </span>
                    <span className="text-[15px] font-semibold text-[#222222]">{c.company}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[14px] font-bold text-[#222222]">
                    <Star size={14} className="fill-[#FFB400] text-[#FFB400]" /> {c.overall.toFixed(1)}
                  </div>
                </div>
                {c.badge && (
                  <div className="mt-2 inline-block rounded bg-[#F2F2F2] px-2 py-0.5 text-[11px] font-medium text-[#484848]">
                    {c.badge}
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  <SubRating label="Work Life" v={c.work_life} />
                  <SubRating label="Comp & Benefits" v={c.comp} />
                  <SubRating label="Culture" v={c.culture} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Latest reviews feed */}
      <section id="latest" className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Latest reviews</h2></Reveal>
          <Reveal delay={40}>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#222222] hover:bg-[#F2F2F2]">
              <PencilLine size={14} /> Write a review
            </button>
          </Reveal>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1.5 text-[13px] ${
                tab === t ? "bg-[#222222] text-white" : "text-[#484848] hover:bg-[#F2F2F2]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-[#EBEBEB] rounded-md border border-[#EBEBEB] bg-white">
          {filtered.length === 0 && (
            <div className="p-6 text-[14px] text-[#717171]">No reviews for this filter.</div>
          )}
          {filtered.map((r) => (
            <div key={r.id} className="flex items-start gap-4 p-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#F2F2F2] text-[12px] font-bold text-[#222222]">
                {r.company.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-[#484848]">
                  <span className="font-semibold text-[#222222]">{r.company}</span>
                  <span>· {r.role}</span>
                  <span>· {r.location}</span>
                  <span className="text-[#717171]">· {r.ago}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
                  <Star size={13} className="fill-[#FFB400] text-[#FFB400]" /> {r.rating.toFixed(1)}
                </div>
                <p className="mt-1 text-[14px] text-[#484848]">{r.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Review highlights</h2></Reveal>
        <div className="mt-4 rounded-md border border-[#EBEBEB] bg-white">
          <div className="flex flex-wrap gap-1 border-b border-[#EBEBEB] p-3">
            {([
              ["work_life", "Work Life"],
              ["comp", "Comp & Benefits"],
              ["culture", "Culture"],
              ["career", "Career Growth"],
            ] as [HighlightKey, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setHl(k)}
                className={`rounded px-3 py-1.5 text-[13px] ${
                  hl === k ? "bg-[#222222] text-white" : "text-[#484848] hover:bg-[#F2F2F2]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-3">
            <div>
              <div className="text-[12px] font-medium uppercase tracking-wider text-[#717171]">Average score</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[40px] font-bold leading-none text-[#222222]">{data.score.toFixed(1)}</span>
                <span className="text-[14px] text-[#717171]">/5</span>
              </div>
              <div className="mt-1 flex items-center gap-0.5 text-[#FFB400]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(data.score) ? "fill-[#FFB400]" : "text-[#EBEBEB]"} />
                ))}
              </div>
              <div className="mt-2 text-[12px] text-[#717171]">{data.count.toLocaleString()} reviews</div>
              <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[#008A05]">
                <TrendingUp size={12} /> {data.trend}% vs last quarter
              </div>
            </div>

            <div>
              <div className="text-[12px] font-medium uppercase tracking-wider text-[#717171]">Top positives</div>
              <ul className="mt-3 space-y-2">
                {data.positives.map(([label, pct]) => (
                  <BarRow key={label} label={label} pct={pct} color="#008A05" />
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[12px] font-medium uppercase tracking-wider text-[#717171]">Top concerns</div>
              <ul className="mt-3 space-y-2">
                {data.concerns.map(([label, pct]) => (
                  <BarRow key={label} label={label} pct={pct} color="#D93025" />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SubRating({ label, v }: { label: string; v: number }) {
  const pct = (v / 5) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] text-[#484848]">
        <span>{label}</span>
        <span className="font-semibold text-[#222222]">{v.toFixed(1)}</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[#F2F2F2]">
        <div className="h-1.5 rounded-full bg-[#008A05]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BarRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <li>
      <div className="flex items-center justify-between text-[13px] text-[#484848]">
        <span>{label}</span>
        <span className="font-semibold text-[#222222]">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[#F2F2F2]">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </li>
  );
}
