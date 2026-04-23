"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import HeroSection from "../components/HeroSection";
import StatBoxes from "../components/StatBoxes";
import ProjectCard from "../components/ProjectCard";
import { AlertContainer, useAlert } from "../components/Alert";
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
  const { projects, loading, error, deleteProject } = useProjects(
    user,
    authLoading,
  );
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
                    {loading ?
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

              {(loading || authLoading) && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 animate-pulse rounded-2xl border border-[#EDE8E2] bg-white"
                    />
                  ))}
                </div>
              )}

              {!loading && !authLoading && !error && projects.length === 0 && (
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

              {!loading &&
                !authLoading &&
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

              {!loading && !authLoading && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      {...project}
                      onDeleteProject={handleDeleteProject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <button
        onClick={() => router.push("/AddProjectPage")}
        className="md:hidden fixed bottom-20 sm:bottom-12 right-5 z-50 flex items-center gap-2 rounded-2xl bg-[#E8610A] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E8610A]/30 transition-all hover:bg-[#D15508] active:scale-95"
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

      <AlertContainer toasts={toasts} onRemove={remove} position="top-center" />
    </div>
  );
}
