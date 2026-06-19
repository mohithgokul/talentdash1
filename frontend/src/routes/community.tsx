import { createFileRoute } from "@tanstack/react-router";
import { Flame, TrendingUp, MessageSquare, Users } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";
import { DISCUSSIONS, COMMUNITIES, TOP_CONTRIBUTORS } from "../lib/mock-data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — TalentDash" },
      { name: "description", content: "Real conversations from verified professionals. Discussions, communities and top contributors." },
      { property: "og:title", content: "Community — TalentDash" },
      { property: "og:description", content: "Discussions and communities for tech professionals." },
      { property: "og:url", content: "/community" },
    ],
    links: [{ rel: "canonical", href: "/community" }],
  }),
  component: CommunityPage,
});

function tagPill(tag: "Hot" | "Trending") {
  const isHot = tag === "Hot";
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ background: isHot ? "#FCE7E6" : "#E8F5E9", color: isHot ? "#D93025" : "#008A05" }}
    >
      {isHot ? <Flame size={10} /> : <TrendingUp size={10} />} {tag}
    </span>
  );
}

function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Community</p>
      </Reveal>
      <div className="mt-2 flex items-start justify-between gap-4">
        <Reveal delay={60}>
          <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">What professionals are discussing</h1>
        </Reveal>
        <Reveal delay={80}>
          <button className="shrink-0 rounded-md bg-[#FF5A5F] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90">
            Start a discussion
          </button>
        </Reveal>
      </div>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          Real conversations. Real insights. From verified professionals.
        </p>
      </Reveal>

      <section className="mt-10">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Trending discussions</h2></Reveal>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {DISCUSSIONS.map((d, i) => (
            <Reveal key={d.id} delay={i * 40}>
              <div className="min-w-[300px] max-w-[320px] rounded-md border border-[#EBEBEB] bg-white p-5">
                <div className="flex items-center gap-2">
                  {d.company && (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#F2F2F2] text-[10px] font-bold text-[#484848]">
                      {d.company.slice(0, 1)}
                    </span>
                  )}
                  {tagPill(d.tag)}
                </div>
                <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold text-[#222222]">{d.title}</h3>
                <div className="mt-3 flex items-center justify-between text-[12px] text-[#717171]">
                  <span className="inline-flex items-center gap-1"><MessageSquare size={12} /> {d.replies}</span>
                  <span>{d.ago}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {["#FF5A5F", "#0369A1", "#008A05"].map((c, k) => (
                      <span key={k} className="inline-block h-5 w-5 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#717171]">+{d.participants} participants</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-[22px] font-semibold text-[#222222]">Trending now</h2>
          <ol className="mt-4 divide-y divide-[#EBEBEB] rounded-md border border-[#EBEBEB] bg-white">
            {DISCUSSIONS.slice(0, 5).map((d, i) => (
              <li key={d.id} className="flex items-start gap-4 p-4">
                <span className="w-5 text-[14px] font-bold text-[#717171] tabular-nums">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-[#222222]">{d.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[#717171]">
                    <span>{d.replies} replies</span>
                    <span>· {d.ago}</span>
                    {d.company && <span>· {d.company}</span>}
                    {tagPill(d.tag)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="text-[22px] font-semibold text-[#222222]">Top contributors</h2>
          <ol className="mt-4 divide-y divide-[#EBEBEB] rounded-md border border-[#EBEBEB] bg-white">
            {TOP_CONTRIBUTORS.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 p-3">
                <span className="w-4 text-[12px] font-bold text-[#717171] tabular-nums">{i + 1}</span>
                <span className="inline-block h-7 w-7 rounded-full bg-[#FF5A5F] text-center text-[12px] font-bold leading-7 text-white">
                  {p.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-[#222222]">{p.name}</div>
                  <div className="text-[11px] text-[#717171]">{p.replies} replies</div>
                </div>
                <span className="rounded bg-[#FFF1F2] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF5A5F]">Top 1%</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[22px] font-semibold text-[#222222]">Popular communities</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {COMMUNITIES.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-md border border-[#EBEBEB] bg-white p-4">
              <div>
                <div className="text-[14px] font-semibold text-[#222222]">{c.name}</div>
                <div className="mt-0.5 text-[12px] text-[#717171]"><Users size={11} className="inline" /> {c.members} members</div>
              </div>
              <button className="rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#222222] hover:bg-[#F2F2F2]">
                Join
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
