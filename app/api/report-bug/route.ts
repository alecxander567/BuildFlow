// app/api/report-bug/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Light theme tokens — mirrors :root in globals.css (hardcoded for email clients)
const t = {
  // backgrounds
  bgBase: "#f9f7f4", 
  bgCard: "#ffffff", 
  bgHover: "#f2ede7", 
  bgAccentSoft: "#fef0e7", 
  // borders
  border: "#ede8e2",
  borderDashed: "#d6d1ca", 
  divide: "#f2ede7", 
  // text
  textPrimary: "#1a1916", 
  textSecondary: "#72706a", 
  textMuted: "#b0ada7", 
  // accent
  accent: "#e8610a", 
  accentHover: "#d15508",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      title,
      description,
      steps,
      expected,
      actual,
      priority,
      browser,
      os,
      url,
    } = body;

    if (
      !name ||
      !email ||
      !title ||
      !description ||
      !steps ||
      !expected ||
      !actual
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const priorityLabel = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };

    const prioritySubtext = {
      low: "Minor issue, low impact",
      medium: "Affects features",
      high: "Major feature broken",
      critical: "App crashes or data loss",
    };

    const priorityColors = {
      low: {
        bg: "#f0fdf4",
        border: "#86efac",
        dot: "#22c55e",
        text: "#166534",
      },
      medium: {
        bg: "#fffbeb",
        border: "#fcd34d",
        dot: "#f59e0b",
        text: "#92400e",
      },
      high: {
        bg: "#fff7ed",
        border: "#fdba74",
        dot: "#f97316",
        text: "#9a3412",
      },
      critical: {
        bg: "#fef2f2",
        border: "#fca5a5",
        dot: "#ef4444",
        text: "#991b1b",
      },
    };

    const pc =
      priorityColors[priority as keyof typeof priorityColors] ??
      priorityColors.medium;

    const pl =
      priorityLabel[priority as keyof typeof priorityLabel] ?? "Medium";
    const ps = prioritySubtext[priority as keyof typeof prioritySubtext] ?? "";

    const divider = `
      <tr>
        <td style="padding:0 0 24px;">
          <div style="height:1px;background:${t.border};"></div>
        </td>
      </tr>
    `;

    const field = (label: string, value: string) => `
      <tr>
        <td style="padding:0 0 20px;">
          <p style="margin:0 0 6px;font-size:10.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${t.textMuted};">${label}</p>
          <p style="margin:0;font-size:14px;line-height:1.75;color:${t.textSecondary};">${value.replace(/\n/g, "<br>")}</p>
        </td>
      </tr>
    `;

    const envRow = (label: string, value: string) => `
      <tr>
        <td width="110" style="padding:0 0 8px;font-size:12px;font-weight:600;color:${t.textPrimary};vertical-align:top;">${label}</td>
        <td style="padding:0 0 8px;font-size:12px;color:${t.textSecondary};vertical-align:top;">${value}</td>
      </tr>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bug Report</title>
      </head>
      <body style="margin:0;padding:0;background:${t.bgBase};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background:${t.bgBase};padding:48px 16px;">
          <tr><td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

              <!-- Header bar -->
              <tr>
                <td style="background:${t.accent};border-radius:12px 12px 0 0;padding:28px 36px 24px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.6);">BuildFlow · Bug Report</p>
                  <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff;line-height:1.35;">${title}</h1>
                </td>
              </tr>

              <!-- Priority strip -->
              <tr>
                <td style="background:${pc.bg};border-left:1px solid ${t.border};border-right:1px solid ${t.border};border-bottom:1px solid ${pc.border};padding:12px 36px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="width:8px;height:8px;border-radius:50%;background:${pc.dot};display:inline-block;margin-right:10px;vertical-align:middle;"></div>
                      </td>
                      <td style="vertical-align:middle;">
                        <span style="font-size:13px;font-weight:600;color:${pc.text};">${pl} Priority</span>
                        <span style="font-size:12px;color:${t.textMuted};margin-left:8px;">${ps}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:${t.bgCard};padding:32px 36px;border-left:1px solid ${t.border};border-right:1px solid ${t.border};">

                  <!-- Reporter -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;background:${t.bgBase};border:1px solid ${t.border};border-radius:8px;">
                    <tr>
                      <td style="padding:14px 18px;">
                        <p style="margin:0 0 2px;font-size:10.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${t.textMuted};">Reported by</p>
                        <p style="margin:0;font-size:14px;font-weight:600;color:${t.textPrimary};">${name}</p>
                        <p style="margin:2px 0 0;font-size:13px;color:${t.textSecondary};">${email}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Fields -->
                  <table cellpadding="0" cellspacing="0" width="100%">
                    ${field("Description", description)}
                    ${divider}
                    ${field("Steps to Reproduce", steps)}
                    ${divider}
                    ${field("Expected Behavior", expected)}
                    ${field("Actual Behavior", actual)}
                  </table>

                  ${
                    browser || os || url ?
                      `
                  <!-- Environment -->
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:4px;background:${t.bgBase};border:1px solid ${t.border};border-radius:8px;">
                    <tr>
                      <td style="padding:14px 18px;">
                        <p style="margin:0 0 12px;font-size:10.5px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${t.textMuted};">Environment</p>
                        <table cellpadding="0" cellspacing="0" width="100%">
                          ${browser ? envRow("Browser", browser) : ""}
                          ${os ? envRow("OS", os) : ""}
                          ${url ? envRow("URL", `<span style="color:${t.accent};">${url}</span>`) : ""}
                        </table>
                      </td>
                    </tr>
                  </table>
                  `
                    : ""
                  }

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:${t.bgBase};border:1px solid ${t.border};border-top:none;border-radius:0 0 12px 12px;padding:16px 36px;text-align:center;">
                  <p style="margin:0;font-size:11.5px;color:${t.textMuted};line-height:1.6;">
                    Submitted via the BuildFlow help center &nbsp;&middot;&nbsp; Reply to respond directly to ${name}
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>

      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Bug Report <onboarding@resend.dev>",
      to: ["alecxanderespaldon21@gmail.com"],
      replyTo: email,
      subject: `[Bug] ${title}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Bug report sent successfully", id: data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
