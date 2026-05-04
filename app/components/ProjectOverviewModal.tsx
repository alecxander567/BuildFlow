import React, { useEffect, useRef } from "react";
import { type ProjectCardProps } from "./ProjectCard";
import type { DailyPlan } from "@/app/hooks/useProject";

type ProjectOverviewModalProps = Pick<
  ProjectCardProps,
  | "id"
  | "title"
  | "description"
  | "projectType"
  | "priority"
  | "imageUrl"
  | "projectUrl"
  | "progress"
  | "startDate"
  | "endDate"
  | "selectedTools"
> & {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
  dailyPlan?: DailyPlan; 
  onToggleStar?: (id: string) => Promise<void>; 
  starred?: boolean; 
  isOwner?: boolean; 
};

function getDurationLabel(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return null;
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days < 7) return `${days} days`;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  return rem > 0 ? `${weeks}w ${rem}d` : `${weeks} weeks`;
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
  if (progress >= 100)
    return {
      label: "Complete",
      color: "text-[#16A34A]",
      bg: "bg-[#16A34A]",
      lightBg: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
    };
  if (daysLeft !== null && daysLeft < 0)
    return {
      label: "Overdue",
      color: "text-[#DC2626]",
      bg: "bg-[#DC2626]",
      lightBg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
    };
  if (progress > 0)
    return {
      label: "In Progress",
      color: "text-[#7C3AED]",
      bg: "bg-[#7C3AED]",
      lightBg: "bg-[#F5F3FF]",
      border: "border-[#DDD6FE]",
    };
  return {
    label: "Not Started",
    color: "text-[#B0ADA7]",
    bg: "bg-[#D6D1CA]",
    lightBg: "bg-[#F9F7F4]",
    border: "border-[#E8E4DE]",
  };
}

const priorityConfig = {
  High: {
    dot: "bg-[#DC2626]",
    text: "text-[#DC2626]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
  },
  Moderate: {
    dot: "bg-[#D97706]",
    text: "text-[#D97706]",
    bg: "bg-[#FFFBEB]",
    border: "border-[#FDE68A]",
  },
  Low: {
    dot: "bg-[#16A34A]",
    text: "text-[#16A34A]",
    bg: "bg-[#F0FDF4]",
    border: "border-[#BBF7D0]",
  },
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: "bg-[#EFF6FF]", text: "text-[#1D4ED8]" },
  Technology: { bg: "bg-[#F0FDF4]", text: "text-[#15803D]" },
  Research: { bg: "bg-[#FDF4FF]", text: "text-[#7E22CE]" },
  Medical: { bg: "bg-[#FFF1F2]", text: "text-[#BE123C]" },
  "Art & Design": { bg: "bg-[#FFF7ED]", text: "text-[#C2410C]" },
  Literature: { bg: "bg-[#FEFCE8]", text: "text-[#A16207]" },
  Business: { bg: "bg-[#F0FDFA]", text: "text-[#0F766E]" },
  Others: { bg: "bg-[#F9FAFB]", text: "text-[#4B5563]" },
};

const placeholderGradients: Record<string, string> = {
  Engineering: "from-[#DBEAFE] to-[#EFF6FF]",
  Technology: "from-[#DCFCE7] to-[#F0FDF4]",
  Research: "from-[#F3E8FF] to-[#FDF4FF]",
  Medical: "from-[#FFE4E6] to-[#FFF1F2]",
  "Art & Design": "from-[#FFEDD5] to-[#FFF7ED]",
  Literature: "from-[#FEF9C3] to-[#FEFCE8]",
  Business: "from-[#CCFBF1] to-[#F0FDFA]",
  Others: "from-[#F3F4F6] to-[#F9FAFB]",
};

const placeholderIcons: Record<string, React.ReactElement> = {
  Engineering: (
    <svg
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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
      width="40"
      height="40"
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

function flattenTools(selectedTools?: Record<string, string[]>) {
  if (!selectedTools) return {};
  return selectedTools;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectOverviewModal({
  id,
  title,
  description,
  projectType,
  priority,
  imageUrl,
  projectUrl,
  progress = 0,
  startDate,
  endDate,
  selectedTools,
  isOpen,
  onClose,
  onEdit,
  dailyPlan,
  onToggleStar,
  starred = false,
  isOwner = false,
}: ProjectOverviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const p = priorityConfig[priority];
  const t = typeConfig[projectType] ?? typeConfig["Others"];
  const grad =
    placeholderGradients[projectType] ?? placeholderGradients["Others"];
  const icon = placeholderIcons[projectType] ?? placeholderIcons["Others"];
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const status = getProgressStatus(progress, endDate);
  const daysLeft = getDaysRemaining(endDate);
  const durationLabel = getDurationLabel(startDate, endDate);
  const toolsByCategory = flattenTools(selectedTools);
  const allTools = Object.values(toolsByCategory).flat();

  // Calculate task stats from dailyPlan
  const getTotalTasks = () => {
    if (!dailyPlan) return 0;
    return Object.values(dailyPlan).reduce(
      (total, tasks) => total + tasks.length,
      0,
    );
  };

  const getCompletedTasks = () => {
    if (!dailyPlan) return 0;
    return Object.values(dailyPlan).reduce(
      (total, tasks) => total + tasks.filter((t) => t.done).length,
      0,
    );
  };

  const totalTasks = getTotalTasks();
  const completedTasks = getCompletedTasks();
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-[#EDE8E2] bg-white shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ── Cover banner ── */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden">
          {imageUrl ?
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          : <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
              <div className={`${t.text} opacity-60`}>{icon}</div>
            </div>
          }

          {/* Gradient fade bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />

          {/* Star button */}
          {onToggleStar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(id);
              }}
              className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#EDE8E2] bg-white/95 backdrop-blur-sm transition-colors hover:bg-[#FEF0E7]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={starred ? "#E8610A" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={starred ? "text-[#E8610A]" : "text-[#72706A]"}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}

          {/* Priority badge */}
          <div
            className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${p.bg} ${p.text} ${p.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
            {priority}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-[#EDE8E2] bg-white/95 text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
            <svg
              width="13"
              height="13"
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

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3 flex flex-col gap-4">
          {/* Title + type */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2 min-w-0">
              <span
                className={`inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-xs font-bold ${t.bg} ${t.text}`}>
                {projectType}
              </span>
              <h2
                className="text-xl font-bold text-[#1A1916] leading-tight"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                {title}
              </h2>
            </div>
            {isOwner && onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[#EDE8E2] px-3 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
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
                Edit
              </button>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed text-[#374151]">
              {description}
            </p>
          )}

          {/* ── Tasks Overview (if there are tasks) ── */}
          {totalTasks > 0 && (
            <div className="flex flex-col gap-2 p-3 rounded-xl border border-[#EDE8E2] bg-[#F9F7F4]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1916]">
                  Tasks Overview
                </span>
                <span className="text-xs font-semibold text-[#1A1916]">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8E4DE]">
                <div
                  className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── Progress section ── */}
          <div
            className={`rounded-xl border p-4 flex flex-col gap-3 ${status.lightBg} ${status.border}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${status.color}`}>
                {status.label}
              </span>
              <span className="text-base font-bold text-[#1A1916]">
                {clampedProgress}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/80">
              <div
                className={`h-full rounded-full transition-all duration-700 ${status.bg}`}
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
          </div>

          {/* ── Dates ── */}
          {(startDate || endDate) && (
            <div className="grid grid-cols-3 gap-2">
              {startDate && (
                <div className="flex flex-col gap-1 rounded-xl border border-[#EDE8E2] bg-[#F9F7F4] p-3">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Start
                  </span>
                  <span className="text-sm font-bold text-[#1A1916]">
                    {formatDate(startDate)}
                  </span>
                </div>
              )}
              {endDate && (
                <div className="flex flex-col gap-1 rounded-xl border border-[#EDE8E2] bg-[#F9F7F4] p-3">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    End
                  </span>
                  <span className="text-sm font-bold text-[#1A1916]">
                    {formatDate(endDate)}
                  </span>
                </div>
              )}
              {(durationLabel || daysLeft !== null) && (
                <div className="flex flex-col gap-1 rounded-xl border border-[#EDE8E2] bg-[#F9F7F4] p-3">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                    {clampedProgress >= 100 ? "Duration" : "Remaining"}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      clampedProgress >= 100 ? "text-[#1A1916]"
                      : daysLeft !== null && daysLeft < 0 ? "text-[#DC2626]"
                      : daysLeft !== null && daysLeft <= 3 ? "text-[#D97706]"
                      : "text-[#1A1916]"
                    }`}>
                    {clampedProgress >= 100 ?
                      (durationLabel ?? "—")
                    : daysLeft === null ?
                      "—"
                    : daysLeft < 0 ?
                      `${Math.abs(daysLeft)}d overdue`
                    : daysLeft === 0 ?
                      "Due today"
                    : `${daysLeft}d left`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Tools ── */}
          {allTools.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                Tools & Stack
              </span>
              {(
                Object.keys(toolsByCategory).length > 0 &&
                Object.values(toolsByCategory).some((v) => v.length > 0)
              ) ?
                <div className="flex flex-col gap-3">
                  {Object.entries(toolsByCategory).map(([category, tools]) =>
                    tools.length > 0 ?
                      <div key={category} className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-[#6B7280]">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {tools.map((tool) => (
                            <span
                              key={tool}
                              className="rounded-full border border-[#D1CEC9] bg-[#F2EDE7] px-3 py-1 text-xs font-semibold text-[#374151]">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    : null,
                  )}
                </div>
              : <div className="flex flex-wrap gap-1.5">
                  {allTools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-[#D1CEC9] bg-[#F2EDE7] px-3 py-1 text-xs font-semibold text-[#374151]">
                      {tool}
                    </span>
                  ))}
                </div>
              }
            </div>
          )}

          {/* ── Footer: project link + view button ── */}
          <div className="flex items-center justify-between gap-2 pt-2 mt-auto border-t border-[#EDE8E2]">
            {projectUrl ?
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#374151] transition-colors hover:text-[#E8610A]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span className="max-w-[160px] truncate">
                  {new URL(projectUrl).hostname.replace("www.", "")}
                </span>
              </a>
            : <span className="text-xs font-medium text-[#9CA3AF]">
                No link added
              </span>
            }

            <button
              onClick={onClose}
              className="flex items-center gap-1 rounded-lg border border-[#E8610A] bg-[#FEF0E7] px-3 py-1.5 text-xs font-semibold text-[#E8610A] transition-colors hover:bg-[#E8610A] hover:text-white">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
