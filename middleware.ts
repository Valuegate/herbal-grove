
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/forgotpassword",
  "/dashboard(.*)",
  "/consultants(.*)",
  "/researchlibrary(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};


// Clerk middleware is commented out while backend auth is not implemented.
// Export a harmless no-op middleware so Next.js does not error about missing exports.
// import { NextResponse } from "next/server";

// export default function middleware() {
//   return NextResponse.next();
// }
