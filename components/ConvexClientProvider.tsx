"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
// Convex + Clerk integration commented out while auth is disabled
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { useAuth } from "@clerk/nextjs";
import { ConvexProvider } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Temporarily use plain ConvexProvider while Clerk is commented out.
    <ConvexProvider client={convex}>{children}</ConvexProvider>
    /*
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
    */
  );
}
