import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "../components/ui/Reveal";
import { HEATMAP, HEATMAP_CITIES, HEATMAP_ROLES } from "../lib/mock-data";
import { formatMoney } from "../lib/format";

export const Route = createFileRoute("/salaries/heatmap")({
  head: () => ({
    meta: [
      { title: "Salary Heatmap — TalentDash" },
      { name: "description", content: "Compare median total compensation across roles and Indian cities at a glance." },
      { property: "og:title", content: "Salary Heatmap — TalentDash" },
      { property: "og:description", content: "Compensation across roles and locations." },
      { property: "og:url", content: "/salaries/heatmap" },
    ],
    links: [{ rel: "canonical", href: "/salaries/heatmap" }],
  }),
  component: HeatmapPage,
});

function HeatmapPage() {
  const all = HEATMAP.flat();
  const min = Math.min(...all);
  const max = Math.max(...all);

  function cellStyle(v: number) {
    const t = (v - min) / (max - min || 1);
    const opacity = 0.08 + t * 0.62;
    return { backgroundColor: `rgba(0, 138, 5, ${opacity.toFixed(2)})` };
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#FF5A5F]">Compensation Heatmap</p>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="mt-2 text-[36px] font-bold leading-[1.1] text-[#222222]">
          Explore salary levels across roles and locations
        </h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          Median total compensation by role × city. Hover any cell for the exact figure.
        </p>
      </Reveal>

      <Reveal delay={180}>
        <div className="mt-8 overflow-x-auto rounded-md border border-[#EBEBEB] bg-white">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-[#EBEBEB] bg-white px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[#717171]">
                  Role
                </th>
                {HEATMAP_CITIES.map((c) => (
                  <th key={c} className="border-b border-[#EBEBEB] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[#717171]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_ROLES.map((role, ri) => (
                <tr key={role}>
                  <td className="sticky left-0 z-10 border-b border-[#EBEBEB] bg-white px-4 py-3 font-semibold text-[#222222]">
                    {role}
                  </td>
                  {HEATMAP[ri].map((v, ci) => (
                    <td
                      key={HEATMAP_CITIES[ci]}
                      className="border-b border-[#EBEBEB] px-4 py-3 text-[#222222] transition-colors duration-150 hover:bg-[#F2F2F2]"
                      style={cellStyle(v)}
                      title={`${role} · ${HEATMAP_CITIES[ci]} — median ${formatMoney(v, "INR")} · ~${20 + ri * 5 + ci * 3} records`}
                    >
                      <span className="font-semibold tabular-nums">{formatMoney(v, "INR")}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="mt-4 flex items-center gap-3 text-[12px] text-[#717171]">
        <span>Darker = Higher salary</span>
        <span className="ml-2 inline-flex items-center gap-1">
          {[0.1, 0.25, 0.4, 0.55, 0.7].map((o) => (
            <span key={o} className="inline-block h-3 w-6 rounded-sm" style={{ background: `rgba(0,138,5,${o})` }} />
          ))}
        </span>
      </div>
    </div>
  );
}
