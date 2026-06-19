import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — TalentDash" },
      { name: "description", content: "Your saved companies, roles and salary records." },
      { property: "og:title", content: "Saved — TalentDash" },
      { property: "og:description", content: "Bookmark anything to revisit later." },
      { property: "og:url", content: "/saved" },
    ],
    links: [{ rel: "canonical", href: "/saved" }],
  }),
  component: SavedPage,
});

function SavedPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#FFF1F2] text-[#FF5A5F]">
          <Bookmark size={22} />
        </span>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="mt-4 text-[36px] font-bold leading-[1.1] text-[#222222]">Saved</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-3 max-w-xl text-[15px] text-[#484848]">
          Nothing saved yet. Bookmark companies and records from{" "}
          <Link to="/salaries" className="font-semibold text-[#FF5A5F] hover:underline">Salaries</Link> to see them here.
        </p>
      </Reveal>
    </div>
  );
}
