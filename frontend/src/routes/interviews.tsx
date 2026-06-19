import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Code2, Briefcase, BarChart3, PenTool, ArrowUpRight, ArrowDownRight, Users } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";
import { INTERVIEW_QUESTIONS, ROLE_QUESTION_GROUPS, TRENDING_TOPICS } from "../lib/mock-data";

export const Route = createFileRoute("/interviews")({
  head: () => ({
    meta: [
      { title: "Interview Questions — TalentDash" },
      { name: "description", content: "Real interview questions and topics shared by verified candidates across top tech companies." },
      { property: "og:title", content: "Interview Questions — TalentDash" },
      { property: "og:description", content: "Real interview questions from real candidates." },
      { property: "og:url", content: "/interviews" },
    ],
    links: [{ rel: "canonical", href: "/interviews" }],
  }),
  component: InterviewsPage,
});

const ROLE_TABS = ["Popular Roles", "Engineering", "Product", "Data", "Design", "Sales"] as const;

function diffColor(d: string) {
  if (d === "Easy") return { bg: "#E8F5E9", text: "#008A05", border: "#B7E4BE" };
  if (d === "Medium") return { bg: "#FFF6E0", text: "#A06A00", border: "#FFE2A8" };
  return { bg: "#FCE7E6", text: "#D93025", border: "#F7C5C1" };
}

function InterviewsPage() {
  const [tab, setTab] = useState<string>("Popular Roles");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Interviews</p>
      </Reveal>
      <div className="mt-2 flex items-start justify-between gap-4">
        <Reveal delay={60}>
          <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">Real interview questions from real candidates</h1>
        </Reveal>
        <Reveal delay={80}>
          <a href="#topics" className="shrink-0 text-[14px] font-semibold text-[#FF5A5F] hover:underline">Explore all interviews →</a>
        </Reveal>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          ["320K+", "Recent questions"],
          ["8.4K+", "Companies covered"],
          ["94%", "Verified submissions"],
        ].map(([v, l], i) => (
          <Reveal key={l} delay={i * 60}>
            <div className="rounded-md border border-[#EBEBEB] bg-white p-5">
              <div className="text-[28px] font-bold text-[#222222]">{v}</div>
              <div className="mt-1 text-[13px] text-[#484848]">{l}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Recent questions */}
      <section className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Recent questions asked</h2></Reveal>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {INTERVIEW_QUESTIONS.map((q, i) => {
            const c = diffColor(q.difficulty);
            return (
              <Reveal key={q.id} delay={i * 50}>
                <div className="min-w-[320px] max-w-[340px] rounded-md border border-[#EBEBEB] bg-white p-5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#222222]">{q.company} · {q.role}</span>
                    <span className="text-[#717171]">{q.ago}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-[14px] text-[#222222]">{q.question}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {q.tags.map((t) => (
                      <span key={t} className="rounded bg-[#F2F2F2] px-2 py-0.5 text-[11px] font-medium text-[#484848]">{t}</span>
                    ))}
                    <span
                      className="ml-auto rounded px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="mt-3 text-[12px] text-[#717171]">{q.answers} answers</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Browse by role */}
      <section className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Browse by role</h2></Reveal>
        <div className="mt-3 flex flex-wrap gap-1">
          {ROLE_TABS.map((t) => (
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
          {ROLE_QUESTION_GROUPS.map((g) => {
            const Icon = g.role.includes("Engineer") ? Code2 : g.role.includes("Manager") ? Briefcase : g.role.includes("Data") ? BarChart3 : PenTool;
            const up = g.trend >= 0;
            return (
              <div key={g.role} className="flex items-start gap-4 p-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F2F2F2] text-[#222222]">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[14px]">
                    <span className="font-semibold text-[#222222]">{g.role}</span>
                    <span className="text-[#717171]">· {g.count.toLocaleString()} questions</span>
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-[#484848]">Latest: {g.latest}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {g.companies.map((co) => (
                      <span key={co} className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#F2F2F2] text-[10px] font-bold text-[#484848]">
                        {co.slice(0, 1).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold ${up ? "text-[#008A05]" : "text-[#D93025]"}`}>
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(g.trend)}% vs last month
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="mt-12">
        <Reveal><h2 className="text-[22px] font-semibold text-[#222222]">Trending interview topics</h2></Reveal>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {TRENDING_TOPICS.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between rounded-md border border-[#EBEBEB] bg-white px-4 py-3">
              <span className="text-[14px] font-semibold text-[#222222]">{name}</span>
              <span className="text-[12px] text-[#717171]">{count.toLocaleString()} questions</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mt-12 rounded-md border border-[#EBEBEB] bg-[#F7F7F7] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[16px] font-semibold text-[#222222]">Share your experience</div>
            <div className="mt-1 text-[13px] text-[#484848]">
              <Users size={13} className="mr-1 inline" />
              Join 85K+ professionals contributing
            </div>
          </div>
          <button className="rounded-md bg-[#FF5A5F] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-90">
            Submit interview questions →
          </button>
        </div>
      </section>
    </div>
  );
}
