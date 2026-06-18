import type { Level } from '@/types'
import { getLevelLabel, getLevelBadgeClass } from '@/lib/data-utils'

interface Props {
  level: Level
  className?: string
}

export default function LevelBadge({ level, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-semibold whitespace-nowrap ${getLevelBadgeClass(level)} ${className}`}
    >
      {getLevelLabel(level)}
    </span>
  )
}
