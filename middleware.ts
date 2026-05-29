// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages only logged-OUT users can visit
const AUTH_ONLY_ROUTES = ["/", "/login", "/signup"];

// All protected routes from the sidebar + app pages
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/projects",
  "/achievements",
  "/team",
  "/analytics",
  "/tools",
  "/settings",
  "/help",
  "/AddProjectPage",
  "/project", // individual project pages e.g. /project/[id]
  "/profile",
  "/workspace",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always pass through Next.js internals, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("session")?.value ||
    request.cookies.get("__session")?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // No session + protected page → force to login, no back button bypass
  if (!sessionCookie && isProtected) {
    const url = new URL("/", request.url);
    url.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(url);
    // Clear any stale cookies just in case
    response.cookies.set("session", "", { maxAge: 0, path: "/" });
    response.cookies.set("__session", "", { maxAge: 0, path: "/" });
    return response;
  }

  // Has session + on login/signup → send straight to dashboard
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets and image optimization
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
