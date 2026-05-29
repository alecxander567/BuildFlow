// middleware.ts
// Keeping middleware minimal — auth protection is handled client-side
// via useAuth + useEffect redirects in each page. This avoids cookie
// timing issues on mobile browsers in development.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
