"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import HeroSection from "../components/HeroSection";
import StatBoxes from "../components/StatBoxes";
import ProjectCard from "../components/ProjectCard";
import { AlertContainer, useAlert } from "../components/Alert";
import LoadingSpinner, { SkeletonCard } from "../components/LoadingSpinner";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useProjects,
  type Priority,
  type ProjectType,
} from "@/app/hooks/useProject";

type FilterTab = "All" | Priority | ProjectType;

const FILTER_TABS: FilterTab[] = ["All", "High", "Moderate", "Low"];

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, authLoading } = useAuth();
  const {
    projects,
    loading,
    error,
    deleteProject,
    updateDailyPlan,
    toggleStar,
  } = useProjects(user, authLoading);

  const { toasts, remove, show } = useAlert();

  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  useEffect(() => {
    if (pathname !== "/dashboard") return;
    const raw = sessionStorage.getItem("pendingToast");
    if (!raw) return;
    try {
      const { type, title, message } = JSON.parse(raw);
      show(type, message, title);
      sessionStorage.removeItem("pendingToast");
    } catch {}
  }, [pathname, show]);

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "All") return true;
    return p.priority === activeTab || p.projectType === activeTab;
  });

  const handleDeleteProject = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      show("success", "Project removed successfully.", "Project deleted");
      return true;
    }
    show("error", "Something went wrong. Please try again.", "Delete failed");
    return false;
  };

  const isLoading = loading || authLoading;

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            {/* Pass projects to HeroSection */}
            <HeroSection projects={projects} />

            {/* Pass projects to StatBoxes */}
            <StatBoxes projects={projects} />

            <div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    className="text-base font-bold text-[#1A1916] sm:text-lg"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    All Projects
                  </h2>
                  <p className="text-xs text-[#B0ADA7]">
                    {isLoading ?
                      "Loading…"
                    : `${filteredProjects.length} project${filteredProjects.length !== 1 ? "s" : ""}`
                    }
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-xl border border-[#EDE8E2] bg-white p-1 overflow-x-auto">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === tab ?
                          "bg-[#E8610A] text-white"
                        : "text-[#72706A] hover:bg-[#F2EDE7] hover:text-[#1A1916]"
                      }`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* ── Loading state ── */}
              {isLoading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <SkeletonCard count={3} />
                </div>
              )}

              {/* ── Empty: no projects ── */}
              {!isLoading && !error && projects.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D1CA] bg-white py-16 px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0E7]">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E8610A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      <line x1="12" y1="11" x2="12" y2="17" />
                      <line x1="9" y1="14" x2="15" y2="14" />
                    </svg>
                  </div>
                  <h3
                    className="mb-1 text-sm font-semibold text-[#1A1916]"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    No projects yet
                  </h3>
                  <p className="mb-5 max-w-xs text-xs leading-relaxed text-[#B0ADA7]">
                    Create your first project to start tracking tasks, progress,
                    and your team&apos;s work.
                  </p>
                  <button
                    onClick={() => router.push("/AddProjectPage")}
                    className="flex items-center gap-2 rounded-xl bg-[#E8610A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508] active:scale-[0.987]">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add your first project
                  </button>
                </div>
              )}

              {/* ── Empty: filter has no results ── */}
              {!isLoading &&
                !error &&
                projects.length > 0 &&
                filteredProjects.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D1CA] bg-white py-12 px-6 text-center">
                    <p className="text-sm font-medium text-[#72706A]">
                      No projects match this filter.
                    </p>
                    <button
                      onClick={() => setActiveTab("All")}
                      className="mt-3 text-xs font-semibold text-[#E8610A] hover:underline">
                      Clear filter
                    </button>
                  </div>
                )}

              {/* ── Project grid ── */}
              {!isLoading && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.title}
                      description={project.description}
                      projectType={project.projectType}
                      priority={project.priority}
                      imageUrl={project.imageUrl}
                      projectUrl={project.projectUrl}
                      progress={project.progress}
                      startDate={project.startDate}
                      endDate={project.endDate}
                      selectedTools={project.selectedTools}
                      dailyPlan={project.dailyPlan}
                      starred={project.starred}
                      userId={project.userId}
                      currentUserId={user?.uid}
                      onDeleteProject={handleDeleteProject}
                      onUpdateDailyPlan={updateDailyPlan}
                      onToggleStar={async (id) => {
                        await toggleStar(id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AlertContainer toasts={toasts} onRemove={remove} position="top-center" />
    </div>
  );
}
