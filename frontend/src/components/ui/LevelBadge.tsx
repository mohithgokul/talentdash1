import { levelColor } from "../../lib/format";
import type { LevelKey } from "../../types/salary";

export function LevelBadge({ level }: { level: LevelKey }) {
  const c = levelColor(level);
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-[12px] font-medium"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {level}
    </span>
  );
}
