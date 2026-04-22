"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

const navItems = [
  {
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
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    label: "Dashboard",
    active: true,
  },
  {
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
    label: "Projects",
    badge: "12",
  },
  {
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
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    label: "Tasks",
  },
  {
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    label: "Team",
  },
  {
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
    label: "Analytics",
  },
  {
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
    label: "Tool Hub",
  },
];

const bottomItems = [
  {
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
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    label: "Settings",
  },
  {
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
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: "Help",
  },
];

const SignOutIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function NavList({ onClose }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#B0ADA7]">
        Main
      </p>
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={onClose}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            item.active ?
              "bg-[#FEF0E7] text-[#E8610A]"
            : "text-[#72706A] hover:bg-[#F2EDE7] hover:text-[#1A1916]"
          }`}>
          <span className={item.active ? "text-[#E8610A]" : "text-[#B0ADA7]"}>
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="rounded-full bg-[#E8610A] px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
              {item.badge}
            </span>
          )}
        </button>
      ))}

      <div className="mt-3 pt-3 border-t border-[#EDE8E2]">
        <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Support
        </p>
        {bottomItems.map((item) => (
          <button
            key={item.label}
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#F2EDE7] hover:text-[#1A1916]">
            <span className="text-[#B0ADA7]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logOut, loading } = useAuth();

  return (
    <>
      <aside className="hidden md:flex h-screen w-[220px] shrink-0 flex-col border-r border-[#EDE8E2] bg-[#F9F7F4]">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#EDE8E2]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8610A]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <span
            className="text-base font-bold tracking-tight text-[#1A1916]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            BuildFlow
          </span>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4 overflow-y-auto">
          <NavList onClose={() => {}} />
        </nav>

        <div className="border-t border-[#EDE8E2] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8610A] text-xs font-bold text-white">
              JK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1A1916]">
                James Kim
              </p>
              <p className="truncate text-[11px] text-[#B0ADA7]">
                james@buildflow.io
              </p>
            </div>
            <button
              onClick={logOut}
              disabled={loading}
              title="Sign out"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#E8610A] transition-colors hover:bg-[#FEF0E7] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              <SignOutIcon />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#EDE8E2] bg-[#F9F7F4] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E8610A]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <span
            className="text-sm font-bold tracking-tight text-[#1A1916]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            BuildFlow
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E4DE] bg-white text-[#72706A] transition-colors hover:bg-[#FEF0E7] hover:text-[#E8610A]"
          aria-label="Toggle menu">
          {mobileOpen ?
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          : <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          }
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed top-[53px] left-0 right-0 z-40 max-h-[calc(100vh-53px)] overflow-y-auto border-b border-[#EDE8E2] bg-[#F9F7F4] px-3 py-3 shadow-xl">
            <NavList onClose={() => setMobileOpen(false)} />
            <div className="mt-3 border-t border-[#EDE8E2] pt-3 px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8610A] text-xs font-bold text-white">
                  JK
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#1A1916]">
                    James Kim
                  </p>
                  <p className="truncate text-[11px] text-[#B0ADA7]">
                    james@buildflow.io
                  </p>
                </div>
                <button
                  onClick={logOut}
                  disabled={loading}
                  title="Sign out"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#E8610A] transition-colors hover:bg-[#FEF0E7] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SignOutIcon />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
