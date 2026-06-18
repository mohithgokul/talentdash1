'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/salaries', label: 'Salaries' },
  { href: '/compare', label: 'Compare' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-[#EBEBEB] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-md bg-[#FF5A5F] flex items-center justify-center text-white font-black text-sm select-none">
            T
          </span>
          <span className="text-[18px] font-bold text-[#222222] tracking-tight">TalentDash</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F2F2F2] text-[#222222]'
                    : 'text-[#717171] hover:bg-[#F2F2F2] hover:text-[#222222]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile menu placeholder */}
        <div className="flex md:hidden">
          <Link href="/salaries" className="text-[#FF5A5F] text-sm font-semibold">
            Browse →
          </Link>
        </div>
      </div>
    </nav>
  )
}
