import type { Currency, LevelKey } from "../types/salary";

const USD_PER_INR = 1 / 83;

export function convert(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  if (from === "INR" && to === "USD") return amount * USD_PER_INR;
  return amount / USD_PER_INR;
}

export function formatMoney(
  amount: number | null | undefined,
  currency: Currency,
): string {
  if (amount === null || amount === undefined) return "—";
  if (amount === 0) return "—";
  if (currency === "INR") {
    if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  }
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

export function levelColor(level: LevelKey): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "L3":        { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
    "SDE-I":     { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
    "L4":        { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
    "SDE-II":    { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" },
    "L5":        { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" },
    "SDE-III":   { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" },
    "L6":        { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
    "Staff":     { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
    "Principal": { bg: "#EFF6FF", text: "#1E3A8A", border: "#C7D2FE" },
  };
  return map[level] ?? map["L4"];
}
