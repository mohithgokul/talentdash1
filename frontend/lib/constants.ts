import type { Level } from '@/types'

// ─── Currency conversion ───────────────────────────────────────────────────────
// Stored here so every layer uses the same rate — never hardcode elsewhere
export const USD_TO_INR = 84.0
export const INR_TO_USD = 1 / USD_TO_INR

// ─── Pagination ────────────────────────────────────────────────────────────────
export const PAGE_SIZE = 25

// ─── All valid level values (ordered junior → senior) ─────────────────────────
export const ALL_LEVELS: Level[] = [
  'L3',
  'SDE_I',
  'L4',
  'SDE_II',
  'L5',
  'SDE_III',
  'IC4',
  'L6',
  'IC5',
  'STAFF',
  'PRINCIPAL',
]

// ─── Level display labels ──────────────────────────────────────────────────────
export const LEVEL_LABELS: Record<Level, string> = {
  'L3':        'L3 / SDE-I',
  'SDE_I':     'SDE-I',
  'L4':        'L4 / SDE-II',
  'SDE_II':    'SDE-II',
  'L5':        'L5 / SDE-III',
  'SDE_III':   'SDE-III',
  'IC4':       'IC4',
  'L6':        'L6 / Staff',
  'IC5':       'IC5',
  'STAFF':     'Staff',
  'PRINCIPAL': 'Principal',
}

// ─── Level badge CSS classes (bg + text) ──────────────────────────────────────
export const LEVEL_BADGE_CLASSES: Record<Level, string> = {
  'L3':        'bg-[#E8E8E8] text-[#424242]',        // slate
  'SDE_I':     'bg-[#E8E8E8] text-[#424242]',        // slate
  'L4':        'bg-[#BFE7FF] text-[#003DA5]',        // blue
  'SDE_II':    'bg-[#BFE7FF] text-[#003DA5]',        // blue
  'L5':        'bg-[#C5D9F2] text-[#1F1A7A]',        // indigo
  'SDE_III':   'bg-[#C5D9F2] text-[#1F1A7A]',        // indigo
  'IC4':       'bg-[#C5D9F2] text-[#1F1A7A]',        // indigo
  'L6':        'bg-[#E8D4F8] text-[#3F175E]',        // purple
  'IC5':       'bg-[#E8D4F8] text-[#3F175E]',        // purple
  'STAFF':     'bg-[#E8D4F8] text-[#3F175E]',        // purple
  'PRINCIPAL': 'bg-[#1A1A3E] text-white',            // navy
}

// ─── Base URL for canonical/OG tags ───────────────────────────────────────────
export const SITE_URL = 'https://talentdash.app'
