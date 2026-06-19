import { Link } from "@tanstack/react-router";
import { LevelBadge } from "../ui/LevelBadge";
import { convert, formatMoney } from "../../lib/format";
import type { Currency, SalaryRecord } from "../../types/salary";

interface Props {
  rows: SalaryRecord[];
  displayCurrency: Currency;
  startIndex?: number;
}

export function SalaryTable({ rows, displayCurrency, startIndex = 0 }: Props) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-[#EBEBEB] bg-white">
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-[12px] uppercase tracking-wide text-[#717171]">
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Level</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Exp</th>
            <th className="px-4 py-3 font-medium text-right">Base</th>
            <th className="px-4 py-3 font-medium text-right">Stock</th>
            <th className="px-4 py-3 font-medium text-right">Total Comp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const base = convert(r.base_salary, r.currency, displayCurrency);
            const stock = r.stock === null ? null : convert(r.stock, r.currency, displayCurrency);
            const total = convert(r.total_compensation, r.currency, displayCurrency);
            return (
              <tr
                key={r.id}
                className="reveal reveal-in border-b border-[#EBEBEB] transition-[background,transform] duration-200 ease-out hover:bg-[#F2F2F2] hover:[transform:scale(1.005)]"
                style={{ ["--d" as string]: `${Math.min(i, 12) * 20}ms` }}
              >
                <td className="px-4 py-3">
                  <Link
                    to="/companies/$slug"
                    params={{ slug: r.company_slug }}
                    className="font-semibold text-[#222222] hover:text-[#FF5A5F]"
                  >
                    {r.company}
                  </Link>
                  {r.is_verified && (
                    <span className="ml-2 align-middle text-[11px] font-medium text-[#008A05]">✓ Verified</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#484848]">{r.role}</td>
                <td className="px-4 py-3"><LevelBadge level={r.level_standardized} /></td>
                <td className="px-4 py-3 text-[#484848]">{r.location}</td>
                <td className="px-4 py-3 text-[#717171]">{r.experience_years} yr</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#484848]">
                  {formatMoney(base, displayCurrency)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-[#484848]">
                  {stock === null ? "—" : formatMoney(stock, displayCurrency)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className="tabular-nums font-bold"
                    style={{ color: "#0369A1", fontSize: "18px" }}
                  >
                    {formatMoney(total, displayCurrency)}
                  </span>
                  <div className="text-[11px] text-[#717171]">
                    Row {startIndex + i + 1}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
