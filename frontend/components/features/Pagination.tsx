import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  baseParams: string // current search params string (without page)
  basePath: string
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  baseParams,
  basePath,
}: Props) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)

  function pageHref(p: number) {
    const sp = new URLSearchParams(baseParams)
    sp.set('page', String(p))
    return `${basePath}?${sp.toString()}`
  }

  // Build visible page numbers (window of 5)
  const pages: number[] = []
  let lo = Math.max(1, currentPage - 2)
  const hi = Math.min(totalPages, lo + 4)
  lo = Math.max(1, hi - 4)
  for (let i = lo; i <= hi; i++) pages.push(i)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 py-4">
      <p className="text-[13px] text-[#717171]">
        Showing {start}–{end} of {total} records
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={pageHref(currentPage - 1)}
          aria-disabled={currentPage === 1}
          className={`px-3 py-1.5 border border-[#EBEBEB] rounded-md text-[13px] font-medium transition-colors ${
            currentPage === 1
              ? 'pointer-events-none opacity-40 text-[#717171]'
              : 'text-[#222222] hover:bg-[#F2F2F2]'
          }`}
        >
          ← Prev
        </Link>

        {pages.map((p) => (
          <Link
            key={p}
            href={pageHref(p)}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              p === currentPage
                ? 'bg-[#FF5A5F] text-white border border-[#FF5A5F]'
                : 'border border-[#EBEBEB] text-[#222222] hover:bg-[#F2F2F2]'
            }`}
          >
            {p}
          </Link>
        ))}

        <Link
          href={pageHref(currentPage + 1)}
          aria-disabled={currentPage === totalPages}
          className={`px-3 py-1.5 border border-[#EBEBEB] rounded-md text-[13px] font-medium transition-colors ${
            currentPage === totalPages
              ? 'pointer-events-none opacity-40 text-[#717171]'
              : 'text-[#222222] hover:bg-[#F2F2F2]'
          }`}
        >
          Next →
        </Link>
      </div>
    </div>
  )
}
