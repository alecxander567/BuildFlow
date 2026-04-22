const AVATARS = [
  { initials: "JK", bg: "bg-[#E8610A]" },
  { initials: "ML", bg: "bg-[#B84A06]" },
  { initials: "SR", bg: "bg-[#7C3AED]" },
];

export type Status = "In Progress" | "Review" | "On Hold" | "Completed";
export type Priority = "High" | "Medium" | "Low";

interface Avatar {
  initials: string;
  bg: string;
}

interface StatusBadgeProps {
  status: Status;
}

interface ProjectCardProps {
  title?: string;
  description?: string;
  status?: Status;
  progress?: number;
  dueDate?: string;
  tasksDone?: number;
  tasksTotal?: number;
  priority?: Priority;
  avatars?: Avatar[];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<Status, string> = {
    "In Progress": "bg-[#FEF0E7] text-[#E8610A]",
    Review: "bg-[#EDE9FE] text-[#7C3AED]",
    "On Hold": "bg-[#FEF9C3] text-[#A16207]",
    Completed: "bg-[#DCFCE7] text-[#16A34A]",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${map[status] ?? "bg-[#F2EDE7] text-[#72706A]"}`}>
      {status}
    </span>
  );
}

export default function ProjectCard({
  title = "Redesign Landing Page",
  description = "Update the marketing site with new brand guidelines and improved conversion flow.",
  status = "In Progress",
  progress = 65,
  dueDate = "Apr 30",
  tasksDone = 8,
  tasksTotal = 12,
  priority = "High",
  avatars = AVATARS,
}: ProjectCardProps) {
  const priorityColor =
    priority === "High" ? "text-[#DC2626]"
    : priority === "Medium" ? "text-[#F57C00]"
    : "text-[#16A34A]";

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-[#EDE8E2] bg-white p-5 transition-shadow hover:shadow-md hover:shadow-[#E8610A]/10 hover:border-[#F5C89A]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="truncate text-sm font-bold text-[#1A1916] group-hover:text-[#E8610A] transition-colors"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#72706A]">
            {description}
          </p>
        </div>
        <button className="shrink-0 text-[#B0ADA7] transition-colors hover:text-[#72706A]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-[#B0ADA7]">Progress</span>
          <span className="text-xs font-semibold text-[#1A1916]">
            {progress}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#F2EDE7]">
          <div
            className="h-1.5 rounded-full bg-[#E8610A] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#B0ADA7]">
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            {tasksDone}/{tasksTotal}
          </span>
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {dueDate}
          </span>
          <span className={`font-semibold ${priorityColor}`}>{priority}</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <div className="flex -space-x-1.5">
            {avatars.slice(0, 3).map((a, i) => (
              <div
                key={i}
                className={`flex h-6 w-6 items-center justify-center rounded-full ${a.bg} text-[9px] font-bold text-white ring-2 ring-white`}>
                {a.initials}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
