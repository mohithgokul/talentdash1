import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[#222222]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#222222]">Page not found</h2>
        <p className="mt-2 text-sm text-[#717171]">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-md bg-[#FF5A5F] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-[#222222]">This page didn't load</h1>
        <p className="mt-2 text-sm text-[#717171]">Something went wrong. Try again, or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-[#FF5A5F] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >Try again</button>
          <a href="/" className="rounded-md border border-[#EBEBEB] bg-white px-4 py-2 text-sm font-medium text-[#222222] hover:bg-[#F2F2F2]">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TalentDash — Compensation Intelligence for Tech" },
      { name: "description", content: "Verified salary data for tech roles across India and global markets. Compare offers, levels, and total compensation." },
      { name: "author", content: "TalentDash" },
      { property: "og:title", content: "TalentDash — Compensation Intelligence for Tech" },
      { property: "og:description", content: "Structured salary data. Comparable. Decision-ready." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "TalentDash" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "TalentDash",
          description: "Compensation intelligence platform for tech professionals in India and globally.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EBEBEB] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-sm bg-[#FF5A5F]" aria-hidden />
          <span className="text-[18px] font-bold tracking-tight text-[#222222]">TalentDash</span>
        </Link>
        <nav className="flex items-center gap-1 text-[14px]">
          <Link to="/" className="rounded px-3 py-1.5 text-[#484848] hover:bg-[#F2F2F2]" activeOptions={{ exact: true }} activeProps={{ className: "rounded px-3 py-1.5 text-[#222222] font-semibold bg-[#F2F2F2]" }}>Home</Link>
          <Link to="/salaries" className="rounded px-3 py-1.5 text-[#484848] hover:bg-[#F2F2F2]" activeProps={{ className: "rounded px-3 py-1.5 text-[#222222] font-semibold bg-[#F2F2F2]" }}>Salaries</Link>
          <Link to="/compare" className="rounded px-3 py-1.5 text-[#484848] hover:bg-[#F2F2F2]" activeProps={{ className: "rounded px-3 py-1.5 text-[#222222] font-semibold bg-[#F2F2F2]" }}>Compare</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#EBEBEB] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 text-[13px] text-[#717171]">
        © {new Date().getFullYear()} TalentDash. Structured data → Comparable → Decision-ready.
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-[#F7F7F7]">
        <Header />
        <main className="page-fade flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
