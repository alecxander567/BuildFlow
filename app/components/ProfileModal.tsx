"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/app/hooks/useAuth";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { useAchievements } from "@/app/hooks/useAchievements";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// ─── shared types ────────────────────────────────────────────────────────────

interface ToolStat {
  name: string;
  count: number;
  category: string;
}

interface ProfileData {
  displayName: string;
  email: string;
  totalProjects: number;
  taskCompletionRate: number;
  topTools: ToolStat[];
  // only present for self-view
  unlockedCount?: number;
  totalAchievements?: number;
  productivityScore?: number;
}

// ─── shared UI helpers ───────────────────────────────────────────────────────

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

// ─── Firestore loader for OTHER users ────────────────────────────────────────

async function loadUserProfileByEmail(email: string): Promise<ProfileData> {
  const usersSnap = await getDocs(
    query(collection(db, "users"), where("email", "==", email)),
  );

  let displayName = email.split("@")[0];
  let userId: string | null = null;

  if (!usersSnap.empty) {
    const userDoc = usersSnap.docs[0];
    userId = userDoc.id;
    const data = userDoc.data();
    displayName = data.displayName ?? data.name ?? displayName;
  }

  const projectsQuery =
    userId ?
      query(collection(db, "projects"), where("userId", "==", userId))
    : query(collection(db, "projects"), where("ownerEmail", "==", email));

  const projectsSnap = await getDocs(projectsQuery);
  const projects = projectsSnap.docs.map((d) => d.data());

  const totalProjects = projects.length;

  let totalTasks = 0;
  let doneTasks = 0;
  const toolCounts: Record<string, { count: number; category: string }> = {};

  projects.forEach((p) => {
    Object.values(p.dailyPlan ?? {}).forEach((tasks: any) => {
      tasks.forEach((t: any) => {
        totalTasks++;
        if (t.done) doneTasks++;
      });
    });

    Object.entries(p.selectedTools ?? {}).forEach(
      ([category, tools]: [string, any]) => {
        tools.forEach((tool: string) => {
          const key = `${category}:${tool}`;
          if (!toolCounts[key]) toolCounts[key] = { count: 0, category };
          toolCounts[key].count++;
        });
      },
    );
  });

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const topTools = Object.entries(toolCounts)
    .map(([key, data]) => ({
      name: key.split(":")[1],
      count: data.count,
      category: data.category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { displayName, email, totalProjects, taskCompletionRate, topTools };
}

// ─── shared modal shell ───────────────────────────────────────────────────────

interface ModalShellProps {
  data: ProfileData | null;
  isLoading: boolean;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
  isSelf?: boolean;
}

function ModalShell({
  data,
  isLoading,
  onClose,
  modalRef,
  style,
  isSelf,
}: ModalShellProps) {
  const initials = data?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <div
      ref={modalRef}
      style={{
        width: 300,
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)",
        zIndex: 100,
        overflow: "hidden",
        ...style,
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
            {data?.displayName ?? "—"}
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
            {data?.email ?? ""}
          </p>
          {!isSelf && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#E8610A",
                backgroundColor: "#FEF0E7",
                border: "1px solid #F5C89A",
                borderRadius: 20,
                padding: "1px 7px",
                display: "inline-block",
                marginTop: 4,
              }}>
              Team member
            </span>
          )}
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
          gridTemplateColumns: isSelf ? "1fr 1fr 1fr" : "1fr 1fr",
          borderBottom: "1px solid var(--border)",
        }}>
        {[
          { label: "Projects", value: data?.totalProjects ?? "—" },
          ...(isSelf ?
            [
              {
                label: "Achievements",
                value:
                  data?.unlockedCount !== undefined ?
                    `${data.unlockedCount}/${data.totalAchievements}`
                  : "—",
              },
              {
                label: "Score",
                value:
                  data?.productivityScore !== undefined ?
                    `${data.productivityScore}%`
                  : "—",
              },
            ]
          : [
              {
                label: "Tasks Done",
                value: data ? `${data.taskCompletionRate}%` : "—",
              },
            ]),
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            style={{
              padding: "12px 8px",
              textAlign: "center",
              borderRight:
                i < arr.length - 1 ? "1px solid var(--border)" : "none",
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
        : !data || data.topTools.length === 0 ?
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
            {data.topTools.map((tool, i) => {
              const color = getColor(i);
              const maxCount = data.topTools[0].count;
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
            {isLoading ? "—" : `${data?.taskCompletionRate ?? 0}%`}
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
              width: isLoading ? "0%" : `${data?.taskCompletionRate ?? 0}%`,
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

// ─── SELF modal (sidebar footer) ─────────────────────────────────────────────

interface SelfProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function SelfProfileModal({
  isOpen,
  onClose,
  anchorRef,
}: SelfProfileModalProps) {
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

  const data: ProfileData = {
    displayName: user?.displayName ?? user?.email?.split("@")[0] ?? "User",
    email: user?.email ?? "",
    totalProjects: productivityMetrics.totalProjects,
    taskCompletionRate: productivityMetrics.taskCompletionRate,
    topTools: toolAnalytics.topTools.slice(0, 5),
    unlockedCount,
    totalAchievements,
    productivityScore,
  };

  return (
    <ModalShell
      data={data}
      isLoading={isLoading}
      onClose={onClose}
      modalRef={modalRef}
      isSelf
      style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 0 }}
    />
  );
}

// ─── OTHER USER modal (project card) ─────────────────────────────────────────

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerEmail: string;
  position?: { top: number; left: number };
}

export function UserProfileModal({
  isOpen,
  onClose,
  ownerEmail,
  position,
}: UserProfileModalProps) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Needed for Next.js SSR — document doesn't exist on the server
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !ownerEmail) return;
    setIsLoading(true);
    setData(null);
    loadUserProfileByEmail(ownerEmail)
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, ownerEmail]);

  useEffect(() => {
    if (!isOpen) return;

    // Use a small delay so the click that opened the modal doesn't
    // immediately trigger the outside-click handler
    const timeout = setTimeout(() => {
      function handleClickOutside(e: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => clearTimeout(timeout);
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // FIX: Use createPortal to render directly into document.body.
  // This escapes every parent stacking context (card transforms, overflow,
  // z-index containment) so the modal always floats above everything.
  // Position is pure viewport-relative (fixed), so NO scroll offset needed —
  // getBoundingClientRect() already gives viewport coords.
  return createPortal(
    <>
      {/* Full-screen invisible backdrop — catches outside clicks */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal card — sits above the backdrop */}
      <div
        style={{
          position: "fixed",
          top: position?.top ?? 100,
          left: Math.min(position?.left ?? 100, window.innerWidth - 316),
          zIndex: 9999,
        }}>
        <ModalShell
          data={data}
          isLoading={isLoading}
          onClose={onClose}
          modalRef={modalRef}
          isSelf={false}
        />
      </div>
    </>,
    document.body,
  );
}

// ─── default export stays backward-compatible with Sidebar ───────────────────
export default SelfProfileModal;
