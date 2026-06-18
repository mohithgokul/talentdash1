import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F7F7]">
      <div className="text-center px-6">
        <div className="text-[80px] font-black text-[#EBEBEB] leading-none mb-4">404</div>
        <h1 className="text-[24px] font-bold text-[#222222] mb-2">Page not found</h1>
        <p className="text-[#717171] text-[15px] mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E54550] transition-colors text-[14px]"
          >
            Go home
          </Link>
          <Link
            href="/salaries"
            className="px-5 py-2.5 bg-white border border-[#EBEBEB] text-[#222222] font-semibold rounded-lg hover:bg-[#F2F2F2] transition-colors text-[14px]"
          >
            Browse salaries
          </Link>
        </div>
      </div>
    </div>
  )
}
