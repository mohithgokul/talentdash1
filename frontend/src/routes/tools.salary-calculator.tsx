import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "../components/ui/Reveal";
import { formatMoney } from "../lib/format";

export const Route = createFileRoute("/tools/salary-calculator")({
  head: () => ({
    meta: [
      { title: "Salary Calculator — TalentDash" },
      { name: "description", content: "Estimate your in-hand salary, basic, HRA, PF and tax for any CTC under the Indian regime." },
      { property: "og:title", content: "Salary Calculator — TalentDash" },
      { property: "og:description", content: "From CTC to take-home in seconds." },
      { property: "og:url", content: "/tools/salary-calculator" },
    ],
    links: [{ rel: "canonical", href: "/tools/salary-calculator" }],
  }),
  component: SalaryCalculator,
});

// Indian new-regime FY 2025-26 slabs (illustrative, standard deduction 75k).
function newRegimeTax(taxable: number): number {
  if (taxable <= 300_000) return 0;
  const slabs: [number, number][] = [
    [300_000, 0.05],
    [600_000, 0.10],
    [900_000, 0.15],
    [1_200_000, 0.20],
    [1_500_000, 0.30],
  ];
  let tax = 0;
  let prev = 0;
  for (const [cap, rate] of slabs) {
    if (taxable > cap) { tax += (cap - prev) * rate; prev = cap; }
    else { tax += (taxable - prev) * rate; return tax; }
  }
  tax += (taxable - 1_500_000) * 0.30;
  return tax;
}

function SalaryCalculator() {
  const [ctc, setCtc] = useState<number>(25_00_000);

  const result = useMemo(() => {
    const basic = ctc * 0.45;
    const hra = basic * 0.50;
    const special = ctc - basic - hra;
    const pfEmployee = Math.min(basic * 0.12, 1_800 * 12);
    const pfEmployer = pfEmployee;
    const gross = ctc - pfEmployer;
    const stdDeduction = 75_000;
    const taxable = Math.max(0, gross - stdDeduction);
    const tax = newRegimeTax(taxable);
    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const annualInHand = gross - pfEmployee - totalTax;
    const monthly = annualInHand / 12;
    return { basic, hra, special, pfEmployee, pfEmployer, gross, taxable, totalTax, annualInHand, monthly };
  }, [ctc]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <Link to="/tools" className="text-[13px] font-medium text-[#FF5A5F] hover:underline">← All tools</Link>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="mt-3 text-[36px] font-bold leading-[1.1] text-[#222222]">Salary Calculator</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-2 max-w-2xl text-[15px] text-[#484848]">
          Enter your gross CTC. We'll break it down to basic, HRA, PF and your monthly take-home under India's new tax regime (FY 25-26).
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal delay={160}>
          <div className="rounded-md border border-[#EBEBEB] bg-white p-6">
            <label htmlFor="ctc" className="block text-[12px] font-semibold uppercase tracking-wider text-[#717171]">
              Gross CTC (₹ per year)
            </label>
            <input
              id="ctc"
              type="number"
              min={0}
              step={50_000}
              value={ctc}
              onChange={(e) => setCtc(Math.max(0, Number(e.target.value) || 0))}
              className="mt-2 w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-[18px] font-semibold text-[#222222] tabular-nums focus:border-[#FF5A5F] focus:outline-none"
            />
            <input
              type="range"
              min={3_00_000}
              max={1_00_00_000}
              step={50_000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="mt-3 w-full accent-[#FF5A5F]"
            />
            <div className="mt-2 flex justify-between text-[12px] text-[#717171]">
              <span>₹3L</span><span>₹1Cr</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="rounded-md border border-[#EBEBEB] bg-white p-6">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#717171]">Estimated take-home</div>
            <div className="mt-2 text-[40px] font-bold leading-none text-[#0369A1] tabular-nums">
              {formatMoney(result.monthly, "INR")}<span className="ml-2 text-[14px] font-medium text-[#717171]">/month</span>
            </div>
            <div className="mt-1 text-[13px] text-[#484848]">
              Annual: <span className="font-semibold text-[#222222]">{formatMoney(result.annualInHand, "INR")}</span>
            </div>
            <dl className="mt-5 divide-y divide-[#EBEBEB] text-[13px]">
              <Row k="Basic"            v={formatMoney(result.basic, "INR")} />
              <Row k="HRA"              v={formatMoney(result.hra, "INR")} />
              <Row k="Special allowance" v={formatMoney(result.special, "INR")} />
              <Row k="PF (employee)"    v={`− ${formatMoney(result.pfEmployee, "INR")}`} />
              <Row k="Income tax + cess" v={`− ${formatMoney(result.totalTax, "INR")}`} />
            </dl>
            <p className="mt-4 text-[11px] text-[#717171]">
              Illustrative new-regime calculation. Excludes professional tax, NPS and employer-specific structuring.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-[#484848]">{k}</dt>
      <dd className="font-semibold text-[#222222] tabular-nums">{v}</dd>
    </div>
  );
}
