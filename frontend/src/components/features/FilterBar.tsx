"use client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Currency } from "../../types/salary";

interface Props {
  initial: {
    q: string;
    role: string;
    levels: string[];
    location: string;
    currency: Currency;
  };
  roles: string[];
  locations: string[];
  levels: string[];
}

export function FilterBar({ initial, roles, locations, levels }: Props) {
  const navigate = useNavigate({ from: "/salaries" });
  const [q, setQ] = useState(initial.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced company text search
  useEffect(() => {
    if (q === initial.q) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, q: q || undefined, page: 1 }) });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const update = (patch: Record<string, unknown>) =>
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...patch, page: 1 }) });

  const toggleLevel = (lvl: string) => {
    const set = new Set(initial.levels);
    if (set.has(lvl)) set.delete(lvl);
    else set.add(lvl);
    const next = Array.from(set);
    update({ levels: next.length ? next : undefined });
  };

  return (
    <div className="rounded-md border border-[#EBEBEB] bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="mb-1 block text-[12px] font-medium text-[#717171]">Company</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by company..."
            className="w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[14px] text-[#222222] placeholder:text-[#717171] focus:border-[#FF5A5F] focus:outline-none"
          />
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block text-[12px] font-medium text-[#717171]">Role</label>
          <select
            value={initial.role}
            onChange={(e) => update({ role: e.target.value || undefined })}
            className="w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[14px] text-[#222222] focus:border-[#FF5A5F] focus:outline-none"
          >
            <option value="">All roles</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="mb-1 block text-[12px] font-medium text-[#717171]">Location</label>
          <select
            value={initial.location}
            onChange={(e) => update({ location: e.target.value || undefined })}
            className="w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[14px] text-[#222222] focus:border-[#FF5A5F] focus:outline-none"
          >
            <option value="">All locations</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-[12px] font-medium text-[#717171]">Currency</label>
          <div className="inline-flex rounded-md border border-[#EBEBEB] p-0.5">
            {(["INR", "USD"] as const).map((c) => {
              const active = initial.currency === c;
              return (
                <button
                  key={c}
                  onClick={() => update({ currency: c })}
                  className={`rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    active ? "bg-[#FF5A5F] text-white" : "text-[#484848] hover:bg-[#F2F2F2]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-medium text-[#717171]">Level:</span>
        {levels.map((lvl) => {
          const active = initial.levels.includes(lvl);
          return (
            <button
              key={lvl}
              onClick={() => toggleLevel(lvl)}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
                active
                  ? "border-[#FF5A5F] bg-[#FF5A5F] text-white"
                  : "border-[#EBEBEB] bg-white text-[#484848] hover:bg-[#F2F2F2]"
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>
    </div>
  );
}
