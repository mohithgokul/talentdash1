import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { fetchSalaries } from "../lib/api";
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
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    // We fetch one large payload of data to populate the table AND filter options.
    // In a real huge app we'd have a separate /api/filters endpoint, but this is fine for now.
    const [pageRes, allRes] = await Promise.all([
      fetchSalaries({
        company: deps.q,
        role: deps.role,
        // Prisma API doesn't support multiple levels in 'level' query parameter right now, so we handle it on frontend or just pass the first one.
        // Actually, we'll fetch everything and filter on frontend for simplicity if we want to match the previous exact behavior,
        // OR we can pass pagination to the backend API! 
        // Our backend API supports page, limit, company, role, location, currency, sort
        limit: PAGE_SIZE,
        page: deps.page,
        company: deps.q,
        role: deps.role,
        location: deps.location,
        sort: deps.sort
      }),
      fetchSalaries({ limit: 1000 }) // To compute all unique filter options
    ]);

    // Compute unique filters from ALL data
    const uniqueRoles = Array.from(new Set(allRes.data.map((r) => r.role))).sort();
    const uniqueLocations = Array.from(new Set(allRes.data.map((r) => r.location))).sort();
    const uniqueLevels = Array.from(new Set(allRes.data.map((r) => r.level_standardized)));

    return {
      salaries: pageRes.data,
      meta: pageRes.meta,
      filters: { uniqueRoles, uniqueLocations, uniqueLevels }
    };
  },
  component: SalariesPage,
});

function SalariesPage() {
  const { q, role, levels, location, currency, sort, page } = Route.useSearch();
  const { salaries, meta, filters } = Route.useLoaderData();

  // If the user selected levels, our backend didn't filter by multiple levels, so we do a quick client-side pass:
  let finalSalaries = salaries;
  if (levels.length > 0) {
    finalSalaries = finalSalaries.filter(s => levels.includes(s.level_standardized));
  }

  const total = meta.total;
  const totalPages = meta.totalPages;
  const current = meta.page;
  const start = (current - 1) * meta.limit;
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + meta.limit, total);

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
            roles={filters.uniqueRoles}
            locations={filters.uniqueLocations}
            levels={filters.uniqueLevels}
          />
        </Reveal>
      </div>

      <div className="mt-6">
        {finalSalaries.length === 0 ? (
          <div className="rounded-md border border-[#EBEBEB] bg-white p-10 text-center">
            <p className="text-[15px] text-[#222222]">No records found for these filters.</p>
            <Link to="/salaries" search={{} as never} className="mt-3 inline-block text-[14px] font-medium text-[#FF5A5F] hover:underline">
              Clear all filters
            </Link>
          </div>
        ) : (
          <SalaryTable rows={finalSalaries} displayCurrency={currency} startIndex={start} />
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
