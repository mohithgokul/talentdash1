import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — TalentDash" },
      { name: "description", content: "Curated tech roles with verified compensation data. Coming soon." },
      { property: "og:title", content: "Jobs — TalentDash" },
      { property: "og:description", content: "Curated tech jobs with TC visibility." },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#FFF1F2] text-[#FF5A5F]">
          <Briefcase size={22} />
        </span>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="mt-4 text-[36px] font-bold leading-[1.1] text-[#222222]">Jobs</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-3 max-w-xl text-[15px] text-[#484848]">
          A curated jobs feed with verified compensation bands is in the works. In the meantime, browse{" "}
          <Link to="/salaries" className="font-semibold text-[#FF5A5F] hover:underline">salary data</Link> or{" "}
          <Link to="/companies/$slug" params={{ slug: "google" }} className="font-semibold text-[#FF5A5F] hover:underline">company profiles</Link>.
        </p>
      </Reveal>
    </div>
  );
}
