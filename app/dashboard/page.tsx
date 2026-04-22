import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import HeroSection from "../components/HeroSection";
import StatBoxes from "../components/StatBoxes";
import ProjectCard from "../components/ProjectCard";

const PROJECTS = [
  {
    title: "Redesign Landing Page",
    description:
      "Update the marketing site with new brand guidelines and improved conversion flow.",
    status: "In Progress",
    progress: 65,
    dueDate: "Apr 30",
    tasksDone: 8,
    tasksTotal: 12,
    priority: "High",
    avatars: [
      { initials: "JK", bg: "bg-[#E8610A]" },
      { initials: "ML", bg: "bg-[#B84A06]" },
    ],
  },
  {
    title: "API Integration v2",
    description:
      "Migrate all endpoints to the new REST API and add Webhook support for third-party apps.",
    status: "Review",
    progress: 88,
    dueDate: "Apr 25",
    tasksDone: 14,
    tasksTotal: 16,
    priority: "High",
    avatars: [
      { initials: "SR", bg: "bg-[#7C3AED]" },
      { initials: "JK", bg: "bg-[#E8610A]" },
      { initials: "TA", bg: "bg-[#B84A06]" },
    ],
  },
  {
    title: "Mobile App Onboarding",
    description:
      "Design and implement the new 4-step onboarding flow for iOS and Android users.",
    status: "In Progress",
    progress: 40,
    dueDate: "May 10",
    tasksDone: 4,
    tasksTotal: 10,
    priority: "Medium",
    avatars: [{ initials: "ML", bg: "bg-[#B84A06]" }],
  },
  {
    title: "Q2 Analytics Dashboard",
    description:
      "Build internal reporting views for the sales and marketing teams with real-time data.",
    status: "On Hold",
    progress: 20,
    dueDate: "May 20",
    tasksDone: 2,
    tasksTotal: 9,
    priority: "Low",
    avatars: [
      { initials: "TA", bg: "bg-[#B84A06]" },
      { initials: "SR", bg: "bg-[#7C3AED]" },
    ],
  },
  {
    title: "Auth & Permissions Refactor",
    description:
      "Overhaul role-based access control and add SSO support across all workspaces.",
    status: "In Progress",
    progress: 55,
    dueDate: "May 5",
    tasksDone: 6,
    tasksTotal: 11,
    priority: "High",
    avatars: [{ initials: "JK", bg: "bg-[#E8610A]" }],
  },
  {
    title: "Documentation Site",
    description:
      "Write and publish developer docs, API reference, and tutorial guides.",
    status: "Completed",
    progress: 100,
    dueDate: "Apr 15",
    tasksDone: 18,
    tasksTotal: 18,
    priority: "Low",
    avatars: [
      { initials: "ML", bg: "bg-[#B84A06]" },
      { initials: "JK", bg: "bg-[#E8610A]" },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <div className="hidden md:block">
          <TopBar />
        </div>

        <div className="md:hidden border-b border-[#EDE8E2] bg-white px-4 pt-4 pb-3">
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0ADA7]">
              <svg
                width="14"
                height="14"
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
              className="w-full rounded-xl border border-[#E8E4DE] bg-[#F9F7F4] py-2 pl-9 pr-4 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none focus:border-[#E8610A] focus:bg-white"
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            <HeroSection />

            <StatBoxes />

            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    className="text-base font-bold text-[#1A1916] sm:text-lg"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    All Projects
                  </h2>
                  <p className="text-xs text-[#B0ADA7]">
                    12 projects · 4 active
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl border border-[#EDE8E2] bg-white p-1 overflow-x-auto">
                  {["All", "Active", "Review", "Completed"].map((tab, i) => (
                    <button
                      key={tab}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        i === 0 ?
                          "bg-[#E8610A] text-white"
                        : "text-[#72706A] hover:bg-[#F2EDE7] hover:text-[#1A1916]"
                      }`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {PROJECTS.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <button
        className="md:hidden fixed bottom-6 right-5 z-50 flex items-center gap-2 rounded-2xl bg-[#E8610A] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E8610A]/30 transition-all hover:bg-[#D15508] active:scale-95"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
        Add Project
      </button>
    </div>
  );
}
