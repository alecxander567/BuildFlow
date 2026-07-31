import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/", "/signup", "/help", "/ForgotPasswordPage"];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  // If the route is protected and there's no session cookie, redirect to login
  if (!isPublicRoute(pathname) && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add no-cache headers to prevent bfcache restoration after logout.
  // When the user hits Back, the browser re-validates with the server
  // instead of showing a stale cached copy.
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for:
    // - API routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, sitemap.xml, robots.txt (metadata files)
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};