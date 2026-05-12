// app/help/report-bug/page.tsx
"use client";

import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/Topbar";
import { useReportBug } from "@/app/hooks/useReportBug";

export default function ReportBugPage() {
  const { formData, status, errorMessage, handleChange, handleSubmit, reset } =
    useReportBug();

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
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <div
              className="mb-6 flex items-center gap-2 text-sm"
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
              <span style={{ color: "var(--text-primary)" }}>Report a Bug</span>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "#ef4444",
                  color: "#ef4444",
                }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Bug Report
              </div>
              <h1
                className="mb-3 text-3xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: "var(--text-primary)",
                }}>
                Report a Bug
              </h1>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>
                Found something broken? Let us know and we'll fix it as quickly
                as possible. Please provide as much detail as you can.
              </p>
            </div>

            {/* Success Message */}
            {status === "success" && (
              <div className="mb-6 rounded-xl border border-green-500/50 bg-green-500/10 p-5">
                <div className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      Bug report submitted!
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Thank you for helping us improve. We'll look into this and
                      get back to you if we need more information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {status === "error" && (
              <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-5">
                <div className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      Failed to send report
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {errorMessage}
                    </p>
                    <button
                      onClick={reset}
                      className="mt-3 text-sm text-red-600 underline hover:no-underline">
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            {status !== "success" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <div
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  <h2
                    className="mb-4 text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    Your Contact Info
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bug Details */}
                <div
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  <h2
                    className="mb-4 text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    Bug Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Bug Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="e.g., Dashboard charts not loading"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Description *
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={3}
                        placeholder="What happened? What were you trying to do?"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Steps to Reproduce *
                      </label>
                      <textarea
                        name="steps"
                        required
                        rows={3}
                        placeholder="1. Go to Dashboard&#10;2. Click on Analytics tab&#10;3. Select a date range&#10;4. See error"
                        value={formData.steps}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          className="mb-1 block text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}>
                          What should have happened? *
                        </label>
                        <textarea
                          name="expected"
                          required
                          rows={2}
                          placeholder="Expected behavior..."
                          value={formData.expected}
                          onChange={handleChange}
                          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: "var(--bg-base)",
                            borderColor: "var(--border)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-1 block text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}>
                          What actually happened? *
                        </label>
                        <textarea
                          name="actual"
                          required
                          rows={2}
                          placeholder="Actual behavior..."
                          value={formData.actual}
                          onChange={handleChange}
                          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: "var(--bg-base)",
                            borderColor: "var(--border)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}>
                        <option value="low">
                          Low - Minor issue, doesn&apos;t affect functionality
                        </option>
                        <option value="medium">
                          Medium - Affects some features but has workaround
                        </option>
                        <option value="high">
                          High - Major feature broken, no workaround
                        </option>
                        <option value="critical">
                          Critical - App crashes or data loss
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Environment */}
                <div
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  <h2
                    className="mb-4 text-lg font-semibold"
                    style={{ color: "var(--text-primary)" }}>
                    Environment (Optional but Helpful)
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Browser
                      </label>
                      <input
                        type="text"
                        name="browser"
                        placeholder="e.g., Chrome 120, Safari 17"
                        value={formData.browser}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Operating System
                      </label>
                      <input
                        type="text"
                        name="os"
                        placeholder="e.g., Windows 11, macOS Sonoma"
                        value={formData.os}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className="mb-1 block text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}>
                        Page URL where bug occurred
                      </label>
                      <input
                        type="text"
                        name="url"
                        placeholder="https://your-app.com/dashboard"
                        value={formData.url}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: "var(--bg-base)",
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 rounded-lg px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#ef4444" }}>
                    {status === "loading" ?
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sending...
                      </span>
                    : "Submit Bug Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
