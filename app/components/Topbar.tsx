"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-8 md:py-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}>
      <div className="relative min-w-0 flex-1 md:max-w-sm">
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search projects, tasks…"
          className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[#E8610A]"
          style={{
            backgroundColor: "var(--bg-base)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-card)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--bg-base)")
          }
        />
        <kbd
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:block"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-muted)",
          }}>
          ⌘K
        </kbd>
      </div>

      {/* Desktop only: bell + Add Project */}
      <div className="hidden md:flex shrink-0 items-center gap-3">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-secondary)",
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E8610A]"
            style={{ boxShadow: "0 0 0 2px var(--bg-card)" }}
          />
        </button>

        <Link
          href="/AddProjectPage"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#E8610A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508] active:scale-[0.987]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add Project</span>
        </Link>
      </div>
    </div>
  );
}
