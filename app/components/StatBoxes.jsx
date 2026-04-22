const stats = [
  {
    label: "Total Projects",
    value: "12",
    change: "+2 this month",
    positive: true,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    accent: "bg-[#FEF0E7] text-[#E8610A]",
    bar: "bg-[#E8610A]",
    barWidth: "w-3/4",
  },
  {
    label: "High Priority",
    value: "4",
    change: "Needs attention",
    positive: false,
    icon: (
      <svg
        width="20"
        height="20"
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
    accent: "bg-[#FFF3E0] text-[#F57C00]",
    bar: "bg-[#F57C00]",
    barWidth: "w-1/3",
  },
  {
    label: "Pending Review",
    value: "7",
    change: "3 awaiting you",
    positive: null,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    accent: "bg-[#EDE9FE] text-[#7C3AED]",
    bar: "bg-[#7C3AED]",
    barWidth: "w-7/12",
  },
  {
    label: "Unfinished",
    value: "3",
    change: "Past deadline",
    positive: false,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    accent: "bg-[#FEE2E2] text-[#DC2626]",
    bar: "bg-[#DC2626]",
    barWidth: "w-1/4",
  },
];

export default function StatBoxes() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-3 rounded-2xl border border-[#EDE8E2] bg-white p-4 sm:gap-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#B0ADA7] sm:text-xs">
                {stat.label}
              </p>
              <p
                className="mt-1 text-2xl font-extrabold tracking-tight text-[#1A1916] sm:text-3xl"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                {stat.value}
              </p>
            </div>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${stat.accent}`}>
              {stat.icon}
            </span>
          </div>

          <div>
            <div className="h-1.5 w-full rounded-full bg-[#F2EDE7]">
              <div
                className={`h-1.5 rounded-full ${stat.bar} ${stat.barWidth}`}
              />
            </div>
            <p
              className={`mt-2 text-[11px] font-medium sm:text-xs ${
                stat.positive === false ? "text-[#DC2626]"
                : stat.positive === true ? "text-[#16A34A]"
                : "text-[#72706A]"
              }`}>
              {stat.positive === true && "↑ "}
              {stat.positive === false && "↓ "}
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
