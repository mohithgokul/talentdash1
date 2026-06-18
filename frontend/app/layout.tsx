import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/features/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'TalentDash | Tech Compensation Intelligence', template: '%s | TalentDash' },
  description:
    'Structured, comparable, decision-ready salary data for tech professionals across India and globally.',
  metadataBase: new URL('https://talentdash.app'),
  openGraph: {
    siteName: 'TalentDash',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F7F7F7] text-[#222222] antialiased">
        <Navigation />
        <main>{children}</main>
        <footer className="border-t border-[#EBEBEB] bg-white mt-16 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#717171]">
            <span>© {new Date().getFullYear()} TalentDash · Structured data → Comparable → Decision-ready.</span>
            <div className="flex items-center gap-4">
              <a href="/salaries" className="hover:text-[#222222] transition-colors">Salaries</a>
              <a href="/compare"  className="hover:text-[#222222] transition-colors">Compare</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
