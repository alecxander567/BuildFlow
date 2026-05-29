// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; 

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, idToken, {
      httpOnly: true,
      // ✅ KEY FIX: secure:false in dev so mobile on local network can store it
      // secure:true in prod (HTTPS only)
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const isProd = process.env.NODE_ENV === "production";
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
