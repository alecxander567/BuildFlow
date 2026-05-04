"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";
import ProjectOverviewModal from "./ProjectOverviewModal";
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
  userId?: string;
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
  const diffMs = end.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function getProgressStatus(
  progress: number,
  endDate?: string | null,
): { label: string; color: string } {
  const daysLeft = getDaysRemaining(endDate);
  if (progress >= 100) return { label: "Complete", color: "text-[#16A34A]" };
  if (daysLeft !== null && daysLeft < 0)
    return { label: "Overdue", color: "text-[#DC2626]" };
  if (progress > 0) return { label: "In Progress", color: "text-[#7C3AED]" };
  return { label: "Not started", color: "text-[#B0ADA7]" };
}

function formatDayLabel(dateStr: string): { weekday: string; date: string } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function isTodayStr(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

function flattenTools(selectedTools?: Record<string, string[]>): string[] {
  if (!selectedTools) return [];
  return Object.values(selectedTools).flat();
}

const priorityConfig: Record<
  Priority,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  High: {
    label: "High",
    dot: "bg-[#DC2626]",
    text: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
  },
  Moderate: {
    label: "Moderate",
    dot: "bg-[#D97706]",
    text: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
  },
  Low: {
    label: "Low",
    dot: "bg-[#16A34A]",
    text: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    border: "border-[#BBF7D0]",
  },
};

const typeConfig: Record<ProjectType, { bg: string; text: string }> = {
  Engineering: { bg: "bg-[#EFF6FF]", text: "text-[#1D4ED8]" },
  Technology: { bg: "bg-[#F0FDF4]", text: "text-[#15803D]" },
  Research: { bg: "bg-[#FDF4FF]", text: "text-[#7E22CE]" },
  Medical: { bg: "bg-[#FFF1F2]", text: "text-[#BE123C]" },
  "Art & Design": { bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" },
  Literature: { bg: "bg-[#FEFCE8]", text: "text-[#A16207]" },
  Business: { bg: "bg-[#F0FDFA]", text: "text-[#0F766E]" },
  Others: { bg: "bg-[#F9FAFB]", text: "text-[#4B5563]" },
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
}

function DayTaskModal({
  dateStr,
  tasks,
  onClose,
  onToggle,
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
        className="relative w-full max-w-sm rounded-2xl border border-[#EDE8E2] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div
          className={`flex items-center justify-between rounded-t-2xl px-5 py-4 ${today ? "bg-[#FEF0E7]" : "bg-[#F9F7F4]"}`}>
          <div>
            <div className="flex items-center gap-2">
              <p
                className={`text-sm font-bold ${today ? "text-[#E8610A]" : "text-[#1A1916]"}`}>
                {date}
              </p>
              {today && (
                <span className="rounded-full bg-[#E8610A] px-2 py-0.5 text-[10px] font-bold text-white">
                  Today
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#B0ADA7]">{weekday}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold ${doneCount === tasks.length && tasks.length > 0 ? "text-[#16A34A]" : "text-[#72706A]"}`}>
              {doneCount}/{tasks.length} done
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#B0ADA7] transition-colors hover:bg-[#EDE8E2] hover:text-[#72706A]">
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
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F2EDE7]">
              <div
                className="h-full rounded-full bg-[#E8610A] transition-all duration-500"
                style={{
                  width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
        <div className="max-h-72 overflow-y-auto px-4 py-3">
          {tasks.length === 0 ?
            <p className="py-6 text-center text-sm text-[#D6D1CA]">
              No tasks for this day
            </p>
          : <ul className="flex flex-col gap-1">
              {tasks.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(task.id)}
                    className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F9F7F4]">
                    <span
                      className={`mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${task.done ? "border-[#16A34A] bg-[#16A34A]" : "border-[#D6D1CA] hover:border-[#E8610A]"}`}>
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
                      className={`flex-1 text-sm leading-relaxed transition-all ${task.done ? "text-[#B0ADA7] line-through" : "text-[#1A1916]"}`}>
                      {task.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          }
        </div>
        <div className="border-t border-[#F2EDE7] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#F9F7F4] py-2 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#EDE8E2]">
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
}

function DayStrip({ dateRange, dailyPlan, onDayClick }: DayStripProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const stripRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragMoved = useRef(false);

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

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Daily Plan
        </p>
        <p className="text-[10px] text-[#B0ADA7]">
          {dateRange.length} day{dateRange.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Drag-scrollable pill row — no visible scrollbar */}
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

          let dotBg = "bg-[#E8E4DE]";
          if (allDone) dotBg = "bg-[#16A34A]";
          else if (partial) dotBg = "bg-[#D97706]";
          else if (hasTasks && isPast) dotBg = "bg-[#DC2626]";
          else if (hasTasks) dotBg = "bg-[#B0ADA7]";

          let pillCls = "border-[#EDE8E2] bg-[#F9F7F4] text-[#B0ADA7]";
          if (isToday)
            pillCls = "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A] font-bold";
          else if (allDone)
            pillCls = "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]";
          else if (partial)
            pillCls = "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706]";
          else if (hasTasks && isPast)
            pillCls = "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]";

          const { weekday } = formatDayLabel(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                // Only fire click if the user wasn't dragging
                if (!dragMoved.current) onDayClick(dateStr);
              }}
              title={`${dateStr} · ${doneCount}/${totalCount} tasks done`}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-2.5 py-1.5 transition-all hover:scale-105 hover:shadow-sm ${pillCls}`}>
              <span className="text-[9px] font-medium uppercase tracking-wide leading-none">
                {weekday}
              </span>
              <span className="text-[11px] leading-none">
                {new Date(dateStr + "T00:00:00").getDate()}
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${dotBg}`} />
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 pt-0.5">
        {[
          { dot: "bg-[#16A34A]", label: "Done" },
          { dot: "bg-[#D97706]", label: "Partial" },
          { dot: "bg-[#DC2626]", label: "Missed" },
          { dot: "bg-[#E8E4DE]", label: "No tasks" },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <span className="text-[9px] text-[#B0ADA7]">{label}</span>
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
  starred = false,
  starCount = 0,
  userId,
  currentUserId,
  onDeleteProject,
  onUpdateDailyPlan,
  onToggleStar,
}: ProjectCardProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const isOwner = currentUserId === userId;
  const canEdit = isOwner;

  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(dailyPlanProp ?? {});

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

  const p = priorityConfig[priority] || priorityConfig.Moderate;
  const t = typeConfig[projectType] || typeConfig.Others;
  const grad = placeholderGradients[projectType] || placeholderGradients.Others;
  const icon = placeholderIcons[projectType] || placeholderIcons.Others;

  const durationLabel = getDurationLabel(startDate, endDate);
  const daysLeft = getDaysRemaining(endDate);
  const status = getProgressStatus(progress, endDate);
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const allTools = flattenTools(selectedTools);
  const visibleTools = allTools.slice(0, PILL_LIMIT);
  const overflowCount = allTools.length - PILL_LIMIT;

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const handleDelete = async () => {
    if (!onDeleteProject) return;
    setDeleting(true);
    try {
      const success = await onDeleteProject(id);
      if (success) setConfirmDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleTask = useCallback(
    (dateStr: string, taskId: string) => {
      setDailyPlan((prevPlan) => {
        const currentTasks = prevPlan[dateStr] ?? [];
        const updatedTasks = currentTasks.map((task) =>
          task.id === taskId ? { ...task, done: !task.done } : task,
        );
        const next = { ...prevPlan, [dateStr]: updatedTasks };

        // Use setTimeout to move the update out of render phase
        setTimeout(() => {
          onUpdateDailyPlan?.(id, next);
        }, 0);

        return next;
      });
    },
    [id, onUpdateDailyPlan],
  );

  return (
    <>
      <div
        onClick={() => setOverviewOpen(true)}
        className="group flex flex-col rounded-2xl border border-[#EDE8E2] bg-white cursor-pointer transition-all hover:shadow-md hover:shadow-[#E8610A]/10 hover:border-[#F5C89A]">
        {/* ── Cover image ── */}
        <div className="relative h-36 w-full overflow-hidden rounded-t-2xl">
          {imageUrl ?
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          : <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
              <div className={`${t?.text || "text-gray-500"} opacity-60`}>
                {icon}
              </div>
            </div>
          }

          {/* Priority badge */}
          <div
            className={`absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold backdrop-blur-sm ${p?.bg || "bg-gray-100"} ${p?.text || "text-gray-600"} ${p?.border || "border-gray-200"}`}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${p?.dot || "bg-gray-400"}`}
            />
            {p?.label || priority}
          </div>

          {/* Menu button — owner only */}
          {canEdit && (
            <div className="absolute top-2.5 right-2.5 z-10" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#EDE8E2] bg-white/95 text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
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
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl border border-[#EDE8E2] bg-white p-1.5 shadow-lg shadow-black/10 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      router.push(`/AddProjectPage?edit=${id}`);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#1A1916] transition-colors hover:bg-[#FEF0E7] hover:text-[#E8610A]">
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
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FEF2F2]">
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

        {/* ── Card body ── */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <span
            className={`inline-flex w-fit items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ${t?.bg || "bg-gray-100"} ${t?.text || "text-gray-600"}`}>
            {projectType || "Others"}
          </span>

          <div>
            <h3
              className="truncate text-sm font-bold text-[#1A1916] transition-colors group-hover:text-[#E8610A]"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {title}
            </h3>
            {/* Description or placeholder */}
            {description ?
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#374151]">
                {description}
              </p>
            : <p className="mt-1 text-xs italic text-[#D6D1CA]">
                No description provided
              </p>
            }
          </div>

          {/* Tools or placeholder */}
          {allTools.length > 0 ?
            <div className="flex flex-wrap gap-1.5">
              {visibleTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[#E8E4DE] bg-[#F9F7F4] px-2.5 py-0.5 text-[10px] font-medium text-[#72706A]">
                  {tool}
                </span>
              ))}
              {overflowCount > 0 && (
                <span className="rounded-full border border-[#F5C89A] bg-[#FEF0E7] px-2.5 py-0.5 text-[10px] font-semibold text-[#E8610A]">
                  +{overflowCount}
                </span>
              )}
            </div>
          : <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-dashed border-[#E8E4DE] px-2.5 py-0.5 text-[10px] text-[#D6D1CA]">
                No tools added
              </span>
            </div>
          }

          {/* ── Progress ── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold ${status.color}`}>
                {status.label}
              </span>
              <span className="text-[11px] font-bold text-[#1A1916]">
                {clampedProgress}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F2EDE7]">
              <div
                className="h-full rounded-full bg-[#E8610A] transition-all duration-500"
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
            {/* Date row or placeholder */}
            {startDate || endDate ?
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-[#B0ADA7]">
                  {durationLabel ?
                    `${durationLabel} total`
                  : endDate ?
                    `Ends ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : ""}
                </span>
                {daysLeft !== null && clampedProgress < 100 && (
                  <span
                    className={`text-[10px] font-medium ${
                      daysLeft < 0 ? "text-[#DC2626]"
                      : daysLeft <= 3 ? "text-[#D97706]"
                      : "text-[#72706A]"
                    }`}>
                    {daysLeft < 0 ?
                      `${Math.abs(daysLeft)}d overdue`
                    : daysLeft === 0 ?
                      "Due today"
                    : `${daysLeft}d left`}
                  </span>
                )}
              </div>
            : <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] italic text-[#D6D1CA]">
                  No dates set
                </span>
              </div>
            }
          </div>

          {/* ── Day Strip — owner only ── */}
          {isOwner && dateRange.length > 0 && (
            <div
              className="rounded-xl border border-[#EDE8E2] bg-[#F9F7F4] p-3"
              onClick={(e) => e.stopPropagation()}>
              {hasDailyTasks ?
                <DayStrip
                  dateRange={dateRange}
                  dailyPlan={dailyPlan}
                  onDayClick={(dateStr) => setSelectedDay(dateStr)}
                />
              : <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#B0ADA7]">
                      Daily Plan
                    </p>
                    <p className="text-[10px] text-[#B0ADA7]">
                      {dateRange.length} day{dateRange.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#E8E4DE] py-3">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D6D1CA"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-[10px] italic text-[#D6D1CA]">
                      No tasks added yet
                    </span>
                  </div>
                </div>
              }
            </div>
          )}

          {/* ── Bottom row: URL + Star ── */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            {projectUrl ?
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[#4B5563] transition-colors hover:text-[#E8610A]">
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
            : <span className="text-[11px] italic text-[#D6D1CA]">
                No link added
              </span>
            }

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.(id);
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                starred ?
                  "border-[#E8610A] bg-[#E8610A] text-white hover:bg-[#D15508]"
                : "border-[#EDE8E2] bg-[#F9F7F4] text-[#72706A] hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
              }`}>
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
                {starCount > 0 ?
                  starCount
                : starred ?
                  "Starred"
                : "Star"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Day Task Modal (opened from strip) ── */}
      {selectedDay && isOwner && (
        <DayTaskModal
          dateStr={selectedDay}
          tasks={dailyPlan[selectedDay] ?? []}
          onClose={() => setSelectedDay(null)}
          onToggle={(taskId) => {
            handleToggleTask(selectedDay, taskId);
          }}
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
    </>
  );
}
