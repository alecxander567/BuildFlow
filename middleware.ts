// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Firebase auth is client-side only (localStorage/IndexedDB).
  // Middleware cannot verify Firebase sessions without Firebase Admin SDK.
  // Auth redirects are handled client-side in each page via useEffect.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"],
};
