"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import ProjectOverviewModal from "./ProjectOverviewModal";
import { UserProfileModal } from "@/app/components/ProfileModal";
import {
  type DailyPlan,
  type DayTask,
  generateDateRange,
  computeProgress,
} from "@/app/hooks/useProject";

export type Priority = "High" | "Moderate" | "Low";

export type ProjectType =
  | "Engineering"
  | "Technology"
  | "Research"
  | "Medical"
  | "Art & Design"
  | "Literature"
  | "Business"
  | "Others";

export interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  projectType: ProjectType;
  priority: Priority;
  imageUrl?: string;
  projectUrl?: string;
  progress?: number;
  startDate?: string | null;
  endDate?: string | null;
  selectedTools?: Record<string, string[]>;
  dailyPlan?: DailyPlan;
  starred?: boolean;
  starCount?: number;
  starredBy?: string[];
  userId?: string;
  ownerEmail?: string;
  currentUserId?: string;
  onDeleteProject?: (id: string) => Promise<boolean>;
  onUpdateDailyPlan?: (id: string, plan: DailyPlan) => Promise<void>;
  onToggleStar?: (id: string) => Promise<void>;
}

function getDurationLabel(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return null;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  return rem > 0 ? `${weeks}w ${rem}d` : `${weeks}w`;
}

function getDaysRemaining(endDate?: string | null) {
  if (!endDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  return Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getProgressStatus(progress: number, endDate?: string | null) {
  const daysLeft = getDaysRemaining(endDate);
  if (progress >= 100) return { label: "Complete", color: "#16A34A" };
  if (daysLeft !== null && daysLeft < 0)
    return { label: "Overdue", color: "#DC2626" };
  if (progress > 0) return { label: "In Progress", color: "#7C3AED" };
  return { label: "Not started", color: "" };
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function isTodayStr(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0];
}

function flattenTools(selectedTools?: Record<string, string[]>) {
  if (!selectedTools) return [];
  return Object.values(selectedTools).flat();
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

type Pair = { bg: string; border: string; text: string };

const priorityTheme: Record<
  Priority,
  { label: string; dot: string; light: Pair; dark: Pair }
> = {
  High: {
    label: "High",
    dot: "#DC2626",
    light: { text: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
    dark: { text: "#f87171", bg: "#3b1111", border: "#7f2020" },
  },
  Moderate: {
    label: "Moderate",
    dot: "#D97706",
    light: { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
    dark: { text: "#fbbf24", bg: "#362008", border: "#7a4a10" },
  },
  Low: {
    label: "Low",
    dot: "#16A34A",
    light: { text: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
    dark: { text: "#4ade80", bg: "#0f2d1a", border: "#1e5c34" },
  },
};

type TextBg = { bg: string; text: string };

const typeTheme: Record<ProjectType, { light: TextBg; dark: TextBg }> = {
  Engineering: {
    light: { bg: "#EFF6FF", text: "#1D4ED8" },
    dark: { bg: "#172554", text: "#93c5fd" },
  },
  Technology: {
    light: { bg: "#F0FDF4", text: "#15803D" },
    dark: { bg: "#14532d", text: "#86efac" },
  },
  Research: {
    light: { bg: "#FDF4FF", text: "#7E22CE" },
    dark: { bg: "#3b0764", text: "#d8b4fe" },
  },
  Medical: {
    light: { bg: "#FFF1F2", text: "#BE123C" },
    dark: { bg: "#4c0519", text: "#fda4af" },
  },
  "Art & Design": {
    light: { bg: "#FFF7ED", text: "#C2410C" },
    dark: { bg: "#431407", text: "#fdba74" },
  },
  Literature: {
    light: { bg: "#FEFCE8", text: "#A16207" },
    dark: { bg: "#422006", text: "#fde68a" },
  },
  Business: {
    light: { bg: "#F0FDFA", text: "#0F766E" },
    dark: { bg: "#134e4a", text: "#5eead4" },
  },
  Others: {
    light: { bg: "#F9FAFB", text: "#4B5563" },
    dark: { bg: "#1f2937", text: "#d1d5db" },
  },
};

const dayPill: Record<string, { light: Pair; dark: Pair }> = {
  today: {
    light: { bg: "#FEF0E7", border: "#F5C89A", text: "#E8610A" },
    dark: { bg: "#2d1a00", border: "#7c3900", text: "#f07230" },
  },
  allDone: {
    light: { bg: "#F0FDF4", border: "#BBF7D0", text: "#16A34A" },
    dark: { bg: "#0f2d1a", border: "#1e5c34", text: "#4ade80" },
  },
  partial: {
    light: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706" },
    dark: { bg: "#362008", border: "#7a4a10", text: "#fbbf24" },
  },
  missed: {
    light: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626" },
    dark: { bg: "#3b1111", border: "#7f2020", text: "#f87171" },
  },
  default: {
    light: { bg: "#f2ede7", border: "#ede8e2", text: "#b0ada7" },
    dark: { bg: "#21262d", border: "#30363d", text: "#484f58" },
  },
};

const placeholderGradients: Record<ProjectType, string> = {
  Engineering: "from-[#DBEAFE] to-[#EFF6FF]",
  Technology: "from-[#DCFCE7] to-[#F0FDF4]",
  Research: "from-[#F3E8FF] to-[#FDF4FF]",
  Medical: "from-[#FFE4E6] to-[#FFF1F2]",
  "Art & Design": "from-[#FFEDD5] to-[#FFF7ED]",
  Literature: "from-[#FEF9C3] to-[#FEFCE8]",
  Business: "from-[#CCFBF1] to-[#F0FDFA]",
  Others: "from-[#F3F4F6] to-[#F9FAFB]",
};

const placeholderGradientsDark: Record<ProjectType, string> = {
  Engineering: "from-[#1e3a5f] to-[#1a2f4a]",
  Technology: "from-[#14532d] to-[#0f3d22]",
  Research: "from-[#3b0764] to-[#2e0550]",
  Medical: "from-[#4c0519] to-[#3b0412]",
  "Art & Design": "from-[#431407] to-[#350f05]",
  Literature: "from-[#422006] to-[#341a05]",
  Business: "from-[#042f2e] to-[#032524]",
  Others: "from-[#1f2937] to-[#111827]",
};

const placeholderIcons: Record<ProjectType, React.ReactElement> = {
  Engineering: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  Technology: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Research: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Medical: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  "Art & Design": (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  Literature: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Business: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Others: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const PILL_LIMIT = 4;

interface DayTaskModalProps {
  dateStr: string;
  tasks: DayTask[];
  onClose: () => void;
  onToggle: (taskId: string) => void;
  isDark: boolean;
}

function DayTaskModal({
  dateStr,
  tasks,
  onClose,
  onToggle,
  isDark,
}: DayTaskModalProps) {
  const { weekday, date } = formatDayLabel(dateStr);
  const today = isTodayStr(dateStr);
  const doneCount = tasks.filter((t) => t.done).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}>
        <div
          className="flex items-center justify-between rounded-t-2xl px-5 py-4"
          style={{
            backgroundColor: today ? "var(--bg-accent-soft)" : "var(--bg-base)",
          }}>
          <div>
            <div className="flex items-center gap-2">
              <p
                className="text-sm font-bold"
                style={{ color: today ? "#E8610A" : "var(--text-primary)" }}>
                {date}
              </p>
              {today && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "#E8610A" }}>
                  Today
                </span>
              )}
            </div>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--text-muted)" }}>
              {weekday}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold"
              style={{
                color:
                  doneCount === tasks.length && tasks.length > 0 ?
                    "#16A34A"
                  : "var(--text-secondary)",
              }}>
              {doneCount}/{tasks.length} done
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="px-5 pt-3">
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-hover)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(doneCount / tasks.length) * 100}%`,
                  backgroundColor: "#E8610A",
                }}
              />
            </div>
          </div>
        )}

        <div className="max-h-72 overflow-y-auto px-4 py-3">
          {tasks.length === 0 ?
            <p
              className="py-6 text-center text-sm"
              style={{ color: "var(--text-muted)" }}>
              No tasks for this day
            </p>
          : <ul className="flex flex-col gap-1">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(task.id)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--bg-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }>
                    <span
                      className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                      style={{
                        borderColor: task.done ? "#16A34A" : "var(--border)",
                        backgroundColor: task.done ? "#16A34A" : "transparent",
                      }}>
                      {task.done && (
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`flex-1 text-sm leading-relaxed transition-all ${task.done ? "line-through" : ""}`}
                      style={{
                        color:
                          task.done ? "var(--text-muted)" : (
                            "var(--text-primary)"
                          ),
                      }}>
                      {task.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          }
        </div>

        <div
          className="border-t px-5 py-3"
          style={{ borderColor: "var(--divide)" }}>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-base)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-base)")
            }>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface DayStripProps {
  dateRange: string[];
  dailyPlan: DailyPlan;
  onDayClick: (dateStr: string) => void;
  isDark: boolean;
}

function DayStrip({ dateRange, dailyPlan, onDayClick, isDark }: DayStripProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const stripRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragMoved = useRef(false);
  const m = isDark ? "dark" : "light";

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - (stripRef.current?.offsetLeft ?? 0);
    scrollLeft.current = stripRef.current?.scrollLeft ?? 0;
    if (stripRef.current) stripRef.current.style.cursor = "grabbing";
  };

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;
      if (Math.abs(walk) > 4) dragMoved.current = true;
      el.scrollLeft = scrollLeft.current - walk;
    };
    const onUp = () => {
      isDragging.current = false;
      if (el) el.style.cursor = "grab";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const legend = [
    { color: "#16A34A", label: "Done" },
    { color: "#D97706", label: "Partial" },
    { color: "#DC2626", label: "Missed" },
    { color: isDark ? "#30363d" : "#D6D1CA", label: "No tasks" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          Daily Plan
        </p>
        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          {dateRange.length} day{dateRange.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        ref={stripRef}
        className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: "grab", userSelect: "none" }}
        onMouseDown={handleMouseDown}>
        {dateRange.map((dateStr) => {
          const tasks = dailyPlan[dateStr] ?? [];
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const doneCount = tasks.filter((t) => t.done).length;
          const totalCount = tasks.length;
          const allDone = totalCount > 0 && doneCount === totalCount;
          const partial = doneCount > 0 && doneCount < totalCount;
          const hasTasks = totalCount > 0;

          let key = "default";
          if (isToday) key = "today";
          else if (allDone) key = "allDone";
          else if (partial) key = "partial";
          else if (hasTasks && isPast) key = "missed";

          const pill = dayPill[key][m];

          let dotColor = isDark ? "#30363d" : "#D6D1CA";
          if (allDone) dotColor = "#16A34A";
          else if (partial) dotColor = "#D97706";
          else if (hasTasks && isPast) dotColor = "#DC2626";
          else if (hasTasks) dotColor = isDark ? "#484f58" : "#B0ADA7";

          const { weekday } = formatDayLabel(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (!dragMoved.current) onDayClick(dateStr);
              }}
              title={`${dateStr} · ${doneCount}/${totalCount} tasks done`}
              className="flex shrink-0 flex-col items-center gap-1 rounded-xl border px-2.5 py-1.5 transition-all hover:scale-105 hover:shadow-sm"
              style={{
                backgroundColor: pill.bg,
                borderColor: pill.border,
                color: pill.text,
                fontWeight: isToday ? 700 : undefined,
              }}>
              <span className="text-[9px] font-medium uppercase tracking-wide leading-none">
                {weekday}
              </span>
              <span className="text-[11px] leading-none">
                {new Date(dateStr + "T00:00:00").getDate()}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: dotColor }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-0.5">
        {legend.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectCard({
  id,
  title,
  description,
  projectType,
  priority,
  imageUrl,
  projectUrl,
  progress: progressProp = 0,
  startDate,
  endDate,
  selectedTools,
  dailyPlan: dailyPlanProp,
  userId,
  currentUserId,
  onDeleteProject,
  onUpdateDailyPlan,
  onToggleStar,
  starredBy = [],
  ownerEmail,
}: ProjectCardProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = useIsDark();
  const m = isDark ? "dark" : "light";

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(dailyPlanProp ?? {});

  // ── owner profile modal state ──
  const [ownerProfileOpen, setOwnerProfileOpen] = useState(false);
  const [ownerProfilePos, setOwnerProfilePos] = useState({ top: 0, left: 0 });

  const isOwner = currentUserId === userId;
  const canEdit = isOwner;
  const starred = !!currentUserId && starredBy.includes(currentUserId);
  const totalStars = starredBy.length;

  const dateRange = React.useMemo(
    () => (startDate && endDate ? generateDateRange(startDate, endDate) : []),
    [startDate, endDate],
  );

  const hasDailyTasks = React.useMemo(
    () => dateRange.some((d) => (dailyPlan[d]?.length ?? 0) > 0),
    [dateRange, dailyPlan],
  );

  const progress = React.useMemo(
    () =>
      hasDailyTasks ?
        computeProgress(dailyPlan, startDate ?? null, endDate ?? null)
      : progressProp,
    [hasDailyTasks, dailyPlan, startDate, endDate, progressProp],
  );

  const p = priorityTheme[priority] ?? priorityTheme.Moderate;
  const t = typeTheme[projectType] ?? typeTheme.Others;
  const grad =
    isDark ?
      (placeholderGradientsDark[projectType] ?? placeholderGradientsDark.Others)
    : (placeholderGradients[projectType] ?? placeholderGradients.Others);
  const icon = placeholderIcons[projectType] ?? placeholderIcons.Others;

  const durationLabel = getDurationLabel(startDate, endDate);
  const daysLeft = getDaysRemaining(endDate);
  const status = getProgressStatus(progress, endDate);
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const allTools = flattenTools(selectedTools);
  const visibleTools = allTools.slice(0, PILL_LIMIT);
  const overflowCount = allTools.length - PILL_LIMIT;

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleDelete = async () => {
    if (!onDeleteProject) return;
    setDeleting(true);
    try {
      const ok = await onDeleteProject(id);
      if (ok) setConfirmDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleTask = useCallback(
    (dateStr: string, taskId: string) => {
      setDailyPlan((prev) => {
        const updated = (prev[dateStr] ?? []).map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task,
        );
        const next = { ...prev, [dateStr]: updated };
        setTimeout(() => onUpdateDailyPlan?.(id, next), 0);
        return next;
      });
    },
    [id, onUpdateDailyPlan],
  );

  const accentHoverBg = isDark ? "#1a1200" : "#FEF0E7";
  const accentHoverBorder = isDark ? "#7c3900" : "#F5C89A";
  const dangerHoverBg = isDark ? "#3b1111" : "#FEF2F2";

  return (
    <>
      <div
        onClick={() => setOverviewOpen(true)}
        className="group flex flex-col rounded-2xl border cursor-pointer transition-all hover:shadow-md hover:shadow-[#E8610A]/10"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = accentHoverBorder)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }>
        {/* ── Cover ── */}
        <div
          className="relative h-36 w-full overflow-hidden rounded-t-2xl"
          style={{ backgroundColor: "var(--bg-base)" }}>
          {imageUrl ?
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          : <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
              <div
                style={{
                  color: isDark ? "rgba(255,255,255,0.6)" : t.light.text,
                  opacity: isDark ? 1 : 0.6,
                }}>
                {icon}
              </div>
            </div>
          }

          {/* Priority badge */}
          <div
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold backdrop-blur-sm"
            style={{
              backgroundColor: p[m].bg,
              color: p[m].text,
              borderColor: p[m].border,
            }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: p.dot }}
            />
            {p.label}
          </div>

          {/* ⋯ menu */}
          {canEdit && (
            <div className="absolute top-2.5 right-2.5 z-10" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = accentHoverBg;
                  e.currentTarget.style.borderColor = accentHoverBorder;
                  e.currentTarget.style.color = "#E8610A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-card)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-40 rounded-xl border p-1.5 shadow-lg shadow-black/10 z-20"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      router.push(`/AddProjectPage?edit=${id}`);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentHoverBg;
                      e.currentTarget.style.color = "#E8610A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                    Edit project
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      setConfirmDeleteOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors"
                    style={{ color: "#DC2626" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = dangerHoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                    Delete project
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Type badge */}
          <span
            className="inline-flex w-fit items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: t[m].bg, color: t[m].text }}>
            {projectType || "Others"}
          </span>

          {/* Title / description */}
          <div>
            <h3
              className="truncate text-sm font-bold transition-colors group-hover:text-[#E8610A]"
              style={{
                fontFamily: "'Sora', sans-serif",
                color: "var(--text-primary)",
              }}>
              {title}
            </h3>
            {description ?
              <p
                className="mt-1 line-clamp-2 text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            : <p
                className="mt-1 text-xs italic"
                style={{ color: "var(--text-muted)" }}>
                No description provided
              </p>
            }

            {/* ── Owner email — clickable to open profile ── */}
            {/* FIX: Only render the trigger button here, NOT the modal.            */}
            {/* The modal is moved outside the card div at the bottom of the JSX   */}
            {/* to escape the card's stacking context (transform + overflow).       */}
            {!isOwner && ownerEmail && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect();
                  setOwnerProfilePos({
                    top: rect.bottom + 8,
                    left: rect.left,
                  });
                  setOwnerProfileOpen(true);
                }}
                className="mt-2 flex items-center gap-1.5 transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 0",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#E8610A")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    "var(--text-primary)")
                }>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[10px] font-bold truncate max-w-[140px]">
                  {ownerEmail}
                </span>
              </button>
            )}
          </div>

          {/* Tool pills */}
          {allTools.length > 0 ?
            <div className="flex flex-wrap gap-1.5">
              {visibleTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-base)",
                    color: "var(--text-secondary)",
                  }}>
                  {tool}
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: isDark ? "#2d1a00" : "#FEF0E7",
                    borderColor: isDark ? "#7c3900" : "#F5C89A",
                    color: isDark ? "#f07230" : "#E8610A",
                  }}>
                  +{overflowCount}
                </span>
              )}
            </div>
          : <div className="flex flex-wrap gap-1.5">
              <span
                className="rounded-full border border-dashed px-2.5 py-0.5 text-[10px] italic"
                style={{
                  borderColor: "var(--border-dashed)",
                  color: "var(--text-muted)",
                }}>
                No tools added
              </span>
            </div>
          }

          {/* Progress */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-semibold"
                style={{ color: status.color || "var(--text-muted)" }}>
                {status.label}
              </span>
              <span
                className="text-[11px] font-bold"
                style={{ color: "var(--text-primary)" }}>
                {clampedProgress}%
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-hover)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${clampedProgress}%`,
                  backgroundColor: "#E8610A",
                }}
              />
            </div>
            {startDate || endDate ?
              <div className="flex items-center justify-between pt-0.5">
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}>
                  {durationLabel ?
                    `${durationLabel} total`
                  : endDate ?
                    `Ends ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : ""}
                </span>
                {daysLeft !== null && clampedProgress < 100 && (
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color:
                        daysLeft < 0 ? "#DC2626"
                        : daysLeft <= 3 ? "#D97706"
                        : "var(--text-secondary)",
                    }}>
                    {daysLeft < 0 ?
                      `${Math.abs(daysLeft)}d overdue`
                    : daysLeft === 0 ?
                      "Due today"
                    : `${daysLeft}d left`}
                  </span>
                )}
              </div>
            : <div className="flex items-center justify-between pt-0.5">
                <span
                  className="text-[10px] italic"
                  style={{ color: "var(--text-muted)" }}>
                  No dates set
                </span>
              </div>
            }
          </div>

          {/* Day Strip */}
          {isOwner && dateRange.length > 0 && (
            <div
              className="rounded-xl border p-3"
              style={{
                backgroundColor: "var(--bg-base)",
                borderColor: "var(--border)",
              }}
              onClick={(e) => e.stopPropagation()}>
              {hasDailyTasks ?
                <DayStrip
                  dateRange={dateRange}
                  dailyPlan={dailyPlan}
                  onDayClick={setSelectedDay}
                  isDark={isDark}
                />
              : <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}>
                      Daily Plan
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}>
                      {dateRange.length} day{dateRange.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-3"
                    style={{ borderColor: "var(--border-dashed)" }}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--text-muted)" }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span
                      className="text-[10px] italic"
                      style={{ color: "var(--text-muted)" }}>
                      No tasks added yet
                    </span>
                  </div>
                </div>
              }
            </div>
          )}

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            {projectUrl ?
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[11px] font-medium transition-colors hover:text-[#E8610A]"
                style={{ color: "var(--text-secondary)" }}>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="max-w-[120px] truncate">
                  {new URL(projectUrl).hostname.replace("www.", "")}
                </span>
              </a>
            : <span
                className="text-[11px] italic"
                style={{ color: "var(--text-muted)" }}>
                No link added
              </span>
            }

            {/* Star button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.(id);
              }}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
              style={
                starred ?
                  {
                    backgroundColor: "#E8610A",
                    borderColor: "#E8610A",
                    color: "#ffffff",
                  }
                : {
                    backgroundColor: "var(--bg-base)",
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                  }
              }
              onMouseEnter={(e) => {
                if (starred) {
                  e.currentTarget.style.backgroundColor = "#D15508";
                } else {
                  e.currentTarget.style.backgroundColor = accentHoverBg;
                  e.currentTarget.style.borderColor = accentHoverBorder;
                  e.currentTarget.style.color = "#E8610A";
                }
              }}
              onMouseLeave={(e) => {
                if (starred) {
                  e.currentTarget.style.backgroundColor = "#E8610A";
                } else {
                  e.currentTarget.style.backgroundColor = "var(--bg-base)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={starred ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>
                {totalStars > 0 ?
                  totalStars
                : starred ?
                  "Starred"
                : "Star"}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* ── END of card div ── */}

      {selectedDay && isOwner && (
        <DayTaskModal
          dateStr={selectedDay}
          tasks={dailyPlan[selectedDay] ?? []}
          onClose={() => setSelectedDay(null)}
          onToggle={(taskId) => handleToggleTask(selectedDay, taskId)}
          isDark={isDark}
        />
      )}

      <ProjectOverviewModal
        isOpen={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        onEdit={(projectId) => {
          setOverviewOpen(false);
          router.push(`/AddProjectPage?edit=${projectId}`);
        }}
        id={id}
        title={title}
        description={description}
        projectType={projectType}
        priority={priority}
        imageUrl={imageUrl}
        projectUrl={projectUrl}
        progress={progress}
        startDate={startDate}
        endDate={endDate}
        selectedTools={selectedTools}
        dailyPlan={dailyPlan}
        onToggleStar={onToggleStar}
        starred={starred}
        isOwner={canEdit}
      />

      <ConfirmationModal
        isOpen={confirmDeleteOpen}
        title="Delete project?"
        message={`This will permanently remove "${title}". This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {/* ── UserProfileModal outside the card div + portal in ProfileModal.tsx ── */}
      {/* Together these fully escape the card stacking context.                  */}
      {!isOwner && ownerEmail && (
        <UserProfileModal
          isOpen={ownerProfileOpen}
          onClose={() => setOwnerProfileOpen(false)}
          ownerEmail={ownerEmail}
          position={ownerProfilePos}
        />
      )}
    </>
  );
}
