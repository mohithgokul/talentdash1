import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SALARIES, uniqueLevels, uniqueLocations, uniqueRoles } from "../lib/mock-data";
import { convert } from "../lib/format";
import { SalaryTable } from "../components/features/SalaryTable";
import { FilterBar } from "../components/features/FilterBar";
import { Reveal } from "../components/ui/Reveal";

const PAGE_SIZE = 25;

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  role: fallback(z.string(), "").default(""),
  levels: fallback(z.string().array(), []).default([]),
  location: fallback(z.string(), "").default(""),
  currency: fallback(z.enum(["INR", "USD"]), "INR").default("INR"),
  sort: fallback(
    z.enum(["tc_desc", "tc_asc", "base_desc", "base_asc", "exp_desc", "exp_asc"]),
    "tc_desc",
  ).default("tc_desc"),
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/salaries")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Tech Salaries — TalentDash" },
      { name: "description", content: "Filter and sort verified tech salaries by company, role, level, and location. INR and USD." },
      { property: "og:title", content: "Tech Salaries — TalentDash" },
      { property: "og:description", content: "Filter and sort verified tech salaries." },
      { property: "og:url", content: "/salaries" },
    ],
    links: [{ rel: "canonical", href: "/salaries" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          name: "TalentDash Tech Salary Records",
          description: "Verified salary records for technology roles across India and global markets.",
          keywords: ["salary", "compensation", "tech", "India", "levels"],
          creator: { "@type": "Organization", name: "TalentDash" },
        }),
      },
    ],
  }),
  component: SalariesPage,
});

function SalariesPage() {
  const { q, role, levels, location, currency, sort, page } = Route.useSearch();

  let rows = SALARIES.slice();
  if (q) rows = rows.filter((r) => r.company.toLowerCase().includes(q.toLowerCase()));
  if (role) rows = rows.filter((r) => r.role === role);
  if (levels.length) rows = rows.filter((r) => levels.includes(r.level_standardized));
  if (location) rows = rows.filter((r) => r.location === location);

  const tcOf = (r: typeof rows[number]) => convert(r.total_compensation, r.currency, currency);
  const baseOf = (r: typeof rows[number]) => convert(r.base_salary, r.currency, currency);

  rows.sort((a, b) => {
    switch (sort) {
      case "tc_asc":   return tcOf(a) - tcOf(b);
      case "base_desc":return baseOf(b) - baseOf(a);
      case "base_asc": return baseOf(a) - baseOf(b);
      case "exp_desc": return b.experience_years - a.experience_years;
      case "exp_asc":  return a.experience_years - b.experience_years;
      default:         return tcOf(b) - tcOf(a);
    }
  });

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, total);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <h1 className="text-[36px] font-bold leading-[1.1] text-[#222222]">Tech Salaries</h1>
      </Reveal>
      <Reveal delay={60}>
        <p className="mt-2 max-w-2xl text-[15px] text-[#484848]">
          {total} records · sorted by{" "}
          <SortMenu current={sort} />
        </p>
      </Reveal>

      <div className="mt-6">
        <Reveal delay={80}>
          <FilterBar
            initial={{ q, role, levels, location, currency }}
            roles={uniqueRoles()}
            locations={uniqueLocations()}
            levels={uniqueLevels()}
          />
        </Reveal>
      </div>

      <div className="mt-6">
        {pageRows.length === 0 ? (
          <div className="rounded-md border border-[#EBEBEB] bg-white p-10 text-center">
            <p className="text-[15px] text-[#222222]">No records found for these filters.</p>
            <Link to="/salaries" search={{} as never} className="mt-3 inline-block text-[14px] font-medium text-[#FF5A5F] hover:underline">
              Clear all filters
            </Link>
          </div>
        ) : (
          <SalaryTable rows={pageRows} displayCurrency={currency} startIndex={start} />
        )}
      </div>

      {total > 0 && (
        <div className="mt-4 flex items-center justify-between text-[13px] text-[#717171]">
          <div>Showing {showingFrom}–{showingTo} of {total} records</div>
          <div className="flex gap-2">
            <Link
              to="/salaries"
              search={(prev: Record<string, unknown>) => ({ ...prev, page: Math.max(1, current - 1) })}
              className={`rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5 font-medium ${current === 1 ? "pointer-events-none opacity-40" : "hover:bg-[#F2F2F2]"}`}
            >
              ← Prev
            </Link>
            <span className="px-2 py-1.5">Page {current} of {totalPages}</span>
            <Link
              to="/salaries"
              search={(prev: Record<string, unknown>) => ({ ...prev, page: Math.min(totalPages, current + 1) })}
              className={`rounded-md border border-[#EBEBEB] bg-white px-3 py-1.5 font-medium ${current === totalPages ? "pointer-events-none opacity-40" : "hover:bg-[#F2F2F2]"}`}
            >
              Next →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SortMenu({ current }: { current: string }) {
  const options: Array<[string, string]> = [
    ["tc_desc", "Total Comp ↓"],
    ["tc_asc", "Total Comp ↑"],
    ["base_desc", "Base ↓"],
    ["base_asc", "Base ↑"],
    ["exp_desc", "Experience ↓"],
    ["exp_asc", "Experience ↑"],
  ];
  return (
    <span className="inline-flex flex-wrap gap-1">
      {options.map(([val, label]) => (
        <Link
          key={val}
          to="/salaries"
          search={(prev: Record<string, unknown>) => ({ ...prev, sort: val, page: 1 })}
          className={`rounded px-2 py-0.5 text-[13px] ${current === val ? "bg-[#222222] text-white" : "text-[#484848] hover:bg-[#F2F2F2]"}`}
        >
          {label}
        </Link>
      ))}
    </span>
  );
}
