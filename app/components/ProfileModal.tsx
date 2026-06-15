"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { useAchievements } from "@/app/hooks/useAchievements";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  default: { bg: "#FEF0E7", text: "#E8610A", border: "#F5C89A" },
  a: { bg: "#EFF6FF", text: "#3B82F6", border: "#BFDBFE" },
  b: { bg: "#F0FDF4", text: "#22C55E", border: "#BBF7D0" },
  c: { bg: "#FDF4FF", text: "#A855F7", border: "#E9D5FF" },
  d: { bg: "#FFF7ED", text: "#F59E0B", border: "#FDE68A" },
};

const colorKeys = ["default", "a", "b", "c", "d"];

function getColor(index: number) {
  return categoryColors[colorKeys[index % colorKeys.length]];
}

export default function ProfileModal({
  isOpen,
  onClose,
  anchorRef,
}: ProfileModalProps) {
  const { user } = useAuth();
  const { toolAnalytics, productivityMetrics, productivityScore, isLoading } =
    useAnalytics();
  const { unlockedCount, totalAchievements } = useAchievements();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "?";
  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  const email = user?.email ?? "";
  const topTools = toolAnalytics.topTools.slice(0, 5);

  return (
    <div
      ref={modalRef}
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: 0,
        width: 300,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)",
        zIndex: 100,
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Profile">
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
          }}>
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {displayName}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {email}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            padding: 4,
            borderRadius: 6,
            flexShrink: 0,
          }}
          aria-label="Close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: "1px solid var(--border)",
        }}>
        {[
          { label: "Projects", value: productivityMetrics.totalProjects },
          {
            label: "Achievements",
            value: `${unlockedCount}/${totalAchievements}`,
          },
          { label: "Score", value: `${productivityScore}%` },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: "12px 8px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid var(--border)" : "none",
            }}>
            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}>
              {isLoading ? "—" : stat.value}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 10,
                color: "var(--text-muted)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Most used tools */}
      <div style={{ padding: "14px 16px" }}>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
          Most Used Tools
        </p>

        {isLoading ?
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "12px 0",
            }}>
            Loading…
          </div>
        : topTools.length === 0 ?
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "12px 0",
            }}>
            No tools added yet
          </div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {topTools.map((tool, i) => {
              const color = getColor(i);
              const maxCount = topTools[0].count;
              const barWidth = maxCount > 0 ? (tool.count / maxCount) * 100 : 0;

              return (
                <div key={tool.name}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 3,
                    }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          width: 14,
                          textAlign: "right",
                        }}>
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}>
                        {tool.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: color.text,
                          backgroundColor: color.bg,
                          border: `1px solid ${color.border}`,
                          borderRadius: 20,
                          padding: "1px 6px",
                        }}>
                        {tool.category}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                      }}>
                      {tool.count}x
                    </span>
                  </div>
                  {/* Bar */}
                  <div
                    style={{
                      height: 3,
                      borderRadius: 99,
                      backgroundColor: "var(--bg-base)",
                      marginLeft: 21,
                      overflow: "hidden",
                    }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        borderRadius: 99,
                        backgroundColor: color.text,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>

      {/* Task completion footer */}
      <div
        style={{
          padding: "10px 16px 14px",
          borderTop: "1px solid var(--border)",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontWeight: 500,
            }}>
            Task completion
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}>
            {isLoading ? "—" : `${productivityMetrics.taskCompletionRate}%`}
          </span>
        </div>
        <div
          style={{
            height: 5,
            borderRadius: 99,
            backgroundColor: "var(--bg-base)",
            overflow: "hidden",
          }}>
          <div
            style={{
              height: "100%",
              width:
                isLoading ? "0%" : `${productivityMetrics.taskCompletionRate}%`,
              borderRadius: 99,
              backgroundColor: "#E8610A",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
