import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./ConfirmationModal";

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
  onDeleteProject?: (id: string) => Promise<boolean>;
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

export default function ProjectCard({
  id,
  title,
  description,
  projectType,
  priority,
  imageUrl,
  projectUrl,
  onDeleteProject,
}: ProjectCardProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const p = priorityConfig[priority];
  const t = typeConfig[projectType];
  const grad = placeholderGradients[projectType];
  const icon = placeholderIcons[projectType];

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
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

  return (
    <div
      onClick={() => router.push(`/projects/${id}`)}
      className="group flex flex-col rounded-2xl border border-[#EDE8E2] bg-white overflow-hidden cursor-pointer transition-all hover:shadow-md hover:shadow-[#E8610A]/10 hover:border-[#F5C89A]">
      <div className="relative h-36 w-full overflow-hidden">
        {imageUrl ?
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        : <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${grad}`}>
            <div className={`${t.text} opacity-40`}>{icon}</div>
          </div>
        }

        <div
          className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold backdrop-blur-sm ${p.bg} ${p.text} ${p.border}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
          {p.label}
        </div>

        <div className="absolute top-2.5 left-2.5" ref={menuRef}>
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
            <div className="absolute left-0 mt-1.5 w-40 rounded-xl border border-[#EDE8E2] bg-white p-1.5 shadow-lg shadow-black/10">
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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span
          className={`inline-flex w-fit items-center rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ${t.bg} ${t.text}`}>
          {projectType}
        </span>

        <div>
          <h3
            className="truncate text-sm font-bold text-[#1A1916] transition-colors group-hover:text-[#E8610A]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </h3>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#72706A]">
              {description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          {projectUrl ?
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#B0ADA7] transition-colors hover:text-[#E8610A]">
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
          : <span className="text-[11px] text-[#D6D1CA]">No link added</span>}

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/projects/${id}`);
            }}
            className="flex items-center gap-1 rounded-lg border border-[#EDE8E2] bg-[#F9F7F4] px-2.5 py-1 text-[11px] font-medium text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
            View
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

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
    </div>
  );
}
