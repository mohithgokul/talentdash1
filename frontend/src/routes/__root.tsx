import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Sidebar, MobileTabBar, MobileTopBar } from "../components/layout/Sidebar";

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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
      <div className="min-h-screen bg-[#F7F7F7]">
        <Sidebar />
        <MobileTopBar />
        <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden md:ml-[220px]">
          <main className="page-fade flex-1 pb-16 md:pb-0">
            <Outlet />
          </main>
          <Footer />
        </div>
        <MobileTabBar />
      </div>
    </QueryClientProvider>
  );
}
