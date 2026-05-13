// app/api/cron/daily-reminders/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET_KEY;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Call the daily notifications endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/daily-notifications`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
