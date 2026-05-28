// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("firebase-auth-token")?.value;
  const isAuthenticated = !!token;
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Define protected routes (all routes that start with these paths)
  const protectedPaths = [
    "/dashboard",
    "/projects",
    "/achievements",
    "/team",
    "/analytics",
    "/tools",
    "/settings",
    "/help",
  ];
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // If authenticated and trying to access public routes (like login page)
  if (isAuthenticated && isPublicRoute) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If not authenticated and trying to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (if you have any)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
