// app/components/TopBar.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  useNotifications,
  type AppNotification,
} from "@/app/hooks/useNotifications";
import { useRouter } from "next/navigation";

interface TopBarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const typeIcon = {
  info: (
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  success: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
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
};

const typeColors = {
  info: { bg: "#EFF6FF", icon: "#3B82F6", border: "#BFDBFE" },
  success: { bg: "#F0FDF4", icon: "#22C55E", border: "#BBF7D0" },
  warning: { bg: "#FFF7ED", icon: "#E8610A", border: "#FED7AA" },
};

function timeAgo(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString();
}

export default function TopBar({
  searchQuery = "",
  onSearchChange,
}: TopBarProps) {
  const { notifications, loading, markAllRead, dismiss } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleBellClick() {
    if (!isOpen) {
      markAllRead();
    }
    setIsOpen((prev) => !prev);
  }

  function handleNotificationClick(n: AppNotification) {
    if (n.projectId) {
      router.push(`/project/${n.projectId}`);
      setIsOpen(false);
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-8 md:py-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}>
      {/* Search */}
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
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-[#E8610A] placeholder:text-[var(--text-muted)]"
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

      {/* Desktop: bell + Add Project */}
      <div className="hidden md:flex shrink-0 items-center gap-3">
        <div className="relative">
          <button
            ref={bellRef}
            onClick={handleBellClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
            style={{
              borderColor: isOpen ? "#F5C89A" : "var(--border)",
              backgroundColor: isOpen ? "#FEF0E7" : "var(--bg-base)",
              color: isOpen ? "#E8610A" : "var(--text-secondary)",
            }}
            aria-label="Notifications"
            aria-expanded={isOpen}>
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

            {!loading && hasUnread && (
              <span
                className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8610A] text-[9px] font-bold text-white"
                style={{ boxShadow: "0 0 0 2px var(--bg-card)" }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div
              ref={panelRef}
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 340,
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                zIndex: 50,
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transform:
                  visible ?
                    "translateY(0) scale(1)"
                  : "translateY(-8px) scale(0.97)",
                transition: "opacity 180ms ease, transform 180ms ease",
                transformOrigin: "top right",
              }}>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px 12px",
                  borderBottom: "1px solid var(--border)",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-primary)",
                    }}>
                    Notifications
                  </span>
                  {notifications.length > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        backgroundColor: "var(--bg-base)",
                        border: "1px solid var(--border)",
                        borderRadius: 20,
                        padding: "1px 7px",
                      }}>
                      {notifications.length}
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <button
                    onClick={markAllRead}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#E8610A",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: 6,
                    }}>
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {loading ?
                  <div
                    style={{
                      padding: "24px 16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "var(--text-muted)",
                    }}>
                    Loading…
                  </div>
                : notifications.length === 0 ?
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "36px 16px",
                      gap: 10,
                    }}>
                    <div style={{ color: "var(--text-muted)", opacity: 0.4 }}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        margin: 0,
                      }}>
                      You're all caught up!
                    </p>
                  </div>
                : notifications.map((n) => {
                    const colors = typeColors[n.type] ?? typeColors.info;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          display: "flex",
                          gap: 10,
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--border)",
                          backgroundColor:
                            n.read ? "transparent" : "rgba(232, 97, 10, 0.03)",
                          cursor: n.projectId ? "pointer" : "default",
                          position: "relative",
                          transition: "background-color 0.15s",
                        }}>
                        {!n.read && (
                          <span
                            style={{
                              position: "absolute",
                              left: 6,
                              top: "50%",
                              transform: "translateY(-50%)",
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              backgroundColor: "#E8610A",
                            }}
                          />
                        )}
                        <div
                          style={{
                            flexShrink: 0,
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: colors.icon,
                            marginTop: 1,
                          }}>
                          {typeIcon[n.type]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 6,
                            }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                fontWeight: n.read ? 500 : 600,
                                color: "var(--text-primary)",
                                lineHeight: 1.3,
                              }}>
                              {n.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismiss(n.id);
                              }}
                              aria-label="Dismiss"
                              style={{
                                flexShrink: 0,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                                padding: 2,
                                borderRadius: 4,
                                display: "flex",
                                opacity: 0.5,
                              }}>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                          <p
                            style={{
                              margin: "2px 0 4px",
                              fontSize: 12,
                              color: "var(--text-muted)",
                              lineHeight: 1.4,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}>
                            {n.message}
                          </p>
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              opacity: 0.7,
                            }}>
                            {timeAgo(n.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                }
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{ padding: "10px 16px" }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--bg-base)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--bg-card)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--bg-base)")
                    }>
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
