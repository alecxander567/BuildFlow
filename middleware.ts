// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ONLY_ROUTES = ["/", "/login", "/signup"];

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
  "/project",
  "/profile",
  "/workspace",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("session")?.value ||
    request.cookies.get("__session")?.value ||
    "";

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ONLY_ROUTES.includes(pathname);

  if (!sessionCookie && isProtected) {
    const url = new URL("/", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // IMPORTANT: only redirect if we are NOT already going to /dashboard
  // to prevent redirect loops on slow mobile connections
  if (sessionCookie && isAuthRoute && pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
