"use client";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home, Building2, BarChart3, Star, MessagesSquare, Briefcase,
  Users, Wrench, Trophy, Bookmark, GitCompare, ChevronDown, Globe,
} from "lucide-react";

const NAV = [
  { to: "/",                label: "Home",            Icon: Home },
  { to: "/companies",       label: "Companies",       Icon: Building2 },
  { to: "/salaries",        label: "Salaries",        Icon: BarChart3 },
  { to: "/reviews",         label: "Reviews",         Icon: Star },
  { to: "/interviews",      label: "Interviews",      Icon: MessagesSquare },
  { to: "/jobs",            label: "Jobs",            Icon: Briefcase },
  { to: "/community",       label: "Community",       Icon: Users },
  { to: "/tools",           label: "Tools",           Icon: Wrench },
  { to: "/workplace-index", label: "Workplace Index", Icon: Trophy },
] as const;

const REGIONS = [
  { code: "global", label: "Global", flag: "🌐" },
  { code: "in",     label: "India",  flag: "🇮🇳" },
  { code: "us",     label: "United States", flag: "🇺🇸" },
  { code: "uk",     label: "United Kingdom", flag: "🇬🇧" },
] as const;

function RegionSwitcher() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState<typeof REGIONS[number]>(REGIONS[0]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("td_region");
      const found = REGIONS.find((r) => r.code === saved);
      if (found) setRegion(found);
    } catch {}
  }, []);

  function pick(r: typeof REGIONS[number]) {
    setRegion(r);
    setOpen(false);
    try { localStorage.setItem("td_region", r.code); } catch {}
  }

  return (
    <div className="relative px-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[13px] font-medium text-[#222222] hover:bg-[#F2F2F2]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>{region.flag}</span>
          <span>{region.label}</span>
        </span>
        <ChevronDown size={14} className="text-[#717171]" />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-3 right-3 top-full z-50 mt-1 rounded-md border border-[#EBEBEB] bg-white shadow-md"
        >
          {REGIONS.map((r) => (
            <li key={r.code}>
              <button
                type="button"
                onClick={() => pick(r)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#F2F2F2] ${
                  r.code === region.code ? "font-semibold text-[#FF5A5F]" : "text-[#222222]"
                }`}
              >
                <span aria-hidden>{r.flag}</span>
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const itemBase =
  "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-[#222222] transition-colors duration-150 hover:bg-[#F2F2F2]";
const itemActive =
  "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-semibold text-[#FF5A5F] bg-[#F2F2F2] border-l-2 border-[#FF5A5F] pl-[10px]";

export function Sidebar() {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-[#EBEBEB] bg-white md:flex"
      aria-label="Primary"
    >
      <Link to="/" className="flex items-center gap-2 px-5 py-5">
        <span className="inline-block h-6 w-6 rounded-sm bg-[#FF5A5F]" aria-hidden />
        <span className="text-[17px] font-bold tracking-tight text-[#222222]">TalentDash</span>
      </Link>

      <RegionSwitcher />

      <nav className="mt-3 flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {NAV.map(({ to, label, Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className={itemBase}
                activeProps={{ className: itemActive }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-[#EBEBEB] pt-3">
          <ul className="space-y-1">
            <li>
              <Link to="/saved" className={itemBase} activeProps={{ className: itemActive }}>
                <Bookmark size={16} /> <span>Saved</span>
              </Link>
            </li>
            <li>
              <Link to="/compare" className={itemBase} activeProps={{ className: itemActive }}>
                <GitCompare size={16} /> <span>Compare</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-3">
        <div className="rounded-md bg-[#FF5A5F] p-3 text-white">
          <div className="text-[13px] font-semibold">Go Pro</div>
          <p className="mt-1 text-[12px] leading-[1.4] opacity-90">
            Unlock advanced filters, exports & alerts.
          </p>
          <button
            type="button"
            className="mt-2 rounded bg-white px-2.5 py-1 text-[12px] font-semibold text-[#FF5A5F] hover:bg-[#F2F2F2]"
          >
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Mobile bottom tab bar — first 5 items as icons. */
export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-[#EBEBEB] bg-white px-2 py-1 md:hidden"
      aria-label="Primary mobile"
    >
      {NAV.slice(0, 8).map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          aria-label={label}
          activeOptions={{ exact: to === "/" }}
          className="flex flex-1 items-center justify-center px-2 py-2 text-[#717171]"
          activeProps={{ className: "flex flex-1 items-center justify-center px-2 py-2 text-[#FF5A5F]" }}
        >
          <Icon size={20} />
        </Link>
      ))}
    </nav>
  );
}

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EBEBEB] bg-white px-4 py-3 md:hidden">
      <Link to="/" className="flex items-center gap-2">
        <span className="inline-block h-5 w-5 rounded-sm bg-[#FF5A5F]" aria-hidden />
        <span className="text-[15px] font-bold tracking-tight text-[#222222]">TalentDash</span>
      </Link>
      <span className="text-[12px] text-[#717171]"><Globe size={14} className="inline" /> Global</span>
    </header>
  );
}
