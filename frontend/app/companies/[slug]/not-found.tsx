import Link from 'next/link'

export default function CompanyNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F7F7F7]">
      <div className="text-center px-6">
        <div className="text-[64px] mb-4">🏢</div>
        <h1 className="text-[24px] font-bold text-[#222222] mb-2">Company not found</h1>
        <p className="text-[#717171] text-[15px] mb-8 max-w-sm">
          We don't have data for this company yet. Check the full salary list to see available companies.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/salaries"
            className="px-5 py-2.5 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E54550] transition-colors text-[14px]"
          >
            Browse all salaries
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-[#EBEBEB] text-[#222222] font-semibold rounded-lg hover:bg-[#F2F2F2] transition-colors text-[14px]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
