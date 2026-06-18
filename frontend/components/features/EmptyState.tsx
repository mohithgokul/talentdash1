import Link from 'next/link'

interface Props {
  onClearHref: string
}

export default function EmptyState({ onClearHref }: Props) {
  return (
    <div className="rounded-lg border border-[#EBEBEB] bg-white p-14 text-center">
      <div className="text-3xl mb-3">🔍</div>
      <p className="text-[#222222] font-semibold text-base mb-1">No records found</p>
      <p className="text-[#717171] text-sm mb-4">
        No records match these filters. Try removing a filter.
      </p>
      <Link
        href={onClearHref}
        className="inline-block px-5 py-2 bg-[#FF5A5F] text-white text-sm font-semibold rounded-md hover:bg-[#E54550] transition-colors"
      >
        Clear all filters
      </Link>
    </div>
  )
}
