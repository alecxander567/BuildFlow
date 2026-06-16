"use client";

import { AlertContainer, useAlert } from "@/app/components/Alert";
import { useProjectsView, type SortOption } from "@/app/hooks/useProjectsView";
import ProjectCard from "@/app/components/ProjectCard";
import { useAuth } from "@/app/hooks/useAuth";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/Topbar";
import { useUsers } from "@/app/hooks/useUsers";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)] bg-gradient-to-br from-[var(--bg-accent-soft)] to-[var(--bg-card)] p-5 transition-shadow hover:shadow-md">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent)] opacity-10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            {label}
          </p>
          <p
            className="mt-1.5 text-3xl font-bold tracking-tight text-[var(--accent)]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

const SortIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="9" y1="18" x2="15" y2="18" />
  </svg>
);

const GridIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--bg-accent-soft)] text-[var(--accent)] shrink-0">
        {icon}
      </div>
      <div>
        <h2
          className="text-sm font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {title}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-[var(--border)] ml-2" />
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const { toasts, remove } = useAlert();
  const {
    projects,
    loading,
    error,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    stats,
    selectedProjectIds,
    selectAll,
    clearSelection,
    bulkDelete,
    isAllSelected,
    isSomeSelected,
    deleteProject,
    toggleStar,
    updateDailyPlan,
    refetch,
  } = useProjectsView();

  const { getUserById } = useUsers();
  const myProjects = projects.filter((p) => p.userId === user?.uid);
  const otherProjects = projects.filter((p) => p.userId !== user?.uid);

  const gridClass =
    viewMode === "grid" ?
      "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    : "flex flex-col gap-3";

  return (
    <div
      className="flex h-screen overflow-hidden bg-[var(--bg-base)]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main className="flex-1 overflow-y-auto">
          <AlertContainer
            toasts={toasts}
            onRemove={remove}
            position="top-right"
          />

          {/* Loading */}
          {loading && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Loading projects...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Something went wrong
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.987]">
                Try Again
              </button>
            </div>
          )}

          {/* Main Content */}
          {!loading && !error && (
            <div className="px-4 py-5 sm:px-6 md:px-8 md:py-7">
              <div className="mx-auto max-w-6xl flex flex-col gap-6 md:gap-7">
                {/* Page header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1
                      className="text-base font-bold text-[var(--text-primary)] sm:text-lg"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      Projects
                    </h1>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                      {`${projects.length} project${projects.length !== 1 ? "s" : ""} total`}
                      {searchQuery && ` · filtering by "${searchQuery}"`}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <SortIcon />
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as SortOption)
                        }
                        className="h-9 appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] pl-9 pr-7 text-xs transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10 cursor-pointer">
                        <optgroup label="Featured">
                          <option value="starred">Starred First</option>
                        </optgroup>
                        <optgroup label="Date">
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </optgroup>
                        <optgroup label="Progress">
                          <option value="progress-high">
                            Progress: High → Low
                          </option>
                          <option value="progress-low">
                            Progress: Low → High
                          </option>
                        </optgroup>
                        <optgroup label="Name">
                          <option value="title-asc">Title: A → Z</option>
                          <option value="title-desc">Title: Z → A</option>
                        </optgroup>
                      </select>
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>

                    <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        title="Grid view"
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                          viewMode === "grid" ?
                            "bg-[var(--accent)] text-white shadow-sm"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
                        }`}>
                        <GridIcon />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        title="List view"
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                          viewMode === "list" ?
                            "bg-[var(--accent)] text-white shadow-sm"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
                        }`}>
                        <ListIcon />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {stats.total > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <StatCard
                      label="Total Projects"
                      value={stats.total}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Active"
                      value={stats.active}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Completed"
                      value={stats.completed}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Avg Progress"
                      value={`${stats.averageProgress}%`}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {/* Bulk selection bar */}
                {isSomeSelected && (
                  <div className="flex items-center justify-between rounded-xl border border-[var(--accent)] bg-[var(--bg-accent-soft)] px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={selectAll}
                          className="h-4 w-4 rounded border-[var(--accent)] text-[var(--accent)] focus:ring-[var(--accent)]"
                        />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {selectedProjectIds.size}{" "}
                          {selectedProjectIds.size === 1 ?
                            "project"
                          : "projects"}{" "}
                          selected
                        </span>
                      </label>
                      <button
                        onClick={clearSelection}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                        Clear
                      </button>
                    </div>
                    <button
                      onClick={bulkDelete}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 active:scale-[0.987]">
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
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                      Delete Selected
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {projects.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-dashed)] bg-[var(--bg-card)] py-16 px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-accent-soft)]">
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
                      className="mb-1 text-sm font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      No projects yet
                    </h3>
                    <p className="mb-5 max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
                      Create your first project to start tracking tasks,
                      progress, and your team&apos;s work.
                    </p>
                    <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.987]">
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

                {/* My Projects */}
                {myProjects.length > 0 && (
                  <section>
                    <SectionHeader
                      title="My Projects"
                      subtitle={`${myProjects.length} project${myProjects.length !== 1 ? "s" : ""} created by you`}
                      icon={
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      }
                    />
                    <div className={gridClass}>
                      {myProjects.map((project) => (
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
                          starredBy={project.starredBy}
                          userId={project.userId}
                          currentUserId={user?.uid}
                          currentUserEmail={user?.email ?? undefined}
                          onDeleteProject={deleteProject}
                          onUpdateDailyPlan={updateDailyPlan}
                          onToggleStar={toggleStar}
                          ownerEmail={getUserById(project.userId)?.email}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Other Users' Projects */}
                {otherProjects.length > 0 && (
                  <section>
                    <SectionHeader
                      title="From Other Users"
                      subtitle={`${otherProjects.length} project${otherProjects.length !== 1 ? "s" : ""} shared by the community`}
                      icon={
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      }
                    />
                    <div className={gridClass}>
                      {otherProjects.map((project) => (
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
                          starredBy={project.starredBy}
                          userId={project.userId}
                          currentUserId={user?.uid}
                          currentUserEmail={user?.email ?? undefined}
                          onDeleteProject={deleteProject}
                          onUpdateDailyPlan={updateDailyPlan}
                          onToggleStar={toggleStar}
                          ownerEmail={getUserById(project.userId)?.email}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
