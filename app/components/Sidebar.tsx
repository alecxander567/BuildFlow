"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useAchievements } from "@/app/hooks/useAchievements";

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
    href: "/dashboard",
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
    href: "/projects",
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
        <path d="M6 9H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h.5" />
        <path d="M18 9h2a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-.5" />
        <path d="M6 3h12v10a6 6 0 0 1-12 0V3z" />
        <path d="M9 21h6" />
        <path d="M12 17v4" />
      </svg>
    ),
    label: "Achievements",
    href: "/achievements",
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
    href: "/team",
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
    href: "/analytics",
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
    href: "/tools",
  },
];

const settingsItem = {
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
  href: "/settings",
};

const helpItem = {
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
  href: "/help",
};

const helpSubItems = [
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Getting Started",
    href: "/help/getting-started",
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
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
    label: "FAQ",
    href: "/help/faq",
  },
  {
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    label: "Report a Bug",
    href: "/help/report-bug",
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

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.2s ease",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const navHover = {
  enter: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    isActive: boolean,
  ) => {
    if (!isActive) {
      const el = e.currentTarget as HTMLElement;
      el.style.backgroundColor = "var(--bg-accent-soft)";
      el.style.color = "var(--accent)";
    }
  },
  leave: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    isActive: boolean,
  ) => {
    if (!isActive) {
      const el = e.currentTarget as HTMLElement;
      el.style.backgroundColor = "transparent";
      el.style.color = "var(--text-secondary)";
    }
  },
};

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { icon: React.ReactNode; label: string; href: string };
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors overflow-visible"
      style={{
        backgroundColor: isActive ? "var(--bg-accent-soft)" : "transparent",
        color: isActive ? "var(--accent)" : "var(--text-secondary)",
      }}
      onMouseEnter={(e) => navHover.enter(e, isActive)}
      onMouseLeave={(e) => navHover.leave(e, isActive)}>
      <span style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}>
        {item.icon}
      </span>
      <span className="flex-1 text-left">{item.label}</span>
    </Link>
  );
}

function HelpNavItem({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const isHelpActive = pathname.startsWith("/help");
  const [open, setOpen] = useState(isHelpActive);

  // Auto-open if navigating to a help sub-page
  useEffect(() => {
    if (isHelpActive) setOpen(true);
  }, [isHelpActive]);

  return (
    <div>
      {/* Help toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
        style={{
          backgroundColor:
            isHelpActive && !open ? "var(--bg-accent-soft)" : "transparent",
          color: isHelpActive ? "var(--accent)" : "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          if (!isHelpActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--bg-accent-soft)";
            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isHelpActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "var(--text-secondary)";
          }
        }}>
        <span
          style={{
            color: isHelpActive ? "var(--accent)" : "var(--text-muted)",
          }}>
          {helpItem.icon}
        </span>
        <span className="flex-1 text-left">{helpItem.label}</span>
        <span
          style={{
            color: isHelpActive ? "var(--accent)" : "var(--text-muted)",
          }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Submenu */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.2s ease",
        }}>
        <div style={{ overflow: "hidden" }}>
          <div
            className="ml-4 mt-0.5 mb-0.5 flex flex-col gap-0.5 border-l pl-3"
            style={{ borderColor: "var(--border)" }}>
            {helpSubItems.map((sub) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor:
                      isSubActive ? "var(--bg-accent-soft)" : "transparent",
                    color:
                      isSubActive ? "var(--accent)" : "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--bg-accent-soft)";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--accent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--text-secondary)";
                    }
                  }}>
                  <span
                    style={{
                      color:
                        isSubActive ? "var(--accent)" : "var(--text-muted)",
                    }}>
                    {sub.icon}
                  </span>
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavList({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const {
    unlockedCount,
    lastViewedAchievements,
    markAchievementsAsViewed,
    refreshAchievements,
    forceSyncAchievements,
    userAchievements,
  } = useAchievements();

  const unviewedCount = Math.max(
    0,
    (unlockedCount || 0) - (lastViewedAchievements || 0),
  );

  useEffect(() => {
    refreshAchievements();
  }, [refreshAchievements]);
  useEffect(() => {
    if (user && unlockedCount === 0 && userAchievements.length === 0)
      forceSyncAchievements();
  }, [user, unlockedCount, userAchievements.length, forceSyncAchievements]);

  return (
    <div className="flex flex-col gap-0.5">
      <p
        className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--text-muted)" }}>
        Main
      </p>

      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const handleClick =
          item.label === "Achievements" ?
            () => {
              if (unviewedCount > 0) markAchievementsAsViewed();
              onClose();
            }
          : onClose;

        return (
          <div key={item.label} className="relative">
            <NavItem item={item} isActive={isActive} onClick={handleClick} />
            {item.label === "Achievements" && unviewedCount > 0 && (
              <div className="absolute -right-2 -top-2 z-50 pointer-events-none">
                <span
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-lg"
                  style={{ outline: "2px solid var(--bg-base)" }}>
                  {unviewedCount > 99 ? "99+" : unviewedCount}
                </span>
              </div>
            )}
          </div>
        );
      })}

      <div
        className="mt-3 pt-3 border-t"
        style={{ borderColor: "var(--border)" }}>
        <p
          className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          Support
        </p>
        <NavItem
          item={settingsItem}
          isActive={pathname === settingsItem.href}
          onClick={onClose}
        />
        <HelpNavItem onClose={onClose} pathname={pathname} />
      </div>
    </div>
  );
}

function UserFooter({
  onSignOut,
  loading,
  user,
}: {
  onSignOut: () => void;
  loading: boolean;
  user: { email?: string | null; displayName?: string | null } | null;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: "var(--accent)" }}>
        {user?.email?.slice(0, 2).toUpperCase() ?? "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-xs font-semibold"
          style={{ color: "var(--text-primary)" }}>
          {user?.displayName ?? user?.email ?? "Unknown"}
        </p>
        <p
          className="truncate text-[11px]"
          style={{ color: "var(--text-muted)" }}>
          {user?.email ?? ""}
        </p>
      </div>
      <button
        onClick={onSignOut}
        disabled={loading}
        title="Sign out"
        className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ color: "var(--accent)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "var(--bg-accent-soft)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor =
            "transparent")
        }>
        <SignOutIcon />
      </button>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logOut, loading, user } = useAuth();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex h-screen w-[220px] shrink-0 flex-col border-r"
        style={{
          backgroundColor: "var(--bg-base)",
          borderColor: "var(--border)",
        }}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-5 py-5 border-b cursor-pointer"
          style={{ borderColor: "var(--border)" }}>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ backgroundColor: "var(--accent)" }}>
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
            className="text-base font-bold tracking-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              color: "var(--text-primary)",
            }}>
            BuildFlow
          </span>
        </Link>

        <nav className="flex flex-1 flex-col px-3 py-4 overflow-y-auto">
          <NavList onClose={() => {}} />
        </nav>

        <div
          className="border-t px-4 py-4"
          style={{ borderColor: "var(--border)" }}>
          <UserFooter onSignOut={logOut} loading={loading} user={user} />
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b px-4 py-3 shadow-sm"
        style={{
          backgroundColor: "var(--bg-base)",
          borderColor: "var(--border)",
        }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px]"
            style={{ backgroundColor: "var(--accent)" }}>
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
            className="text-sm font-bold tracking-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              color: "var(--text-primary)",
            }}>
            BuildFlow
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/AddProjectPage"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-colors active:scale-[0.987]"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--accent)")
            }>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </Link>

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
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
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
              style={{
                backgroundColor: "var(--accent)",
                outline: "2px solid var(--bg-base)",
              }}
            />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
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
      </div>

      {/* ── Mobile nav drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="md:hidden fixed top-[53px] left-0 right-0 z-40 max-h-[calc(100vh-53px)] overflow-y-auto border-b px-3 py-3 shadow-xl"
            style={{
              backgroundColor: "var(--bg-base)",
              borderColor: "var(--border)",
            }}>
            <NavList onClose={() => setMobileOpen(false)} />
            <div
              className="mt-3 border-t pt-3 px-2"
              style={{ borderColor: "var(--border)" }}>
              <UserFooter onSignOut={logOut} loading={loading} user={user} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
