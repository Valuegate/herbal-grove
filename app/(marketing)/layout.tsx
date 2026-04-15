import type { ReactNode } from "react";

/**
 * Marketing layout — wraps all public-facing marketing pages.
 * Keeps marketing pages isolated from the authenticated app layout.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
