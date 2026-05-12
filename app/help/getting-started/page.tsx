// app/help/getting-started/page.tsx
"use client";

import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/Topbar";

const steps = [
  {
    number: 1,
    label: "Account",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: 2,
    label: "Project",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: 3,
    label: "Tools",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    number: 4,
    label: "Analytics",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    number: 5,
    label: "AI Chatbot",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

function StepIcon({ number }: { number: number }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
      style={{ backgroundColor: "var(--accent)" }}>
      {number}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}>
      {children}
    </div>
  );
}

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 text-sm"
      style={{
        backgroundColor: "var(--bg-accent-soft)",
        borderColor: "var(--accent)",
        color: "var(--text-secondary)",
      }}>
      <span style={{ color: "var(--accent)" }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function GettingStartedPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-3xl flex flex-col gap-5 md:gap-7">
            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-muted)" }}>
              <Link
                href="/help"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}>
                Help
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--text-primary)" }}>
                Getting Started
              </span>
            </div>

            {/* Header */}
            <div>
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  backgroundColor: "var(--bg-accent-soft)",
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                ~10 min read
              </div>
              <h1
                className="mb-3 text-3xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: "var(--text-primary)",
                }}>
                Getting Started with BuildFlow
              </h1>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>
                Set up your account, create your first project, connect tools,
                explore analytics, and use our AI chatbot &mdash; all in under
                10 minutes.
              </p>
            </div>

            {/* Progress steps */}
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                What you&apos;ll learn
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
                      style={{
                        backgroundColor: "var(--bg-accent-soft)",
                        color: "var(--accent)",
                      }}>
                      <span>{step.icon}</span>
                      <span>{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ color: "var(--text-muted)" }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <StepIcon number={1} />
                <h2
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "var(--text-primary)",
                  }}>
                  Create &amp; Set Up Your Account
                </h2>
              </div>
              <div className="ml-[52px] flex flex-col gap-3">
                <Card>
                  <p
                    className="mb-3 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    📧 Sign up
                  </p>
                  <p
                    className="mb-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    Go to{" "}
                    <Link
                      href="/signup"
                      className="font-medium underline"
                      style={{ color: "var(--accent)" }}>
                      /signup
                    </Link>{" "}
                    and enter:
                  </p>
                  <ul
                    className="flex flex-col gap-1.5 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    {[
                      "Your email address",
                      "Password (minimum 6 characters)",
                      "Confirm password",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
                <TipBox>
                  Your display name is set automatically from your email. You
                  can also sign up instantly using <strong>Google</strong> or{" "}
                  <strong>GitHub</strong>.
                </TipBox>
              </div>
            </section>

            {/* Step 2 */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <StepIcon number={2} />
                <h2
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "var(--text-primary)",
                  }}>
                  Add Your First Project
                </h2>
              </div>
              <div className="ml-[52px] flex flex-col gap-3">
                <Card>
                  <p
                    className="mb-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    From your dashboard, click the{" "}
                    <span
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "#fff",
                      }}>
                      + New Project
                    </span>{" "}
                    button and fill in:
                  </p>
                  <ul
                    className="flex flex-col gap-1.5 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    {[
                      "Project name",
                      "Project description (optional)",
                      "Project type (e.g. Engineering, Research, Business…)",
                      "Priority — High, Moderate, or Low",
                      "Image URL and project URL (optional)",
                      "Start and end dates",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
                <TipBox>
                  <strong>Tip:</strong> Progress is calculated automatically
                  based on tasks you complete in the daily plan. The more tasks
                  you add and check off, the higher your project progress.
                </TipBox>
              </div>
            </section>

            {/* Step 3 */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <StepIcon number={3} />
                <h2
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "var(--text-primary)",
                  }}>
                  Set Up Your Tool Hub
                </h2>
              </div>
              <div className="ml-[52px] flex flex-col gap-3">
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}>
                  Navigate to{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    Tool Hub
                  </span>{" "}
                  in the sidebar to build your personal tool catalog. You
                  organize everything yourself — no preset integrations.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Card>
                    <p
                      className="mb-3 text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}>
                      📁 Create a category
                    </p>
                    <ol
                      className="flex flex-col gap-1.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}>
                      {[
                        'Click "Add Category"',
                        'Enter a category name (e.g. "Design", "DevOps")',
                        "Save to create it",
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
                            style={{ backgroundColor: "var(--accent)" }}>
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </Card>
                  <Card>
                    <p
                      className="mb-3 text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}>
                      🔧 Add tools to a category
                    </p>
                    <ol
                      className="flex flex-col gap-1.5 text-sm"
                      style={{ color: "var(--text-secondary)" }}>
                      {[
                        "Open a category",
                        'Click "Add Tool" and enter the tool name',
                        "Rename or delete tools and categories anytime",
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
                            style={{ backgroundColor: "var(--accent)" }}>
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </Card>
                </div>
                <TipBox>
                  Tools you add here can be linked to your projects via{" "}
                  <strong>selectedTools</strong> when creating or editing a
                  project. Each unique tool you add counts toward your
                  achievements.
                </TipBox>
              </div>
            </section>

            {/* Step 4 */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <StepIcon number={4} />
                <h2
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "var(--text-primary)",
                  }}>
                  Navigate to Analytics
                </h2>
              </div>
              <div className="ml-[52px] flex flex-col gap-3">
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}>
                  Click{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    Analytics
                  </span>{" "}
                  in the left sidebar to view real-time metrics for your
                  projects. Use the time range filter at the top to scope data
                  to the last week, month, or all time.
                </p>

                {/* Time range filter */}
                <Card>
                  <p
                    className="mb-3 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    🗓 Time range filter
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["All time", "Last month", "Last week"].map((label) => (
                      <span
                        key={label}
                        className="rounded-full border px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--bg-accent-soft)",
                          borderColor: "var(--accent)",
                          color: "var(--accent)",
                        }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Metrics grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      title: "Productivity metrics",
                      desc: "Total, completed, in-progress, and not-started project counts — plus overall progress % and task completion rate",
                    },
                    {
                      title: "Productivity score",
                      desc: "Weighted score: 40% project completion, 30% task rate, 20% project volume, 10% achievements unlocked",
                    },
                    {
                      title: "Tool analytics",
                      desc: "Top 5 most-used tools and usage breakdown by category across your projects",
                    },
                    {
                      title: "Achievement stats",
                      desc: "Total points earned and number of achievements unlocked out of all available",
                    },
                  ].map((item) => (
                    <Card key={item.title}>
                      <p
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}>
                        {item.title}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}>
                        {item.desc}
                      </p>
                    </Card>
                  ))}
                </div>

                <TipBox>
                  Analytics only counts projects belonging to your account. Tool
                  usage is tracked from the <strong>selectedTools</strong> on
                  each project — the more tools you link to your projects, the
                  richer your category breakdown becomes.
                </TipBox>
              </div>
            </section>

            {/* Step 5 */}
            <section className="pb-10">
              <div className="mb-5 flex items-center gap-3">
                <StepIcon number={5} />
                <h2
                  className="text-xl font-semibold"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "var(--text-primary)",
                  }}>
                  Use the AI Chatbot
                </h2>
              </div>
              <div className="ml-[52px] flex flex-col gap-3">
                <Card>
                  <p
                    className="mb-1 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    🤖 Where to find it
                  </p>
                  <p
                    className="mb-4 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    Click the chat icon in the bottom-right corner of any page
                    to open the assistant.
                  </p>
                  <p
                    className="mb-3 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    💬 Try asking:
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      "How do I add team members to my project?",
                      "Can you help me plan with my current project?",
                      "What are the best tech stack to use?",
                      "Create a new task for the design team",
                    ].map((q) => (
                      <div
                        key={q}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-secondary)",
                        }}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ color: "var(--accent)", flexShrink: 0 }}>
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        &ldquo;{q}&rdquo;
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
